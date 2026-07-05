<!--
  SystemNodesView — 2026 "Vibrant" node manager (Administration → Nodes).
  Ports plugin-ui's SystemNodeView logic (rest/node list + create/edit via the
  node dialog + delete of instances) onto the Vibrant chrome: breadcrumb-chip
  header, KPI stat cards with a computed status dot + bi-colour health bar, a custom type filter (same
  picker pattern as the locale selector), VibrantDataTable with NodeIcon
  branding, a coloured type pill, NodeModeChip, a glowing status dot and
  edit/delete row actions. Mockup ref: viewNodes.
-->
<template>
  <div class="nodes lj-surface">
    <LjPageHeader :title="t('system.node.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.node.title'), current: true }]">
      <template #subtitle>
        <b>{{ items.length }}</b> {{ t('system.node.countLabel') }}<span v-if="filter !== 'all'"> · {{ filtered.length }} {{ t('system.node.filtered') }}</span>
      </template>
      <template #actions>
        <div class="vsel" :class="{ open: filterOpen }" ref="filterSel">
          <button type="button" class="vsel-btn" @click="filterOpen = !filterOpen">
            <v-icon size="16">{{ currentFilter.icon }}</v-icon><span class="vlabel">{{ currentFilter.label }}</span><span class="vcaret">▾</span>
          </button>
          <div v-if="filterOpen" class="vsel-menu">
            <button v-for="f in FILTERS" :key="f.id" type="button" class="vsel-opt" :class="{ sel: f.id === filter }" @click="pickFilter(f.id)">
              <v-icon size="16">{{ f.icon }}</v-icon><span class="vlabel">{{ f.label }}</span><span v-if="f.id === filter" class="vok">✓</span>
            </button>
          </div>
        </div>
        <LjButton icon="mdi-plus" @click="startCreate">{{ t('system.node.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <div class="stats">
      <div v-for="(s, i) in stats" :key="s.key" class="stat" :class="{ active: s.fkey && filter === s.fkey, static: !s.fkey }" :style="{ '--c': s.color, 'animation-delay': (i * 50) + 'ms' }" @click="s.fkey && pickFilter(s.fkey)">
        <div class="stop">
          <span class="sicon"><v-icon size="22">{{ s.icon }}</v-icon></span>
          <div class="sbody">
            <div class="snum">{{ s.value }}</div>
            <div class="slabel">{{ s.label }}</div>
          </div>
          <!-- Computed group health as the shared status dot (ok / warn / error
               / idle), with an up-vs-down summary tooltip. -->
          <LjStatus class="sstatus" :status="s.health" :tooltip="s.healthTip" />
        </div>
        <!-- Bi-coloured health bar: green (healthy / up) then red (unhealthy /
             down); the remaining track is nodes with no known status. -->
        <div class="sbar">
          <i class="up" :style="{ width: s.upPct + '%' }" />
          <i class="down" :style="{ width: s.downPct + '%' }" />
        </div>
      </div>
    </div>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <VibrantDataTable :headers="headers" :items="filtered" :items-length="filtered.length" :loading="loading" item-value="id" :empty-text="t('common.noData')" filename="system-nodes.csv" @row-click="startEdit">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span class="nglyph">
            <NodeIcon :node="item" />
          </span>
          <div class="ac-txt">
            <div class="ac-name">{{ item.name || '—' }}</div><code class="ac-key">{{ item.id }}</code>
          </div>
        </div>
      </template>
      <template #cell.type="{ item }"><span class="pill" :class="nodeType(item)">{{ typeLabel(item) }}</span></template>
      <template #cell.mode="{ item }">
        <NodeModeChip :mode="item.mode || 'all'" size="small" />
      </template>
      <!-- Attached subscriptions count (rest/node/status/subscription, loaded
           asynchronously); a dash while unknown / when the node has none. -->
      <template #cell.subscriptions="{ item }">
        <span class="mono subs">{{ subsTotal(item.id) || '—' }}</span>
      </template>
      <template #cell.status="{ item }">
        <SubscriptionStatus :node="item" />
      </template>
      <template #actions="{ item }">
        <!-- Every row gets a status-refresh action in the cog menu; instances
             additionally expose edit / delete. -->
        <RowActionsCog>
          <button :disabled="isRefreshing(item.id)" @click="refreshNode(item)">
            <v-progress-circular v-if="isRefreshing(item.id)" size="18" width="2" indeterminate />
            <v-icon v-else size="18">mdi-refresh</v-icon>{{ t('system.node.refreshStatus') }}
          </button>
          <template v-if="isInstance(item)">
            <div class="sep" />
            <button @click="startEdit(item)"><v-icon size="18">mdi-pencil-outline</v-icon>{{ t('common.edit') }}</button>
            <div class="sep" />
            <button class="danger" @click="startDelete(item)"><v-icon size="18">mdi-delete-outline</v-icon>{{ t('common.delete') }}</button>
          </template>
        </RowActionsCog>
      </template>
      <!-- Table-wide status refresh, appended to the tools cog after a divider
           (separated from the built-in Export / Copy). -->
      <template #tools-extra>
        <button :disabled="refreshingAll" @click="refreshAllStatuses">
          <v-progress-circular v-if="refreshingAll" size="18" width="2" indeterminate />
          <v-icon v-else size="18">mdi-refresh</v-icon>{{ t('system.node.refreshStatuses') }}
        </button>
      </template>
    </VibrantDataTable>

    <NodeEditDialog v-model="createDialog" @saved="onSaved" />
    <NodeEditDialog v-model="editDialog" :node="editTarget" @saved="onSaved" />
    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.node.deleteTitle')" icon="mdi-server-network" confirm-color="error" :confirm-label="t('common.delete')" :loading="deleting"
      @confirm="confirmDelete">
      {{ t('system.node.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget?.name || deleteTarget?.id }}</strong>{{ t('system.node.deleteConfirmAfter') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useApi, useAppStore, useI18nStore, NodeIcon, NodeModeChip, isInstance, nodeType } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjStatus } from '@ligoj/host'
import NodeEditDialog from './NodeEditDialog.vue'
import RowActionsCog from '../components/RowActionsCog.vue'
import SubscriptionStatus from '../components/SubscriptionStatus.vue'
import { statusHeader } from '../useUiHelpers.js'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const TYPE_COLOR = { service: '#2f6df6', feature: '#1d9d63', tool: '#d9701a', instance: '#8b5cf6' }
const items = ref([])
const loading = ref(false)
const error = ref(null)

// Attached-subscriptions per node, loaded asynchronously from
// rest/node/status/subscription (NodeResource#getNodeStatistics). Keyed by node
// id → { total, up, down } (per-subscription statuses folded into up/down).
const subStats = ref({})
function subsTotal(id) { return subStats.value[id]?.total || 0 }
async function loadSubStats() {
  try {
    const d = await api.get('rest/node/status/subscription')
    const list = Array.isArray(d) ? d : (d?.data || [])
    const map = {}
    for (const vo of list) {
      if (!vo?.node) continue
      const values = vo.values || {}
      let up = 0
      let down = 0
      for (const [k, n] of Object.entries(values)) {
        const key = String(k).toLowerCase()
        const c = Number(n) || 0
        if (key === 'total') continue
        else if (key === 'up' || key === 'ok') up += c
        else if (key === 'down' || key === 'ko' || key === 'error' || key === 'warn' || key === 'blocked') down += c
      }
      map[vo.node] = { total: Number(values.total) || 0, up, down }
    }
    subStats.value = map
  } catch { /* keep the previous stats; the column falls back to a dash */ }
}

const FILTERS = computed(() => [
  { id: 'all', label: t('system.node.filterAll'), icon: 'mdi-format-list-bulleted' },
  { id: 'service', label: t('system.node.typeService'), icon: 'mdi-cube-outline' },
  { id: 'tool', label: t('system.node.typeTool'), icon: 'mdi-hammer-wrench' },
  { id: 'instance', label: t('system.node.typeInstance'), icon: 'mdi-server-outline' },
])
const filter = ref('all')
const currentFilter = computed(() => FILTERS.value.find((f) => f.id === filter.value) || FILTERS.value[0])
const filterOpen = ref(false)
const filterSel = ref(null)
function pickFilter(id) { filter.value = id; filterOpen.value = false }
function onDocClick(e) { if (filterSel.value && !filterSel.value.contains(e.target)) filterOpen.value = false }

const filtered = computed(() => filter.value === 'all' ? items.value : items.value.filter((n) => nodeType(n) === filter.value))

const headers = computed(() => [
  // Status first; icon-only header (label in a tooltip), cell is the status icon + tooltip.
  statusHeader({ tooltip: t('system.node.headerStatus'), exportValue: (r) => r.status || (r.enabled === false ? t('system.node.statusDisabled') : '') }),
  { key: 'name', label: t('system.node.headerName'), sortable: true, icon: 'mdi-server-outline' },
  { key: 'type', label: t('system.node.headerType'), sortable: true, align: 'center', icon: 'mdi-shape-outline', exportValue: (r) => typeLabel(r) },
  { key: 'mode', label: t('system.node.headerMode'), sortable: false, align: 'center', icon: 'mdi-cog-outline', exportValue: (r) => r.mode || 'all' },
  // Last data column → renders just before the gear/actions column.
  { key: 'subscriptions', label: t('system.node.subscriptions'), sortable: false, align: 'center', icon: 'mdi-link-variant', exportValue: (r) => subsTotal(r.id) },
])

function typeLabel(item) { const k = nodeType(item); return t('system.node.type' + k.charAt(0).toUpperCase() + k.slice(1)) }

// Operational health of an INSTANCE from its own last status: 'up' (healthy),
// 'down' (a failed/degraded probe or a disabled instance) or 'unknown' (never
// probed). Only instances carry a real runtime status — tools/services below
// aggregate the instances beneath them, not their own (rare) direct probe.
function instanceHealth(n) {
  if (n.enabled === false) return 'down'
  const s = String(n.status ?? '').toLowerCase()
  if (s === 'up' || s === 'ok') return 'up'
  if (s === 'down' || s === 'ko' || s === 'error' || s === 'warn' || s === 'blocked') return 'down'
  return 'unknown'
}

// Roll instance health up the hierarchy: each instance's health is attributed
// to itself and every ancestor via the `refined` parent chain. Returns a Map of
// node id → { up, down } instance counts. A node missing from the map (a tool
// with no instances, an unprobed service) has "no status data" — NOT an error.
function buildHealthIndex(nodes) {
  const idx = new Map()
  for (const n of nodes) {
    if (nodeType(n) !== 'instance') continue
    const h = instanceHealth(n)
    if (h === 'unknown') continue
    let cur = n
    let guard = 0
    while (cur && cur.id && guard++ < 6) {
      const e = idx.get(cur.id) || { up: 0, down: 0 }
      e[h]++
      idx.set(cur.id, e)
      cur = cur.refined
    }
  }
  return idx
}

// Derived health bucket of any node from the instances beneath it.
function derivedHealth(node, idx) {
  const e = idx.get(node.id)
  if (!e || e.up + e.down === 0) return 'unknown'
  return e.down === 0 ? 'up' : 'down'
}

// Build a stat card's dot + bi-colour bar + tooltip from up/down counts over
// `value` items (nodes or subscriptions). `fkey` is the type filter the card
// toggles, or null for a non-filtering card (subscriptions). "No status data"
// (value − up − down) never makes it unhealthy: idle = nothing determinate ·
// ok = no failures · error = all-known failing · warn = mixed.
function healthCard({ key, fkey, label, icon, color, value, up, down }) {
  const unknown = value - up - down
  const known = up + down
  const health = known === 0 ? 'idle' : down === 0 ? 'ok' : up === 0 ? 'error' : 'warn'
  const parts = []
  if (up) parts.push(t('system.node.healthUp', { count: up }))
  if (down) parts.push(t('system.node.healthDown', { count: down }))
  if (unknown) parts.push(t('system.node.healthUnknown', { count: unknown }))
  const denom = value || 1
  return {
    key, fkey, label, icon, color, value, health,
    upPct: Math.round(up / denom * 100),
    downPct: Math.round(down / denom * 100),
    healthTip: parts.length ? parts.join(' · ') : t('system.node.healthNone'),
  }
}

const stats = computed(() => {
  const nodes = items.value
  const idx = buildHealthIndex(nodes)
  const nodesOf = (fkey) => fkey === 'all' ? nodes : nodes.filter((n) => nodeType(n) === fkey)
  const typeCard = (key, fkey, label, icon, color) => {
    const group = nodesOf(fkey)
    let up = 0
    let down = 0
    for (const n of group) {
      const h = derivedHealth(n, idx)
      if (h === 'up') up++
      else if (h === 'down') down++
    }
    return healthCard({ key, fkey, label, icon, color, value: group.length, up, down })
  }
  // Subscriptions KPI: total attached subscriptions across nodes + their health.
  const sub = Object.values(subStats.value).reduce((a, s) => {
    a.value += s.total
    a.up += s.up
    a.down += s.down
    return a
  }, { value: 0, up: 0, down: 0 })
  return [
    typeCard('total', 'all', t('system.node.statTotal'), 'mdi-server-network', 'rgb(var(--v-theme-secondary))'),
    typeCard('service', 'service', t('system.node.typeService'), 'mdi-cube-outline', TYPE_COLOR.service),
    typeCard('tool', 'tool', t('system.node.typeTool'), 'mdi-hammer-wrench', TYPE_COLOR.tool),
    typeCard('instance', 'instance', t('system.node.typeInstance'), 'mdi-server-outline', TYPE_COLOR.instance),
    healthCard({ key: 'subs', fkey: null, label: t('system.node.subscriptions'), icon: 'mdi-link-variant', color: '#0ea5a4', value: sub.value, up: sub.up, down: sub.down }),
  ]
})

async function load() {
  loading.value = true; error.value = null
  loadSubStats() // async, non-blocking: fills the Subscriptions column + KPI when ready
  // status=true → NodeResource#findAll also returns each node's last known status.
  // rows=1000 → defeat PaginationJson's default 10-row page; this view does its
  // own client-side filter / sort / paging over the full set (like the wizard).
  try { const d = await api.get('rest/node?status=true&rows=1000'); items.value = Array.isArray(d) ? d : (d?.data || []) }
  catch { error.value = t('common.loadError') || 'Load error' }
  loading.value = false
}

const createDialog = ref(false)
const editDialog = ref(false)
const editTarget = ref(null)
function startCreate() { createDialog.value = true }
// Only instances are editable: service / tool / feature nodes have no
// parameters to update, so a row click on them is a no-op.
function startEdit(item) { if (!isInstance(item)) return; editTarget.value = item; editDialog.value = true }
function onSaved() { load() }

// Status refresh — a single tool node (row action) or every node (tools cog).
// Both POST NodeResource's status/refresh endpoints then reload, so the new
// node status (and any cascaded subscription status) shows. `silent: true`
// keeps the global error snackbar quiet: a failed probe just leaves the
// previous status untouched. A per-id Set drives the row spinner (re-keyed on
// change so the ref reacts) and survives the reload since it keys by node id.
const refreshingIds = ref(new Set())
const refreshingAll = ref(false)
function isRefreshing(id) { return refreshingIds.value.has(id) }
async function refreshNode(item) {
  const id = item?.id
  if (id == null || refreshingIds.value.has(id)) return
  refreshingIds.value = new Set(refreshingIds.value).add(id)
  try { await api.post(`rest/node/status/refresh/${encodeURIComponent(id)}`, null, { silent: true }); await load() }
  finally { const s = new Set(refreshingIds.value); s.delete(id); refreshingIds.value = s }
}
async function refreshAllStatuses() {
  if (refreshingAll.value) return
  refreshingAll.value = true
  try { await api.post('rest/node/status/refresh', null, { silent: true }); await load() }
  finally { refreshingAll.value = false }
}

const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)
function startDelete(item) { deleteTarget.value = item; deleteDialog.value = true }
async function confirmDelete() {
  deleting.value = true
  try { await api.del(`rest/node/${encodeURIComponent(deleteTarget.value.id)}`); deleteDialog.value = false; load() }
  finally { deleting.value = false }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  app.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.node.title') }], { refresh: load })
  load()
})
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
/* View-specific styling only — chrome (header, primary button, row icon
   buttons) comes from the shared host components + the global `.lj-surface`
   / `.lj-iconbtn` classes, which supply the ink, pill, radius, mono,
   surface and card vars these rules read. The `.vsel` type-filter dropdown
   is bespoke (no shared equivalent) and stays here. */
.sub b {
  color: var(--ink-2);
  font-family: var(--mono);
}

.vsel {
  position: relative;
}

.vsel-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  background: var(--surface);
  color: var(--ink-2);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
  transition: border-color .15s;
}

.vsel-btn:hover {
  border-color: var(--border-2);
}

.vcaret {
  color: var(--ink-3);
  font-size: 11px;
  transition: transform .2s;
}

.vsel.open .vcaret {
  transform: rotate(180deg);
}

.vsel-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 190px;
  background: var(--surface);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 5px;
  z-index: 20;
  animation: vmenu .12s ease;
}

@keyframes vmenu {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.vsel-opt {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  border: 0;
  background: transparent;
  border-radius: var(--radius-sm);
  color: var(--ink);
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.vsel-opt:hover {
  background: var(--hover);
}

.vsel-opt.sel {
  color: var(--accent);
}

.vlabel {
  white-space: nowrap;
}

.vok {
  margin-left: auto;
  color: var(--accent);
  font-weight: 800;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  border-radius: var(--radius);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 9%, var(--card)), var(--card));
  box-shadow: var(--shadow);
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  animation: rise .5s cubic-bezier(.2, .7, .3, 1) forwards;
  transition: transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s, border-color .18s;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: none;
  }
}

.stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px -20px color-mix(in srgb, var(--c) 55%, transparent);
  border-color: color-mix(in srgb, var(--c) 30%, var(--border));
}

.stat.active {
  border-color: color-mix(in srgb, var(--c) 55%, var(--border));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 45%, transparent);
}

/* The Subscriptions KPI is informational only — it toggles no type filter. */
.stat.static {
  cursor: default;
}

.stop {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sstatus {
  margin-left: auto;
  --lj-status-size: 12px;
}

.sicon {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  flex: none;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 70%, #000));
  box-shadow: 0 8px 18px -8px color-mix(in srgb, var(--c) 65%, transparent);
}

.snum {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 26px;
  line-height: 1;
  color: var(--ink);
}

.slabel {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-3);
  margin-top: 4px;
}

.sbar {
  height: 6px;
  border-radius: 4px;
  background: var(--pill);
  overflow: hidden;
  display: flex;
}

.sbar i {
  display: block;
  height: 100%;
  transition: width .5s cubic-bezier(.2, .7, .3, 1);
}

/* Healthy (up) then unhealthy (down); leftover width stays the grey track. */
.sbar .up {
  background: linear-gradient(90deg, #1d9d63, #37b877);
}

.sbar .down {
  background: linear-gradient(90deg, #df4d42, #e8756c);
}

.errline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--v-theme-error));
  margin: 0 0 14px;
}

.avatar-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nglyph {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  flex: none;
  display: grid;
  place-items: center;
  background: var(--pill);
}

.nglyph :deep(img.tool-icon) {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.nglyph :deep(i) {
  font-size: 20px;
  color: var(--ink-2);
}

.ac-name {
  font-family: var(--font);
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
  line-height: 1.2;
}

.ac-key {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--ink-3);
}

.subs {
  font-family: var(--mono);
  color: var(--ink-2);
}

.pill {
  display: inline-flex;
  align-items: center;
  font-family: var(--font);
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .03em;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--ink-2);
  background: var(--pill);
}

.pill.service {
  color: #2f6df6;
  background: rgba(47, 109, 246, .13);
}

.pill.tool {
  color: #d9701a;
  background: rgba(255, 122, 24, .14);
}

.pill.feature {
  color: #1d9d63;
  background: rgba(29, 157, 99, .14);
}

.pill.instance {
  color: #8b5cf6;
  background: rgba(139, 92, 246, .14);
}

</style>
