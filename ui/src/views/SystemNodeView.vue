<!--
  SystemNodesView — 2026 "Vibrant" node manager (Administration → Nodes).
  Ports plugin-ui's SystemNodeView logic (rest/node list + create/edit via the
  node dialog + delete of instances) onto the Vibrant chrome: breadcrumb-chip
  header, KPI stat cards with proportion bars, a custom type filter (same
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
      <div v-for="(s, i) in stats" :key="s.key" class="stat" :class="{ active: filter === s.fkey }" :style="{ '--c': s.color, 'animation-delay': (i * 50) + 'ms' }" @click="pickFilter(s.fkey)">
        <div class="stop">
          <span class="sicon"><v-icon size="22">{{ s.icon }}</v-icon></span>
          <div class="sbody">
            <div class="snum">{{ s.value }}</div>
            <div class="slabel">{{ s.label }}</div>
          </div>
        </div>
        <div class="sbar"><i :style="{ width: s.pct + '%' }" /></div>
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
      <template #cell.enabled="{ item }">
        <span class="status"><span class="sdot" :class="item.enabled ? 'ok' : 'err'" />{{ item.enabled ? t('system.node.statusEnabled') : t('system.node.statusDisabled') }}</span>
      </template>
      <template #actions="{ item }">
        <!-- Only instances can be edited/deleted; service/tool/feature nodes
             have no actions, so the cog menu is omitted for them. -->
        <v-menu v-if="isInstance(item)" location="bottom end">
          <template #activator="{ props }">
            <button class="lj-iconbtn" v-bind="props" :aria-label="t('common.actions')" @click.stop><v-icon size="18">mdi-cog</v-icon></button>
          </template>
          <div class="lj-popmenu">
            <button @click="startEdit(item)"><v-icon size="18">mdi-pencil-outline</v-icon>{{ t('common.edit') }}</button>
            <div class="sep" />
            <button class="danger" @click="startDelete(item)"><v-icon size="18">mdi-delete-outline</v-icon>{{ t('common.delete') }}</button>
          </div>
        </v-menu>
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
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton } from '@ligoj/host'
import NodeEditDialog from './NodeEditDialog.vue'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const TYPE_COLOR = { service: '#2f6df6', feature: '#1d9d63', tool: '#d9701a', instance: '#8b5cf6' }
const items = ref([])
const loading = ref(false)
const error = ref(null)

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
  { key: 'name', label: t('system.node.headerName'), sortable: true, icon: 'mdi-server-outline' },
  { key: 'type', label: t('system.node.headerType'), sortable: true, align: 'center', icon: 'mdi-shape-outline', exportValue: (r) => typeLabel(r) },
  { key: 'mode', label: t('system.node.headerMode'), sortable: false, align: 'center', icon: 'mdi-cog-outline', exportValue: (r) => r.mode || 'all' },
  { key: 'enabled', label: t('system.node.headerStatus'), sortable: true, icon: 'mdi-power', exportValue: (r) => (r.enabled ? t('system.node.statusEnabled') : t('system.node.statusDisabled')) },
])

function typeLabel(item) { const k = nodeType(item); return t('system.node.type' + k.charAt(0).toUpperCase() + k.slice(1)) }

const stats = computed(() => {
  const by = (ty) => items.value.filter((n) => nodeType(n) === ty).length
  const total = items.value.length || 1
  const mk = (key, fkey, label, icon, color, value) => ({ key, fkey, label, icon, color, value, pct: fkey === 'all' ? 100 : Math.round(value / total * 100) })
  return [
    mk('total', 'all', t('system.node.statTotal'), 'mdi-server-network', 'rgb(var(--v-theme-secondary))', items.value.length),
    mk('service', 'service', t('system.node.typeService'), 'mdi-cube-outline', TYPE_COLOR.service, by('service')),
    mk('tool', 'tool', t('system.node.typeTool'), 'mdi-hammer-wrench', TYPE_COLOR.tool, by('tool')),
    mk('instance', 'instance', t('system.node.typeInstance'), 'mdi-server-outline', TYPE_COLOR.instance, by('instance')),
  ]
})

async function load() {
  loading.value = true; error.value = null
  try { const d = await api.get('rest/node'); items.value = Array.isArray(d) ? d : (d?.data || []) }
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

.stop {
  display: flex;
  align-items: center;
  gap: 14px;
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
}

.sbar i {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, white));
  transition: width .5s cubic-bezier(.2, .7, .3, 1);
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

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink-2);
}

.sdot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  position: relative;
}

.sdot::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: currentColor;
  opacity: .2;
}

.sdot.ok {
  background: #1d9d63;
  color: #1d9d63;
}

.sdot.err {
  background: #df4d42;
  color: #df4d42;
}
</style>
