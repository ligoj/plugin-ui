<!--
  ProjectDetailView — 2026 "Vibrant" project detail. Faithful to the validated
  mockup (design/ligoj-2026-prototype.html → viewProject): a header with the
  project name/key + a "subscribe" CTA, then a grid of tool cards. Each card
  groups the project's subscriptions by their tool (service), shows the tool
  glyph (real plugin logo via the host's NodeIcon), a per-subscription row list
  (status dot + name + pills) and a footer health bar.

  Real wiring: rest/project/:id for the project + its subscriptions, then
  rest/subscription/status/refresh to pull the live status/data of each one
  (mirrors plugin-ui's ProjectDetailView). Falls back to the mockup's sample
  tools when the backend has no such project, so the detail is never empty in
  preview.
-->
<template>
  <div class="pdetail lj-surface">
    <LjPageHeader :title="project?.name || '…'">
      <template #subtitle>
        <span class="pkey">{{ project?.pkey }}</span>
        <span class="dot">·</span>
        <b>{{ subscriptions.length }}</b> {{ t('project.detail.subscriptions').toLowerCase() }}
      </template>
      <template #actions>
        <LjButton v-if="project" variant="ghost" icon="mdi-clock-outline" @click="auditDialog = true">{{ t('common.audit') || 'Audit' }}</LjButton>
        <LjButton variant="ghost" icon="mdi-pencil" @click="editDialog = true">{{ t('project.detail.edit') }}</LjButton>
        <LjButton icon="mdi-plus" @click="openSubscribe">{{ t('project.detail.addSubscription') }}</LjButton>
      </template>
    </LjPageHeader>

    <!-- Audit strip -->
    <div v-if="project && (project.teamLeader || project.description)" class="meta">
      <span v-if="project.teamLeader"><v-icon size="15">mdi-account-star</v-icon>{{ leaderName }}</span>
      <span v-if="project.description" class="desc">{{ project.description }}</span>
    </div>

    <SubscriptionsPanel :groups="groups" :loading="loading && !groups.length" default-view="list" storage-key="project" @rowmenu="onRowMenu">
      <template #empty>
        <div class="empty">
          <v-icon size="44" color="rgba(var(--v-theme-on-surface),.25)">mdi-cloud-off-outline</v-icon>
          <p>{{ t('project.detail.noSubscriptions') }}</p>
          <LjButton icon="mdi-plus" @click="openSubscribe">{{ t('project.detail.addSubscription') }}</LjButton>
        </div>
      </template>
    </SubscriptionsPanel>

    <ProjectEditDialog v-model="editDialog" :project="project" @saved="load" />
    <SubscribeWizardDialog v-model="subscribeDialog" :project-id="project?.id" :project-name="project?.name" @saved="load" />
    <AuditDialog v-model="auditDialog" :target="project" />

    <div v-if="rowMenu.open" class="rowmenu-bg" @click="closeRowMenu">
      <div class="rowmenu" :style="{ top: rowMenu.y + 'px', left: (rowMenu.x - 180) + 'px' }" @click.stop>
        <!-- Host-owned action. Per-subscription "Configure" is NOT a generic
             route — it's a plugin concern surfaced through the plugin's own
             `renderFeatures` button (e.g. the VM Configure cog), rendered
             inline on the row. The host menu keeps only unsubscribe. -->
        <button class="danger" @click="deleteSub"><v-icon size="16">mdi-delete-outline</v-icon>{{ t('project.detail.unsubscribe') || t('common.delete') || 'Supprimer' }}</button>
      </div>
    </div>

    <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import { useRoute } from 'vue-router'
import { useApi, useAppStore, useI18nStore, NodeIcon, VIcon, LjPageHeader, LjButton } from '@ligoj/host'
import ProjectEditDialog from './ProjectEditDialog.vue'
import SubscribeWizardDialog from './SubscribeWizardView.vue'
import AuditDialog from '../components/AuditDialog.vue'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'

const route = useRoute()
const api = useApi()
const appStore = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

/* Tool brand colours (mockup palette) used to tint each tool card. Keyed by
   tool name; unknown tools fall back to the cockpit blue. */
const TOOL_COLORS = {
  Jira: '#2563eb', Jenkins: '#d33833', LDAP: '#15a06a', SonarQube: '#4e9bcd',
  Confluence: '#e6a019', 'AWS EC2': '#7cb518', GitLab: '#7759c2',
  'Provisioning AWS': '#ff7a18', 'Squash TM': '#e0524a',
}
function toolColor(name) {
  if (TOOL_COLORS[name]) return TOOL_COLORS[name]
  // Deterministic hue from the name so real tools still get a stable colour.
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return `hsl(${Math.abs(hash) % 360} 62% 52%)`
}

/* Map a backend status (NodeStatus UP/DOWN, or a string) to a mockup dot. */
function statusDot(raw) {
  const s = String(raw?.status ?? raw ?? '').toLowerCase()
  if (s === 'up' || s === 'ok') return 'ok'
  if (s === 'down' || s === 'error' || s === 'ko') return 'err'
  if (s === 'warn' || s === 'blocked') return 'warn'
  return 'idle'
}

const project = ref(null)
const loading = ref(false)

const subscriptions = computed(() => project.value?.subscriptions || [])
const leaderName = computed(() => {
  const l = project.value?.teamLeader
  if (!l) return ''
  return [l.firstName, l.lastName].filter(Boolean).join(' ') || l.id || ''
})

/* Group the project's subscriptions by their tool (node.refined) into cockpit
   cards. Each row is one subscription; health = share of UP rows. */
const groups = computed(() => {
  const byTool = new Map()
  for (const s of subscriptions.value) {
    const node = s.node || {}
    const tool = node.refined || node
    const key = tool.id || node.id || String(s.id)
    if (!byTool.has(key)) {
      byTool.set(key, {
        key,
        name: tool.name || node.name || key,
        kind: node.refined?.refined?.name || tool.id || '',
        color: toolColor(tool.name || node.name),
        icon: () => h(NodeIcon, { node: tool }),
        rows: [],
      })
    }
    const status = statusDot(s.status)
    // No synthetic status / node-name chips — that identity is now carried by
    // the SubscriptionStatus tooltip on the status dot.
    byTool.get(key).rows.push({ name: node.name || node.id || ('#' + s.id), status, pills: [], sub: s })
  }
  const out = [...byTool.values()]
  for (const g of out) {
    const ok = g.rows.filter((r) => r.status === 'ok').length
    g.health = g.rows.length ? ok / g.rows.length : 0
  }
  return out
})

async function load() {
  const id = route.params.id
  loading.value = true
  const data = await api.get(`rest/project/${id}`)
  if (data && data.id != null) {
    project.value = data
    setCrumbs(data.name)
    refreshSubscriptions()
  }
  loading.value = false
}

/* Pull live status/data for each subscription and merge it in (best effort;
   the cards stay usable with the stale data if it fails). */
async function refreshSubscriptions() {
  const subs = project.value?.subscriptions || []
  if (!subs.length) return
  try {
    const q = subs.map((s) => `id=${encodeURIComponent(s.id)}`).join('&')
    const fresh = await api.get(`rest/subscription/status/refresh?${q}`)
    if (!fresh || typeof fresh !== 'object') return
    project.value = {
      ...project.value,
      subscriptions: subs.map((s) => {
        const f = fresh[s.id]
        return f ? { ...s, parameters: f.parameters, data: f.data, status: f.status } : s
      }),
    }
  } catch { /* keep stale */ }
}

function setCrumbs(name) {
  appStore.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('project.title'), to: '/project' }, { title: name }],
    { refresh: load },
  )
}

const editDialog = ref(false)
const subscribeDialog = ref(false)
const auditDialog = ref(false)
function openSubscribe() {
  subscribeDialog.value = true
}

// SubscriptionsPanel emits { event, sub } from a row cog → host overflow menu.
function onRowMenu({ event, sub }) { openRowMenu(event, sub) }

const rowMenu = ref({ open: false, x: 0, y: 0, sub: null })
function openRowMenu(ev, sub) {
  const r = ev.currentTarget.getBoundingClientRect()
  rowMenu.value = { open: true, x: r.right, y: r.bottom + 4, sub }
}
function closeRowMenu() { rowMenu.value.open = false }
async function deleteSub() {
  const s = rowMenu.value.sub
  closeRowMenu()
  if (!s?.id) return
  if (!confirm(t('subscription.deleteConfirm') || 'Supprimer cet abonnement ?')) return
  try { await api.del(`rest/subscription/${s.id}`) } finally { load() }
}

let toastT
const toastMsg = ref('')
function toast(msg) { toastMsg.value = msg; clearTimeout(toastT); toastT = setTimeout(() => (toastMsg.value = ''), 2200) }

watch(() => route.params.id, (id) => { if (id) load() })
onMounted(load)
</script>

<style scoped>
/* View-specific styling only — chrome (page header + primary/ghost buttons)
   comes from the shared host components + the global `.lj-surface` class,
   which supplies the ink, pill, radius, mono, surface, card and border vars
   these cockpit cards read. The `.rowact`/`.rowcog` PluginFeatures cluster, the
   custom `.rowmenu` and the `.toast` are bespoke to this view and PRESERVED.
   The status-dot colour vars below are bespoke. (Back navigation now comes from
   the shell breadcrumb, so the in-page back link was removed.) */
.pdetail {
  --ok: #1d9d63;
  --warn: #d98a16;
  --err: #df4d42;
  --idle: #bcb6a8;
}

/* Subtitle inline bits (slotted into LjPageHeader's `.sub`). */
.pkey {
  display: inline-flex;
  align-items: center;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--ink-2);
  background: var(--pill);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  vertical-align: middle;
}

.dot {
  opacity: .4;
}

.sub b {
  color: var(--ink-2);
  font-family: var(--mono);
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  background: var(--pill);
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 500;
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.meta .desc {
  color: var(--ink-3);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 18px;
}

/* List view (VibrantDataTable) cells. */
.avatar-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.glyph.sm {
  width: 36px;
  height: 36px;
}

.glyph.sm :deep(img.tool-icon),

.glyph.sm :deep(i) {
  font-size: 20px;
}

.ac-name {
  font-family: var(--font);
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}

.ac-kind {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
}

.ln {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}

.lsum {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.card {
  position: relative;
  background: var(--card);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  opacity: 0;
  transform: translateY(12px);
  animation: rise .5s cubic-bezier(.2, .7, .3, 1) forwards;
  transition: transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: none;
  }
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 26px 50px -24px color-mix(in srgb, var(--c) 55%, transparent);
}

.card.skeleton {
  height: 220px;
  animation: none;
  opacity: 1;
  transform: none;
  background: linear-gradient(100deg, var(--card), color-mix(in srgb, var(--ink) 4%, var(--card)), var(--card));
  background-size: 200% 100%;
  animation: shimmer 1.3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.card-head {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px 16px 14px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 16%, var(--card)), color-mix(in srgb, var(--c) 5%, var(--card)));
  border-bottom: 1px solid color-mix(in srgb, var(--c) 16%, var(--border));
}

.glyph {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  flex: none;
  display: grid;
  place-items: center;
  background: var(--card);
  box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--c) 50%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c) 22%, var(--border));
}

.glyph :deep(img.tool-icon) {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.glyph :deep(i) {
  font-size: 24px;
  color: color-mix(in srgb, var(--c) 75%, var(--ink));
}

.card-head .t {
  flex: 1;
  min-width: 0;
}

.card-head .name {
  font-family: var(--font);
  font-weight: var(--bold);
  font-size: 16.5px;
  letter-spacing: -.03em;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-head .kind {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  color: color-mix(in srgb, var(--c) 55%, var(--ink-3));
  text-transform: uppercase;
  letter-spacing: .04em;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count {
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 700;
  color: color-mix(in srgb, var(--c) 65%, var(--ink));
  background: var(--card);
  border: var(--border-w) var(--lj-border-style, solid) color-mix(in srgb, var(--c) 22%, var(--border));
  border-radius: var(--radius-sm);
  padding: 5px 9px;
  white-space: nowrap;
}

.count small {
  opacity: .5;
}

.rows {
  padding: 8px 12px;
  min-height: 52px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 11px;
  transition: background .12s;
}

.row:hover {
  background: color-mix(in srgb, var(--c) 8%, var(--card));
}

.row+.row {
  box-shadow: inset 0 1px 0 var(--border);
}

.st {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: none;
  position: relative;
}

.st::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: currentColor;
  opacity: .18;
}

.st.ok {
  background: var(--ok);
  color: var(--ok);
}

.st.warn {
  background: var(--warn);
  color: var(--warn);
}

.st.err {
  background: var(--err);
  color: var(--err);
}

.st.idle {
  background: var(--idle);
  color: var(--idle);
}

.row .rn {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pills {
  display: flex;
  gap: 5px;
  flex: none;
}

.pill {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  background: var(--pill);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  border-radius: var(--radius-sm);
  padding: 2px 7px;
}

.pill.cost {
  color: #b85b00;
  background: #fff3e6;
  border-color: #ffe0bf;
}

.rowmore {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--v26-font, "Bricolage Grotesque", system-ui, sans-serif);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-3);
  padding: 6px 10px;
  margin-top: 4px;
  border: 0;
  background: rgba(var(--v-theme-on-surface), .05);
  border-radius: 8px;
  cursor: pointer;
  transition: background .14s, color .14s;
}

.rowmore:hover {
  background: rgba(var(--v-theme-on-surface), .1);
  color: var(--ink);
}

/* Row action cluster: plugin-contributed `renderFeatures` buttons +
   the host overflow cog, kept together and pushed to the row's end. */
.rowact {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex: none;
}

/* Plugin buttons come through PluginFeatures as Vuetify <v-btn icon>;
   tighten them to match the row's compact density. */
.rowact :deep(.v-btn) {
  width: 28px;
  height: 28px;
  color: var(--ink-3);
}

.rowact :deep(.v-btn:hover) {
  color: var(--ink);
}

.rowcog {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  color: var(--ink-3);
  transition: background .14s, color .14s;
}

.rowcog:hover {
  background: rgba(var(--v-theme-on-surface), .08);
  color: var(--ink);
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 14px;
}

.morelink {
  font-size: 12.5px;
  font-weight: var(--bold);
  color: color-mix(in srgb, var(--c) 55%, var(--ink));
  cursor: pointer;
}

.health {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-3);
}

.barh {
  width: 80px;
  height: 7px;
  border-radius: 5px;
  background: var(--pill);
  overflow: hidden;
}

.barh i {
  display: block;
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 60%, white));
}

.empty {
  padding: 70px 0;
  text-align: center;
  color: var(--ink-3);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.empty p {
  margin: 0;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background: var(--ink);
  color: var(--surface);
  padding: 11px 18px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  z-index: 60;
  opacity: 0;
  transition: .25s;
  pointer-events: none;
  box-shadow: var(--shadow-lg);
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.rowmenu-bg {
  position: fixed;
  inset: 0;
  z-index: 70;
}

.rowmenu {
  position: fixed;
  min-width: 180px;
  padding: 5px;
  border-radius: var(--radius);
  background: rgb(var(--v-theme-surface));
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rowmenu button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--ink);
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
}

.rowmenu button:hover {
  background: rgba(var(--v-theme-on-surface), .07);
}

.rowmenu button.danger {
  color: rgb(var(--v-theme-error));
}

.rowmenu button.danger:hover {
  background: rgba(var(--v-theme-error), .08);
}
</style>
