<!--
  DashboardView — 2026 "Vibrant" home. Shows the current user's subscriptions
  grouped by tool, through the shared <SubscriptionsPanel> (same cards/list,
  filter, view toggle and collapse used by ProjectDetailView).

  Data: a single `rest/subscription` call (SubscriptionResource#findAll) returns
  a LIGHT model — nodes + projects + subscriptions{id,project,node} — without the
  per-subscription parameters/data needed for full plugin rendering. So we render
  immediately from the light model and fetch each subscription's full details
  LAZILY, only when its row scrolls into view (`row-appear` → batched
  `rest/subscription/status/refresh?id=…`), merging the result back in.

  A "Démo" toggle additionally appends the mockup dataset on top of the real one.
-->
<template>
  <div class="dash lj-surface">
    <LjPageHeader title="Tableau de bord">
      <template #subtitle>
        Bonjour <b>{{ auth.userName || 'invité' }}</b> — <b>{{ realGroups.length }}</b> outils sur <b>{{ projects.length }}</b> projets.
      </template>
      <template #actions>
        <div class="kpis">
          <div v-for="k in kpis" :key="k.l" class="kpi" :style="{ '--a': k.c }">
            <div class="kpi-ic"><v-icon size="18">{{ k.icon }}</v-icon></div>
            <div class="kpi-b"><div class="v">{{ k.v }}</div><div class="l">{{ k.l }}</div></div>
          </div>
        </div>
      </template>
    </LjPageHeader>

    <SubscriptionsPanel :groups="groups" :loading="loading && !groups.length" default-view="cards" storage-key="home"
      searchable collapsible :cog="false" @row-appear="onRowAppear" @refresh-node="onRefreshNode">
      <template #toolbar>
        <label class="demo-toggle" :class="{ on: demo }">
          <input type="checkbox" v-model="demo" />
          <v-icon size="15">mdi-flask-outline</v-icon>
          <span>{{ t('common.preview') || 'Démo' }}</span>
        </label>
      </template>
      <template #empty>
        <div class="dash-empty">
          <v-icon size="44" color="rgba(var(--v-theme-on-surface),.25)">mdi-connection</v-icon>
          <p>{{ t('common.noData') }}</p>
        </div>
      </template>
    </SubscriptionsPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useApi, useAuthStore, useI18nStore, NodeIcon, LjPageHeader } from '@ligoj/host'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'

const api = useApi()
const auth = useAuthStore()
const t = useI18nStore().t

const PALETTE = ['#2563eb', '#d33833', '#15a06a', '#7759c2', '#e6a019', '#0ea5a5', '#db2777', '#7c3aed', '#ff7a18', '#4e9bcd']
const COLORS = { Jira: '#2563eb', Jenkins: '#d33833', LDAP: '#15a06a', SonarQube: '#4e9bcd', Confluence: '#e6a019', 'AWS EC2': '#7cb518', GitLab: '#7759c2', 'Provisioning AWS': '#ff7a18', 'Squash TM': '#e0524a' }
const LOGOS = { Jira: 'logos:jira', Jenkins: 'logos:jenkins', LDAP: 'mdi:folder-account-outline', SonarQube: 'logos:sonarqube', Confluence: 'logos:confluence', 'AWS EC2': 'logos:aws-ec2', GitLab: 'logos:gitlab', 'Provisioning AWS': 'logos:aws', 'Squash TM': 'mdi:clipboard-check-outline' }

function toolColor(name) {
  if (COLORS[name]) return COLORS[name]
  let hash = 0
  const s = String(name || '')
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
function toolLogo(name) {
  const icon = LOGOS[name]
  if (!icon) return ''
  const tint = icon.startsWith('logos:') ? '' : ('&color=' + encodeURIComponent((COLORS[name] || '#888').replace('#', '%23')))
  return `https://api.iconify.design/${icon}.svg?height=26${tint}`
}
function statusDot(raw) {
  const s = String(raw?.status ?? raw ?? '').toLowerCase()
  if (s === 'up' || s === 'ok') return 'ok'
  if (s === 'down' || s === 'error' || s === 'ko') return 'err'
  if (s === 'warn' || s === 'blocked') return 'warn'
  return 'idle'
}

/* ---- real data: rest/subscription (light) ---- */
const loading = ref(false)
const nodes = ref([])
const projects = ref([])
const subscriptions = ref([])
const usersTotal = ref(0)
// Full per-subscription details (parameters/data/status), fetched lazily.
const detailsById = ref(new Map())
// Last known operational status per node (id → 'UP' | 'DOWN'), flattened from
// GET rest/node/status. Drives the NODE side of the status badge.
const instanceStatuses = ref(new Map())
// Aggregated SUBSCRIPTION status per node (id → { total, up, down }), from
// GET rest/node/status/subscription. Drives the subscription side of the badge.
const subStats = ref(new Map())
// Tags `${groupKey}:${kind}` currently being re-checked (badge blink/spinner).
const refreshingKeys = ref(new Set())

const nodesMap = computed(() => {
  const m = {}
  for (const n of nodes.value) m[n.id] = n
  return m
})
const projectsMap = computed(() => {
  const m = {}
  for (const p of projects.value) m[p.id] = p
  return m
})

// Rebuild the nested node chain (instance → tool → category) that the per-row
// plugin renderers expect, from the flat `nodes` list (`refined` = parent id).
function resolveNode(id, depth = 0) {
  const n = nodesMap.value[id]
  if (!n || depth > 6) return { id }
  return { ...n, refined: n.refined ? resolveNode(n.refined, depth + 1) : undefined }
}

async function load() {
  loading.value = true
  try {
    const data = await api.get('rest/subscription')
    nodes.value = Array.isArray(data?.nodes) ? data.nodes : []
    projects.value = Array.isArray(data?.projects) ? data.projects : []
    subscriptions.value = Array.isArray(data?.subscriptions) ? data.subscriptions : []
  } catch { nodes.value = []; projects.value = []; subscriptions.value = [] }
  try {
    const u = await api.get('rest/system/user?rows=1&page=1')
    usersTotal.value = u?.recordsTotal ?? 0
  } catch { usersTotal.value = 0 }
  loading.value = false
}

// Fetch the operational health of every visible node from
// NodeResource#getNodeStatus (GET rest/node/status) — node/tool status from the
// last UP/DOWN event, INDEPENDENT of subscriptions (unlike the subscription
// stats). The payload is a nested service→tool→instance tree (each EventVo:
// `{ node:{id}, value, specifics:[…] }`); we flatten it to a per-node-id map.
// Nodes without an event are simply absent → counted as "no status" per group.
function collectStatuses(list, m) {
  for (const e of (list || [])) {
    const id = e?.node?.id
    if (id && e?.value && !m.has(id)) m.set(id, String(e.value).toUpperCase())
    if (Array.isArray(e?.specifics) && e.specifics.length) collectStatuses(e.specifics, m)
  }
}
async function loadInstanceStatuses() {
  try {
    const data = await api.get('rest/node/status')
    const m = new Map()
    collectStatuses(Array.isArray(data) ? data : [], m)
    instanceStatuses.value = m
  } catch { /* keep the previous statuses on a transient failure */ }
}

// Aggregated per-node SUBSCRIPTION status (GET rest/node/status/subscription),
// keyed by the subscription's node id with `values = { total, UP, DOWN }`;
// anything not UP/DOWN is "unknown".
async function loadSubStats() {
  try {
    const data = await api.get('rest/node/status/subscription')
    const m = new Map()
    if (Array.isArray(data)) {
      for (const e of data) {
        const v = e?.values || {}
        m.set(e.node, { total: v.total || 0, up: v.UP || 0, down: v.DOWN || 0 })
      }
    }
    subStats.value = m
  } catch { /* keep the previous stats on a transient failure */ }
}

// Group the current user's subscriptions by tool, merging any lazily-fetched
// details. Each row keeps a `sub` object for the plugin delegation.
const realGroups = computed(() => {
  const byTool = new Map()
  const out = []
  for (const s of subscriptions.value) {
    const node = resolveNode(s.node)
    const tool = node.refined || node
    const key = tool.id || node.id || String(s.id)
    if (!byTool.has(key)) {
      const g = {
        key,
        name: tool.name || tool.id || key,
        kind: tool.refined?.name || '',
        color: toolColor(tool.name || tool.id),
        // Pass the FULL resolved node (carries `uiClasses`) so NodeIcon renders
        // the real mdi/font icon like ProjectDetailView, instead of falling back
        // to the now-deleted /main/.../img/<tool>.png path.
        icon: () => h(NodeIcon, { node: tool }),
        rows: [],
      }
      byTool.set(key, g)
      out.push(g)
    }
    const project = projectsMap.value[s.project]
    const det = detailsById.value.get(String(s.id))
    const status = statusDot(det?.status ?? null)
    const sub = det ? { id: s.id, node, status: det.status, parameters: det.parameters, data: det.data } : { id: s.id, node, status: null }
    // No synthetic status / node-name chips — that identity is now in the
    // SubscriptionStatus tooltip. One row per subscription, labelled by the
    // project that owns it.
    byTool.get(key).rows.push({ name: project?.name || project?.pkey || node.name || ('#' + s.id), status, pills: [], sub })
  }
  const nstatuses = instanceStatuses.value
  const sstats = subStats.value
  for (const g of out) {
    const ok = g.rows.filter((r) => r.status === 'ok').length
    g.health = g.rows.length ? ok / g.rows.length : 0

    // A group is keyed at the TOOL level but aggregates one row per
    // subscription, each carrying its own (instance-level) node id. Both the
    // node status and the subscription status are summed over those node ids.
    const ids = [...new Set(g.rows.map((r) => r.sub?.node?.id).filter(Boolean))]
    g.nodeIds = ids
    g.subIds = g.rows.map((r) => r.sub?.id).filter((id) => id != null)

    // Node operational health from getNodeStatus: total = #instances; up/down
    // from the last status event; the rest never reported a status (unknown).
    if (ids.length) {
      let up = 0
      let down = 0
      for (const id of ids) {
        const v = nstatuses.get(id)
        if (v === 'UP') up++
        else if (v === 'DOWN') down++
      }
      g.instanceStatus = { total: ids.length, up, down, unknown: ids.length - up - down }
    } else {
      g.instanceStatus = null
    }

    // Subscription health (rest/node/status/subscription), summed over the
    // group's node ids: total = #subscriptions; unknown = neither UP nor DOWN.
    if (sstats.size && ids.some((id) => sstats.has(id))) {
      let total = 0
      let up = 0
      let down = 0
      for (const id of ids) {
        const s = sstats.get(id)
        if (s) { total += s.total; up += s.up; down += s.down }
      }
      g.subStatus = { total, up, down, unknown: Math.max(0, total - up - down) }
    } else {
      g.subStatus = null
    }
  }
  return out.sort((a, b) => b.rows.length - a.rows.length)
})

/* ---- demo dataset (additive, behind the toggle) ---- */
const DEMO_TOOLS = [
  { key: 'Jira', name: 'Jira', kind: 'Gestion de tickets', health: 0.82, rows: [{ n: 'Airbus — Keycopter', s: 'ok', p: ['38 ouv.', '73 clos'] }, { n: 'ANRU — Agora', s: 'ok', p: ['28 ouv.'] }, { n: 'BNPP — KYC', s: 'warn', p: ['12 ouv.'] }, { n: 'EDF — Consoweb', s: 'ok', p: ['185 clos'] }] },
  { key: 'Jenkins', name: 'Jenkins', kind: 'Intégration continue', health: 0.61, rows: [{ n: 'Airbus — Keycopter', s: 'ok', p: ['#1842'] }, { n: 'BNPP — KYC', s: 'err', p: ['échec'] }, { n: 'EDF — PPA Sonar', s: 'ok', p: ['#77'] }, { n: 'EPO — EPO', s: 'warn', p: ['instable'] }] },
  { key: 'SonarQube', name: 'SonarQube', kind: 'Qualité de code', health: 0.7, rows: [{ n: 'bnpp-pse-android', s: 'warn', p: ['B'] }, { n: 'BNPP — Accueil iPad', s: 'ok', p: ['A'] }, { n: 'CA — Caroline', s: 'err', p: ['C'] }] },
  { key: 'Provisioning AWS', name: 'Provisioning AWS', kind: 'Coûts cloud', health: 0.76, rows: [{ n: 'Datasync Framework', s: 'ok', p: ['8 CPU', '303 $'], cost: true }, { n: 'Loader SAP GP074', s: 'warn', p: ['428 $'], cost: true }] },
]
const demo = ref(false)
const demoGroups = computed(() => DEMO_TOOLS.map((td) => ({
  key: 'demo:' + td.key,
  name: td.name,
  kind: td.kind,
  color: toolColor(td.name),
  icon: () => h('img', { src: toolLogo(td.name), class: 'tool-icon', alt: td.name }),
  health: td.health,
  rows: td.rows.map((r) => ({ name: r.n, status: r.s, pills: r.p, cost: r.cost, sub: null })),
})))

// Inject the live per-group `refreshing` flag here (cheap map) so toggling it
// doesn't rebuild the heavier `realGroups` aggregation.
const groups = computed(() => {
  const base = demo.value ? realGroups.value.concat(demoGroups.value) : realGroups.value
  const keys = refreshingKeys.value
  // Blink the badge while EITHER a node or a subscription refresh is in flight.
  return base.map((g) => ({ ...g, refreshing: keys.has(`${g.key}:node`) || keys.has(`${g.key}:subscription`) }))
})

const kpis = computed(() => [
  { l: 'Projets', v: projects.value.length.toLocaleString('fr-FR'), c: '#2f6df6', icon: 'mdi-folder-multiple-outline' },
  { l: 'Outils', v: realGroups.value.length.toLocaleString('fr-FR'), c: '#1d9d63', icon: 'mdi-hammer-wrench' },
  { l: 'Souscriptions', v: subscriptions.value.length.toLocaleString('fr-FR'), c: '#8b5cf6', icon: 'mdi-connection' },
  { l: 'Utilisateurs', v: usersTotal.value.toLocaleString('fr-FR'), c: '#d9701a', icon: 'mdi-account-multiple-outline' },
])

/* ---- lazy details: fetch a subscription's full status/data on row appearance ---- */
const STATUS_CHUNK = 50
const pending = new Set()
let flushTimer = null
function onRowAppear(sub) {
  const id = sub?.id
  if (id == null || detailsById.value.has(String(id)) || pending.has(id)) return
  pending.add(id)
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(flushDetails, 200)
}
async function flushDetails() {
  flushTimer = null
  const ids = [...pending]
  pending.clear()
  if (!ids.length) return
  const next = new Map(detailsById.value)
  for (let i = 0; i < ids.length; i += STATUS_CHUNK) {
    const q = ids.slice(i, i + STATUS_CHUNK).map((id) => `id=${encodeURIComponent(id)}`).join('&')
    try {
      const fresh = await api.get(`rest/subscription/status/refresh?${q}`)
      if (fresh && typeof fresh === 'object') {
        for (const k of Object.keys(fresh)) {
          const v = fresh[k]
          next.set(String(k), v && typeof v === 'object' ? v : { status: v })
        }
      }
    } catch { /* leave those rows at idle */ }
  }
  detailsById.value = next // triggers a single regroup with the merged details
}

// Click-to-refresh on a group's status badge. Click (kind 'node') re-probes the
// group's instance nodes (POST rest/node/status/refresh/{id}, a live check that
// registers a fresh status event) then reloads the node statuses. SHIFT+click
// (kind 'subscription') re-checks the group's subscriptions
// (GET rest/subscription/status/{id}/refresh) then reloads the subscription stats.
async function onRefreshNode(payload) {
  const key = payload?.key
  const kind = payload?.kind === 'subscription' ? 'subscription' : 'node'
  if (!key) return
  const tag = `${key}:${kind}`
  refreshingKeys.value = new Set(refreshingKeys.value).add(tag)
  try {
    if (kind === 'subscription') {
      const subIds = payload?.subIds || []
      if (subIds.length) {
        await Promise.allSettled(subIds.map((id) => api.get(`rest/subscription/status/${encodeURIComponent(id)}/refresh`, { silent: true })))
        await loadSubStats()
      }
    } else {
      const ids = payload?.nodeIds || []
      if (ids.length) {
        await Promise.allSettled(ids.map((id) => api.post(`rest/node/status/refresh/${encodeURIComponent(id)}`)))
        await loadInstanceStatuses()
      }
    }
  } finally {
    const next = new Set(refreshingKeys.value)
    next.delete(tag)
    refreshingKeys.value = next
  }
}

onMounted(() => {
  load()
  loadInstanceStatuses()
  loadSubStats()
})
</script>

<style scoped>
/* View-specific chrome only; the cards/list/toolbar come from SubscriptionsPanel
   and the global `.lj-surface` tokens. */
.kpis { display: flex; gap: 12px; flex-wrap: wrap; }
.kpi { display: flex; align-items: center; gap: 11px; padding: 12px 16px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: linear-gradient(135deg, color-mix(in srgb, var(--a) 10%, var(--card)), var(--card)); box-shadow: var(--shadow); min-width: 132px; }
.kpi-ic { width: 38px; height: 38px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--a), color-mix(in srgb, var(--a) 70%, #000)); box-shadow: 0 8px 16px -8px color-mix(in srgb, var(--a) 65%, transparent); }
.kpi .v { font-family: var(--mono); font-weight: 700; font-size: 22px; line-height: 1; color: var(--ink); }
.kpi .l { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-3); margin-top: 3px; }

/* "Démo" toggle injected into the panel toolbar. */
.demo-toggle { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 12px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--card); color: var(--ink-3); font-family: var(--font); font-weight: 700; font-size: 13px; cursor: pointer; user-select: none; transition: background .12s, color .12s; }
.demo-toggle input { accent-color: rgb(var(--v-theme-primary)); cursor: pointer; }
.demo-toggle.on { color: rgb(var(--v-theme-primary)); border-color: color-mix(in srgb, rgb(var(--v-theme-primary)) 40%, var(--border-c)); background: color-mix(in srgb, rgb(var(--v-theme-primary)) 8%, var(--card)); }

.dash-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 56px 0; color: var(--ink-3); font-weight: 600; }
</style>
