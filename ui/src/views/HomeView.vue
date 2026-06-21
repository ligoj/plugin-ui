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
            <div class="kpi-b">
              <div class="v">{{ k.v }}</div>
              <div class="l">{{ k.l }}</div>
            </div>
          </div>
        </div>
      </template>
    </LjPageHeader>

    <SubscriptionsPanel :groups="groups" :loading="loading && !groups.length" default-view="cards" storage-key="home" searchable collapsible :cog="false" @row-appear="onRowAppear"
      @refresh-node="onRefreshNode">
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
// Node operational statuses — NodeResource#getNodeStatus (GET rest/node/status):
// a nested service→tool→instance tree of precomputed UP/DOWN values. Indexed by
// node id → { total:#directChildren, up, down } so the NODE section reads the
// TOOL level (total = number of instance children).
const nodeStatuses = ref(new Map())
// Subscription counts per (instance) node — NodeResource#getNodeStatistics
// (GET rest/node/status/subscription): { total, up, down }. Drives the
// SUBSCRIPTION section.
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

// Index the getNodeStatus tree: every node id → { total, up, down } of its
// DIRECT children's precomputed status (so a TOOL maps to its instance children).
function indexNodeStatuses(list, m) {
  for (const e of (list || [])) {
    const id = e?.node?.id
    const kids = Array.isArray(e?.specifics) ? e.specifics : []
    if (id && kids.length) {
      let up = 0
      let down = 0
      for (const c of kids) {
        const v = String(c?.value || '').toUpperCase()
        if (v === 'UP') up++
        else if (v === 'DOWN') down++
      }
      m.set(id, { total: kids.length, up, down })
    }
    if (kids.length) indexNodeStatuses(kids, m)
  }
}

// Node operational statuses (GET rest/node/status) — the NODE section's source.
async function loadNodeStatuses() {
  try {
    const data = await api.get('rest/node/status')
    const m = new Map()
    indexNodeStatuses(Array.isArray(data) ? data : [], m)
    nodeStatuses.value = m
  } catch { /* keep the previous statuses on a transient failure */ }
}

// Subscription counts per node (GET rest/node/status/subscription, getNodeStatistics)
// — the SUBSCRIPTION section's source. `values = { total, UP, DOWN }`.
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
  const nstats = nodeStatuses.value
  const sstats = subStats.value
  for (const g of out) {
    const ok = g.rows.filter((r) => r.status === 'ok').length
    g.health = g.rows.length ? ok / g.rows.length : 0

    // A group is keyed at the TOOL level but aggregates one row per
    // subscription, each carrying its own (instance-level) node id.
    const ids = [...new Set(g.rows.map((r) => r.sub?.node?.id).filter(Boolean))]
    g.nodeIds = ids
    g.subIds = g.rows.map((r) => r.sub?.id).filter((id) => id != null)

    // Subscription section: sum the per-node subscription counts over the group's
    // subscribed instance nodes (unknown = total − up − down).
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

    // Node section: the TOOL level from getNodeStatus — total = number of
    // instance children, up/down precomputed by the backend.
    const ns = nstats.get(g.key)
    g.instanceStatus = ns ? { total: ns.total, up: ns.up, down: ns.down, unknown: Math.max(0, ns.total - ns.up - ns.down) } : null
  }
  return out.sort((a, b) => b.rows.length - a.rows.length)
})

/* ---- demo dataset (additive, behind the toggle) ---- */
const DEMO_TOOLS = [
  { key: 'Jira', name: 'Jira', kind: 'Gestion de tickets', health: 0.82, rows: [{ n: 'Company1 — Keycopter', s: 'ok', p: ['38 ouv.', '73 clos'] }, { n: 'ANRU — Agora', s: 'ok', p: ['28 ouv.'] }, { n: 'Bank — KYC', s: 'warn', p: ['12 ouv.'] }, { n: 'EDF — Consoweb', s: 'ok', p: ['185 clos'] }] },
  { key: 'Jenkins', name: 'Jenkins', kind: 'Intégration continue', health: 0.61, rows: [{ n: 'Company1 — Keycopter', s: 'ok', p: ['#1842'] }, { n: 'Bank — KYC', s: 'err', p: ['échec'] }, { n: 'EDF — PPA Sonar', s: 'ok', p: ['#77'] }, { n: 'EPO — EPO', s: 'warn', p: ['instable'] }] },
  { key: 'SonarQube', name: 'SonarQube', kind: 'Qualité de code', health: 0.7, rows: [{ n: 'bank-pse-android', s: 'warn', p: ['B'] }, { n: 'Bank — Accueil iPad', s: 'ok', p: ['A'] }, { n: 'CA — Caroline', s: 'err', p: ['C'] }] },
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

// Click-to-refresh on a group's status badge. Click (kind 'node') re-checks the
// group's TOOL node (POST rest/node/status/refresh/{toolId}, i.e. the tool — not
// each instance — which the backend probes and cascades to its subscriptions
// when the status changes). SHIFT+click (kind 'subscription') re-checks the
// group's subscriptions (GET rest/subscription/status/{id}/refresh). Either way
// the global node stats are reloaded afterwards.
async function onRefreshNode(payload) {
  const key = payload?.key
  const kind = payload?.kind === 'subscription' ? 'subscription' : 'node'
  if (!key) return
  const tag = `${key}:${kind}`
  refreshingKeys.value = new Set(refreshingKeys.value).add(tag)
  try {
    if (kind === 'subscription') {
      const subIds = payload?.subIds || []
      await Promise.allSettled(subIds.map((id) => api.get(`rest/subscription/status/${encodeURIComponent(id)}/refresh`, { silent: true })))
      await loadSubStats()
    } else {
      // The node refresh targets the tool node (the group key), not its instances.
      await api.post(`rest/node/status/refresh/${encodeURIComponent(key)}`, null, { silent: true })
      await loadNodeStatuses()
    }
  } finally {
    const next = new Set(refreshingKeys.value)
    next.delete(tag)
    refreshingKeys.value = next
  }
}

onMounted(() => {
  load()
  loadNodeStatuses()
  loadSubStats()
})
</script>

<style scoped>
/* View-specific chrome only; the cards/list/toolbar come from SubscriptionsPanel
   and the global `.lj-surface` tokens. */
.kpis {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.kpi {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  background: linear-gradient(135deg, color-mix(in srgb, var(--a) 10%, var(--card)), var(--card));
  box-shadow: var(--shadow);
  min-width: 132px;
}

.kpi-ic {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  flex: none;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--a), color-mix(in srgb, var(--a) 70%, #000));
  box-shadow: 0 8px 16px -8px color-mix(in srgb, var(--a) 65%, transparent);
}

.kpi .v {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
  color: var(--ink);
}

.kpi .l {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--ink-3);
  margin-top: 3px;
}

/* "Démo" toggle injected into the panel toolbar. */
.demo-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  background: var(--card);
  color: var(--ink-3);
  font-family: var(--font);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: background .12s, color .12s;
}

.demo-toggle input {
  accent-color: rgb(var(--v-theme-primary));
  cursor: pointer;
}

.demo-toggle.on {
  color: rgb(var(--v-theme-primary));
  border-color: color-mix(in srgb, rgb(var(--v-theme-primary)) 40%, var(--border-c));
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 8%, var(--card));
}

.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 56px 0;
  color: var(--ink-3);
  font-weight: 600;
}
</style>
