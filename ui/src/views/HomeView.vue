<!--
  DashboardView — 2026 "Vibrant" home, faithful to the validated mockup
  (design/ligoj-2026-prototype.html → viewHome): page header + 4 KPI cards, a
  toolbar (Cards/List · Functional/Technical · collapse-all · search · count)
  and a grid of tool cards (branded glyph, name + kind, total/active counter,
  health bar, a collapsible mini-table of subscriptions) or a list table.

  REAL data first: a single `rest/project?rows=100` call returns the projects
  WITH their subscriptions (each carrying its node), so we aggregate them by
  tool (node) into the cards — real logos via the host's NodeIcon. A batched
  `rest/subscription/status/refresh` call then pulls each subscription's live
  status, used for the per-card health bar and the row status dots. When the
  backend has no subscriptions (empty dev DB) we fall back to the mockup's demo
  dataset, flagged "Aperçu". Card chrome reused from ProjectDetailView.
-->
<template>
  <div class="dash lj-surface">
    <LjPageHeader title="Tableau de bord" :crumbs="isDemo ? [{ icon: 'mdi-flask-outline', label: 'Aperçu', current: true }] : null">
      <template #subtitle>
        Bonjour <b>{{ auth.userName || 'invité' }}</b> — <span v-if="isDemo"><b>{{ attention }}</b> outils demandent votre attention.</span><span v-else><b>{{ tools.length }}</b> outils configurés sur <b>{{ projectsTotal }}</b> projets.</span>
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

    <div class="toolbar">
      <LjSegmented v-model="view" :options="viewOptions" />
      <LjSegmented v-model="cat" :options="catOptions" />
      <button v-if="view === 'cards'" class="collapse-all" type="button" @click="toggleAll">
        <v-icon size="16">{{ anyCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal' }}</v-icon>
        <span>{{ anyCollapsed ? t('common.expandAll') : t('common.collapseAll') }}</span>
      </button>
      <LjSearch v-model="query" placeholder="Rechercher un projet ou un outil…" />
      <span class="tb-sp" />
      <span class="tcount"><b>{{ filtered.length }}</b> outils · <b>{{ activeSum.toLocaleString('fr-FR') }}</b> souscriptions{{ isDemo ? ' actives' : '' }}</span>
    </div>

    <!-- Cards -->
    <div v-if="view === 'cards'" class="grid">
      <article v-for="(tool, i) in displayCards" :key="tool.key" class="card" :style="{ '--c': colorOf(tool, i), animationDelay: Math.min(i, 12) * 45 + 'ms' }">
        <div class="card-head">
          <span class="glyph" :class="{ noimg: failed.has(tool.key) }" :data-letter="tool.name[0]">
            <NodeIcon v-if="tool.nodeId" :node="{ id: tool.nodeId }" />
            <img v-else-if="!failed.has(tool.key)" class="tool-logo" :src="toolLogo(tool.name)" :alt="tool.name" loading="lazy" @error="failed.add(tool.key)" />
          </span>
          <div class="t"><div class="name">{{ tool.name }}</div><div class="kind">{{ tool.kind }}</div></div>
          <span v-if="tool.health != null" class="health"><span class="barh"><i :style="{ width: Math.round(tool.health * 100) + '%' }" /></span>{{ Math.round(tool.health * 100) }}%</span>
          <div class="count">{{ tool.total.toLocaleString('fr-FR') }}<small v-if="tool.health != null"> / {{ tool.active }}</small></div>
          <button class="chev" type="button" :aria-label="collapsed.has(tool.key) ? t('common.expandAll') : t('common.collapseAll')" @click.stop="toggle(tool.key)">
            <v-icon size="18">{{ collapsed.has(tool.key) ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </button>
        </div>
        <v-expand-transition>
          <div v-show="!collapsed.has(tool.key)">
            <!-- Lightweight subscriptions mini-table (NOT VibrantDataTable —
                 one instance per card would be far too heavy). The tool's own
                 type/name are intentionally omitted: the whole card already
                 represents that tool. Clicking a row opens its project. -->
            <div class="mini">
              <div class="mrow mhead">
                <span class="m-st" />
                <span class="m-name">{{ t('common.name') }}</span>
                <span class="m-sum">{{ t('common.status') }}</span>
              </div>
              <div v-for="(r, j) in tool.shown" :key="r.projectId ?? r.label ?? j" class="mrow" :class="{ clickable: r.projectId != null }" @click="r.projectId != null && openProject(r.projectId)">
                <LjStatus class="m-st" :status="ljStatus(r.status)" :tooltip="t('subscription.status.' + r.status)" />
                <span class="m-name mlabel">{{ r.label }}</span>
                <span class="m-sum">
                  <span v-if="r.pills && r.pills.length" class="pills"><span v-for="p in r.pills" :key="p" class="pill" :class="{ cost: r.cost }">{{ p }}</span></span>
                </span>
              </div>
              <div v-if="!tool.shown.length" class="mrow mempty">{{ t('common.noData') }}</div>
              <div v-if="tool.extra" class="mrow mmore">+{{ tool.extra }} {{ t('project.detail.more') }}</div>
            </div>
            <div v-if="tool.health == null" class="card-foot">
              <span class="health"><v-icon size="14">mdi-folder-multiple-outline</v-icon>{{ tool.rows.length }}</span>
            </div>
          </div>
        </v-expand-transition>
      </article>
    </div>

    <!-- List -->
    <VibrantDataTable v-else :headers="headers" :items="filtered" :items-length="filtered.length" item-value="key" default-sort="name" :tools="false" @row-click="$router.push('/project')">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span class="glyph sm" :class="{ noimg: failed.has(item.key) }" :data-letter="item.name[0]" :style="{ '--c': colorOf(item, 0) }">
            <NodeIcon v-if="item.nodeId" :node="{ id: item.nodeId }" />
            <img v-else-if="!failed.has(item.key)" class="tool-logo" :src="toolLogo(item.name)" :alt="item.name" loading="lazy" @error="failed.add(item.key)" />
          </span>
          <div><div class="ac-name">{{ item.name }}</div><div class="ac-kind">{{ item.kind }}</div></div>
        </div>
      </template>
      <template #cell.cat="{ item }"><span class="catchip" :class="catOf(item)">{{ catOf(item) === 'func' ? 'Fonctionnel' : 'Technique' }}</span></template>
      <template #cell.subs="{ item }"><span class="mono">{{ item.total.toLocaleString('fr-FR') }}</span><span v-if="item.health != null" class="ac-kind"> / {{ item.active }}</span></template>
      <template #cell.health="{ item }">
        <span v-if="item.health != null" class="health" :style="{ '--c': colorOf(item, 0) }"><span class="barh"><i :style="{ width: Math.round(item.health * 100) + '%' }" /></span>{{ Math.round(item.health * 100) }}%</span>
        <span v-else class="ac-kind">{{ item.rows.length }} projet{{ item.rows.length > 1 ? 's' : '' }}</span>
      </template>
    </VibrantDataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi, useAuthStore, useI18nStore, NodeIcon, APP_BASE } from '@ligoj/host'
import { VibrantDataTable, LjPageHeader, LjSegmented, LjSearch, LjStatus } from '@ligoj/host'

const api = useApi()
const auth = useAuthStore()
const router = useRouter()
const i18n = useI18nStore()
const t = i18n.t

const PALETTE = ['#2563eb', '#d33833', '#15a06a', '#7759c2', '#e6a019', '#0ea5a5', '#db2777', '#7c3aed', '#ff7a18', '#4e9bcd']
const COLORS = { Jira: '#2563eb', Jenkins: '#d33833', LDAP: '#15a06a', SonarQube: '#4e9bcd', Confluence: '#e6a019', 'AWS EC2': '#7cb518', GitLab: '#7759c2', 'Provisioning AWS': '#ff7a18', 'Squash TM': '#e0524a' }
const LOGOS = { Jira: 'logos:jira', Jenkins: 'logos:jenkins', LDAP: 'mdi:folder-account-outline', SonarQube: 'logos:sonarqube', Confluence: 'logos:confluence', 'AWS EC2': 'logos:aws-ec2', GitLab: 'logos:gitlab', 'Provisioning AWS': 'logos:aws', 'Squash TM': 'mdi:clipboard-check-outline' }
const DEMO_CAT = { Jira: 'func', Confluence: 'func', 'Squash TM': 'func', Jenkins: 'tech', SonarQube: 'tech', GitLab: 'tech', 'AWS EC2': 'tech', 'Provisioning AWS': 'tech', LDAP: 'tech' }

const DEMO_TOOLS = [
  { key: 'Jira', name: 'Jira', kind: 'Gestion de tickets', total: 649, active: 576, health: 0.82, cat: 'func', rows: [{ n: 'Airbus — Keycopter', s: 'ok', p: ['38 ouv.', '73 clos'] }, { n: 'ANRU — Agora', s: 'ok', p: ['28 ouv.'] }, { n: 'BNPP — KYC', s: 'warn', p: ['12 ouv.'] }, { n: 'EDF — Consoweb', s: 'ok', p: ['185 clos'] }] },
  { key: 'Jenkins', name: 'Jenkins', kind: 'Intégration continue', total: 292, active: 189, health: 0.61, cat: 'tech', rows: [{ n: 'Airbus — Keycopter', s: 'ok', p: ['#1842'] }, { n: 'BNPP — KYC', s: 'err', p: ['échec'] }, { n: 'EDF — PPA Sonar', s: 'ok', p: ['#77'] }, { n: 'EPO — EPO', s: 'warn', p: ['instable'] }] },
  { key: 'LDAP', name: 'LDAP', kind: 'Annuaire', total: 1896, active: 1167, health: 0.94, cat: 'tech', rows: [{ n: 'gfi-support-lille', s: 'ok', p: ['10 mbr.'] }, { n: 'outils-delivery-core', s: 'ok', p: ['5 mbr.'] }, { n: '3suisses-3s-pt', s: 'ok', p: ['3 mbr.'] }, { n: 'abertis-tareas', s: 'idle', p: ['5 mbr.'] }] },
  { key: 'SonarQube', name: 'SonarQube', kind: 'Qualité de code', total: 84, active: 49, health: 0.7, cat: 'tech', rows: [{ n: 'bnpp-pse-android', s: 'warn', p: ['B'] }, { n: 'BNPP — Accueil iPad', s: 'ok', p: ['A'] }, { n: 'BNPP — KYC', s: 'ok', p: ['A'] }, { n: 'CA — Caroline', s: 'err', p: ['C'] }] },
  { key: 'Confluence', name: 'Confluence', kind: 'Documentation', total: 522, active: 462, health: 0.88, cat: 'func', rows: [{ n: 'Espace — Delivery', s: 'ok', p: ['2.3 k'] }, { n: 'Espace — Archi', s: 'ok', p: ['912'] }, { n: 'Espace — RH', s: 'idle', p: ['144'] }] },
  { key: 'AWS EC2', name: 'AWS EC2', kind: 'Provisioning', total: 177, active: 13, health: 0.55, cat: 'tech', rows: [{ n: 'i-06755957da1276', s: 'ok', p: ['running'] }, { n: 'i-0f9c42a5c54b51', s: 'ok', p: ['running'] }, { n: 'i-0eb8922dcfe39f', s: 'warn', p: ['pending'] }, { n: 'i-0ecb5acac04b50', s: 'err', p: ['stopped'] }] },
  { key: 'GitLab', name: 'GitLab', kind: 'Source & MR', total: 552, active: 224, health: 0.9, cat: 'tech', rows: [{ n: 'platform / core', s: 'ok', p: ['4 MR'] }, { n: 'platform / ui', s: 'ok', p: ['2 MR'] }, { n: 'infra / terraform', s: 'warn', p: ['CI…'] }] },
  { key: 'Provisioning AWS', name: 'Provisioning AWS', kind: 'Coûts cloud', total: 20, active: 8, health: 0.76, cat: 'tech', rows: [{ n: 'Datasync Framework', s: 'ok', p: ['8 CPU', '303 $'], cost: true }, { n: 'Loader SAP GP074', s: 'warn', p: ['428 $'], cost: true }, { n: 'Digitale2 Carto', s: 'ok', p: ['992 $'], cost: true }] },
  { key: 'Squash TM', name: 'Squash TM', kind: 'Tests', total: 178, active: 155, health: 0.8, cat: 'func', rows: [{ n: 'Acoss — Portail KPI', s: 'ok', p: ['120'] }, { n: 'ATR — APS Migration', s: 'ok', p: ['64'] }, { n: 'Bayer — AnimPlus', s: 'warn', p: ['à jour ?'] }] },
]
const DEMO_KPIS = [
  { l: 'Projets', v: '124', c: '#2f6df6', icon: 'mdi-folder-multiple-outline' },
  { l: 'Outils', v: '18', c: '#1d9d63', icon: 'mdi-hammer-wrench' },
  { l: 'Souscriptions', v: '2 348', c: '#8b5cf6', icon: 'mdi-connection' },
  { l: 'Utilisateurs', v: '342', c: '#d9701a', icon: 'mdi-account-multiple-outline' },
]

/* --- real data: aggregate projects' subscriptions by tool (node) --- */
const projects = ref([])
const projectsTotal = ref(0)
const usersTotal = ref(0)
// Live subscription statuses keyed by subscription id, and a flag set once
// the (best-effort) refresh has run — until then we don't claim any health.
const subStatus = ref(new Map())
const healthReady = ref(false)
const STATUS_CHUNK = 50

async function load() {
  try {
    const data = await api.get('rest/project?rows=100&page=1&sidx=name&sord=asc')
    const rows = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    projects.value = rows
    projectsTotal.value = data?.recordsTotal ?? rows.length
  } catch { projects.value = [] }

  try {
    const u = await api.get('rest/system/user?rows=1&page=1')
    usersTotal.value = u?.recordsTotal ?? (Array.isArray(u?.data) ? u.data.length : 0)
  } catch { usersTotal.value = 0 }

  await loadStatuses()
}

/* Pull each subscription's live status in a single batched pass (chunked so
   the query string stays well under URL limits). Best-effort: a failed chunk
   just leaves those subscriptions at "idle". Mirrors the refresh contract of
   ProjectDetailView.refreshSubscriptions. */
async function loadStatuses() {
  const ids = []
  for (const p of projects.value) {
    for (const s of (Array.isArray(p.subscriptions) ? p.subscriptions : [])) {
      if (s?.id != null) ids.push(s.id)
    }
  }
  if (!ids.length) { healthReady.value = true; return }
  const map = new Map()
  for (let i = 0; i < ids.length; i += STATUS_CHUNK) {
    const q = ids.slice(i, i + STATUS_CHUNK).map((id) => `id=${encodeURIComponent(id)}`).join('&')
    try {
      const fresh = await api.get(`rest/subscription/status/refresh?${q}`)
      if (fresh && typeof fresh === 'object') {
        for (const k of Object.keys(fresh)) {
          const v = fresh[k]
          map.set(String(k), v && typeof v === 'object' ? v.status : v)
        }
      }
    } catch { /* keep partial results */ }
  }
  subStatus.value = map
  healthReady.value = true
}

// Functional service families (identity, knowledge, bug/ticket, test mgmt);
// everything else (build, scm, qa, prov…) reads as technical.
function classify(id) { return /:(id|km|bt|tm|ticket|issue|build\/confluence)/i.test(id || '') ? 'func' : 'tech' }

/* Map a backend status (NodeStatus UP/DOWN, or a string) to a mockup dot. */
function statusDot(raw) {
  const s = String(raw?.status ?? raw ?? '').toLowerCase()
  if (s === 'up' || s === 'ok') return 'ok'
  if (s === 'down' || s === 'error' || s === 'ko') return 'err'
  if (s === 'warn' || s === 'blocked') return 'warn'
  return 'idle'
}

const realTools = computed(() => {
  const byNode = new Map()
  for (const p of projects.value) {
    const subs = Array.isArray(p.subscriptions) ? p.subscriptions : []
    for (const s of subs) {
      const node = s?.node || {}
      const id = node.id || node.name
      if (!id) continue
      if (!byNode.has(id)) byNode.set(id, { id, name: node.name || id, rows: [] })
      const status = healthReady.value ? statusDot(subStatus.value.get(String(s.id))) : 'idle'
      byNode.get(id).rows.push({
        label: p.name || p.pkey || ('#' + s.id),
        status,
        pills: [],
        projectId: p.id ?? p.pkey,
        subId: s.id,
      })
    }
  }
  const arr = [...byNode.values()]
  if (!arr.length) return null
  return arr.sort((a, b) => b.rows.length - a.rows.length).map((e) => {
    const ok = e.rows.filter((r) => r.status === 'ok').length
    return {
      key: e.id, name: e.name, kind: e.id, nodeId: e.id, cat: classify(e.id),
      total: e.rows.length,
      active: healthReady.value ? ok : e.rows.length,
      health: healthReady.value ? (e.rows.length ? ok / e.rows.length : 0) : null,
      rows: e.rows,
    }
  })
})

const isDemo = computed(() => !realTools.value)
const tools = computed(() => realTools.value || DEMO_TOOLS)
const kpis = computed(() => {
  if (isDemo.value) return DEMO_KPIS
  const subsTotal = realTools.value.reduce((a, x) => a + x.total, 0)
  return [
    { l: 'Projets', v: projectsTotal.value.toLocaleString('fr-FR'), c: '#2f6df6', icon: 'mdi-folder-multiple-outline' },
    { l: 'Outils', v: realTools.value.length, c: '#1d9d63', icon: 'mdi-hammer-wrench' },
    { l: 'Souscriptions', v: subsTotal.toLocaleString('fr-FR'), c: '#8b5cf6', icon: 'mdi-connection' },
    { l: 'Utilisateurs', v: usersTotal.value.toLocaleString('fr-FR'), c: '#d9701a', icon: 'mdi-account-multiple-outline' },
  ]
})

const view = ref('cards')
const cat = ref('func')
const query = ref('')
const failed = ref(new Set())

// Per-card collapse state (ephemeral, by tool.key). Empty = all expanded.
const collapsed = ref(new Set())
const anyCollapsed = computed(() => collapsed.value.size > 0)
function toggle(key) {
  const next = new Set(collapsed.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  collapsed.value = next
}
function toggleAll() {
  collapsed.value = anyCollapsed.value ? new Set() : new Set(filtered.value.map((tool) => tool.key))
}

// Tool brand colour extracted from its PNG logo (best-effort, see extractColor).
const toolColors = ref({})

// LjSegmented option sets for the two toolbar tab controls.
const viewOptions = [
  { value: 'cards', icon: 'mdi-view-grid-outline', label: 'Cartes' },
  { value: 'list', icon: 'mdi-format-list-bulleted', label: 'Liste' },
]
const catOptions = [
  { value: 'func', label: 'Fonctionnel' },
  { value: 'tech', label: 'Technique' },
]

function catOf(t) { return t.cat || DEMO_CAT[t.name] || 'tech' }
function colorOf(tool, i) { return toolColors.value[tool.key] || COLORS[tool.name] || PALETTE[i % PALETTE.length] }
function toolLogo(name) {
  const icon = LOGOS[name]
  if (!icon) return ''
  const tint = icon.startsWith('logos:') ? '' : ('&color=' + encodeURIComponent((COLORS[name] || '#888').replace('#', '%23')))
  return `https://api.iconify.design/${icon}.svg?height=26${tint}`
}

// Map our internal status token to the LjStatus semantic state.
const LJ_STATUS = { ok: 'ok', warn: 'warn', err: 'error', idle: 'idle' }
function ljStatus(s) { return LJ_STATUS[s] || 'idle' }

function openProject(id) { router.push(`/project/${id}`) }
// List mode rows are tools (not projects), so a row maps to no single project;
// keep the legacy navigation to the project list (issue #15 scopes the cards).

/* Best-effort dominant-colour extraction from a tool's PNG logo. Same-origin
   logos (the host's /ligoj/main/service/.../img/*.png) can be read back from a
   canvas; cross-origin ones taint it, so getImageData throws and we resolve
   null to fall back to the named palette. Pure inline JS, no dependency. */
function pngUrl(nodeId) {
  const f = String(nodeId || '').split(':')
  if (f.length < 3) return null
  return `${APP_BASE}main/service/${f[1]}/${f[2]}/img/${f[2]}.png`
}
function extractColor(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const w = 32, h = 32
        const cv = document.createElement('canvas')
        cv.width = w; cv.height = h
        const ctx = cv.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, w, h)
        const { data } = ctx.getImageData(0, 0, w, h) // throws if tainted
        let r = 0, g = 0, b = 0, wsum = 0
        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i], pg = data[i + 1], pb = data[i + 2], pa = data[i + 3]
          if (pa < 128) continue
          const mx = Math.max(pr, pg, pb), mn = Math.min(pr, pg, pb)
          if (mx > 240 && mn > 240) continue // near-white
          if (mx < 18) continue              // near-black
          const weight = (mx - mn) + 1       // weight vivid pixels over greys
          r += pr * weight; g += pg * weight; b += pb * weight; wsum += weight
        }
        if (!wsum) { resolve(null); return }
        resolve('#' + [r, g, b].map((c) => Math.round(c / wsum).toString(16).padStart(2, '0')).join(''))
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

// Kick off colour extraction for each real tool once, as the set resolves.
watch(realTools, (list) => {
  if (!list) return
  for (const tool of list) {
    if (!tool.nodeId || toolColors.value[tool.key]) continue
    const url = pngUrl(tool.nodeId)
    if (!url) continue
    extractColor(url).then((hex) => { if (hex) toolColors.value = { ...toolColors.value, [tool.key]: hex } })
  }
}, { immediate: true })

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return tools.value.filter((tool) => catOf(tool) === cat.value)
    .filter((tool) => !q || tool.name.toLowerCase().includes(q) || (tool.kind || '').toLowerCase().includes(q) || (tool.rows || []).some((r) => (r.label ?? r.n ?? '').toLowerCase().includes(q)))
})

// Normalise both real ({label,status,projectId}) and demo ({n,s,p}) rows to a
// single shape for the mini-table, capped so a tool with hundreds of
// subscriptions stays light (the overflow count is surfaced as "+N").
const ROW_CAP = 50
const displayCards = computed(() => filtered.value.map((tool) => {
  const all = (tool.rows || []).map((r) => (r.label !== undefined)
    ? r
    : { label: r.n, status: r.s, pills: r.p || [], projectId: null, cost: r.cost })
  return { ...tool, rows: all, shown: all.slice(0, ROW_CAP), extra: Math.max(0, all.length - ROW_CAP) }
}))

const activeSum = computed(() => filtered.value.reduce((a, tool) => a + (tool.active ?? tool.total), 0))
const attention = computed(() => DEMO_TOOLS.filter((tool) => tool.rows.some((r) => r.s === 'err')).length)

const headers = [
  { key: 'name', label: 'Outil', sortable: true, icon: 'mdi-hammer-wrench' },
  { key: 'cat', label: 'Catégorie', sortable: false, align: 'center', icon: 'mdi-shape-outline' },
  { key: 'subs', label: 'Souscriptions', sortable: true, align: 'center', icon: 'mdi-connection' },
  { key: 'health', label: 'Santé', sortable: false, align: 'end', icon: 'mdi-heart-pulse' },
]

onMounted(load)
</script>

<style scoped>
/* View-specific styling only — chrome (header, segmented tab controls,
   search) comes from the shared host components + the global `.lj-surface`
   class, which supplies the ink, pill, radius, mono, surface, card and
   border vars these dashboard cards read. */
.dash {
  --ok: #1d9d63; --warn: #d9701a; --err: #df4d42; --idle: #9aa0a6;
}
.sub b { color: var(--ink-2); }
.kpis { display: flex; gap: 12px; flex-wrap: wrap; }
.kpi { display: flex; align-items: center; gap: 11px; padding: 12px 16px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: linear-gradient(135deg, color-mix(in srgb, var(--a) 10%, var(--card)), var(--card)); box-shadow: var(--shadow); min-width: 132px; }
.kpi-ic { width: 38px; height: 38px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--a), color-mix(in srgb, var(--a) 70%, #000)); box-shadow: 0 8px 16px -8px color-mix(in srgb, var(--a) 65%, transparent); }
.kpi .v { font-family: var(--mono); font-weight: 700; font-size: 22px; line-height: 1; color: var(--ink); }
.kpi .l { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-3); margin-top: 3px; }

.toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.tb-sp { flex: 1; }
.tcount { font-size: 13px; font-weight: 500; color: var(--ink-3); }
.tcount b { color: var(--ink-2); font-family: var(--mono); }
/* Collapse / expand-all toggle, sized to sit beside the segmented controls. */
.collapse-all { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 12px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--card); color: var(--ink-2); font-family: var(--font); font-weight: 700; font-size: 13px; cursor: pointer; transition: background .12s, color .12s; }
.collapse-all:hover { background: var(--pill); color: var(--ink); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
.card { position: relative; display: flex; flex-direction: column; background: var(--card); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); opacity: 0; transform: translateY(12px); animation: rise .5s cubic-bezier(.2,.7,.3,1) forwards; transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .18s; }
@keyframes rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .card { animation: none; opacity: 1; transform: none; } }
.card:hover { transform: translateY(-3px); box-shadow: 0 26px 50px -24px color-mix(in srgb, var(--c) 55%, transparent); }
/* The preferred colour materialises as a 4px top edge, in addition to the
   existing tinted header gradient. */
.card-head { display: flex; align-items: center; gap: 10px; padding: 16px 16px 14px; border-top: 4px solid var(--c); background: linear-gradient(180deg, color-mix(in srgb, var(--c) 16%, var(--card)), color-mix(in srgb, var(--c) 5%, var(--card))); border-bottom: 1px solid color-mix(in srgb, var(--c) 16%, var(--border)); }
.glyph { width: 44px; height: 44px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: var(--card); box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--c) 50%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c) 22%, var(--border)); }
.glyph.sm { width: 36px; height: 36px; border-radius: var(--radius-sm); }
.glyph .tool-logo, .glyph :deep(img.tool-icon) { width: 26px; height: 26px; object-fit: contain; }
.glyph.sm .tool-logo, .glyph.sm :deep(img.tool-icon) { width: 22px; height: 22px; }
.glyph :deep(i) { font-size: 24px; color: color-mix(in srgb, var(--c) 75%, var(--ink)); }
.glyph.noimg::after { content: attr(data-letter); font-family: var(--font); font-weight: var(--bold); font-size: 20px; color: color-mix(in srgb, var(--c) 75%, var(--ink)); }
/* The title owns the elastic space: `flex: 1 1 auto` (basis = content) lets it
   claim its natural width first and only ellipsis-shrink on real overflow,
   instead of `flex: 1 1 0` which collapses it to a couple of characters next
   to the fixed-size health bar / counter / chevron. */
.card-head .t { flex: 1 1 auto; min-width: 0; }
.card-head .name { font-family: var(--font); font-weight: var(--bold); font-size: 16.5px; letter-spacing: -.03em; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-head .kind { font-family: var(--mono); font-size: 11px; font-weight: 700; color: color-mix(in srgb, var(--c) 55%, var(--ink-3)); text-transform: uppercase; letter-spacing: .04em; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Health bar, counter and chevron keep their intrinsic size (never grow, never
   shrink) so only the title flexes. */
.card-head .health { flex: none; }
.card-head .count { flex: none; }
.card-head .barh { width: 46px; }
.count { font-family: var(--mono); font-size: 12.5px; font-weight: 700; color: color-mix(in srgb, var(--c) 65%, var(--ink)); background: var(--card); border: var(--border-w) var(--lj-border-style, solid) color-mix(in srgb, var(--c) 22%, var(--border)); border-radius: var(--radius-sm); padding: 5px 9px; white-space: nowrap; }
.count small { opacity: .5; }
/* Collapse chevron. */
.chev { flex: none; width: 30px; height: 30px; border-radius: var(--radius-sm); border: none; background: transparent; color: var(--ink-3); cursor: pointer; display: grid; place-items: center; transition: background .12s, color .12s; }
.chev:hover { background: color-mix(in srgb, var(--c) 12%, var(--card)); color: var(--ink); }

/* Subscriptions mini-table. */
.mini { padding: 6px 10px 10px; max-height: 232px; overflow-y: auto; }
.mrow { display: grid; grid-template-columns: 14px 1fr auto; align-items: center; gap: 10px; padding: 8px; border-radius: 11px; }
.mrow + .mrow { box-shadow: inset 0 1px 0 var(--border); }
.mrow.mhead { font-family: var(--mono); font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-3); padding-bottom: 6px; }
.mrow.mhead + .mrow { box-shadow: none; }
.mrow.mhead .m-sum { justify-self: end; }
.mrow.clickable { cursor: pointer; transition: background .12s; }
.mrow.clickable:hover { background: color-mix(in srgb, var(--c) 8%, var(--card)); }
.mlabel { min-width: 0; font-size: 13.5px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.m-sum { justify-self: end; min-width: 0; }
.mempty, .mmore { display: block; text-align: center; font-size: 12px; font-weight: 600; color: var(--ink-3); padding: 8px; }
.mmore { box-shadow: none; }

.pills { display: flex; gap: 5px; flex: none; }
.pill { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--ink-2); background: var(--pill); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius-sm); padding: 2px 7px; }
.pill.cost { color: #b85b00; background: rgba(255,153,0,.12); border-color: rgba(255,153,0,.3); }
.card-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 4px 16px 14px; }
.health { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--ink-3); }
.barh { width: 80px; height: 7px; border-radius: 5px; background: var(--pill); overflow: hidden; }
.barh i { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 60%, white)); }

.avatar-cell { display: flex; align-items: center; gap: 12px; }
.ac-name { font-family: var(--font); font-weight: 700; font-size: 14px; color: var(--ink); }
.ac-kind { font-family: var(--mono); font-size: 11px; color: var(--ink-3); }
.catchip { font-family: var(--font); font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 999px; }
.catchip.func { color: #2f6df6; background: rgba(47,109,246,.13); }
.catchip.tech { color: #d9701a; background: rgba(217,112,26,.14); }
.mono { font-family: var(--mono); }
</style>
