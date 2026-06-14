<!--
  ActuatorView — 2026 "Vibrant" Spring Boot Actuator browser
  (Administration → Information → Actuator). Reads the management base path
  index (`<base>/manage`, a HAL document of `_links`), lists every exposed
  endpoint with a friendly label + icon, and renders the selected endpoint's
  response in a readable form (a status board for `health`, pretty-printed
  JSON otherwise). Templated endpoints (those taking a path variable, e.g.
  `metrics/{name}`) are listed but not directly fetchable.
-->
<template>
  <div class="actuator lj-surface">
    <LjPageHeader :title="t('system.actuator.title')" :subtitle="t('system.actuator.subtitle')" :crumbs="crumbs">
      <template #actions>
        <LjButton variant="ghost" icon="mdi-refresh" :loading="loadingIndex" @click="loadIndex">{{ t('common.refresh') }}</LjButton>
      </template>
    </LjPageHeader>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <div class="act-layout">
      <!-- Endpoint catalog -->
      <aside class="act-list">
        <div class="act-list-head">{{ t('system.actuator.endpoints') }}<span class="act-count">{{ endpoints.length }}</span></div>
        <button v-for="ep in endpoints" :key="ep.name" class="act-ep" :class="{ on: selected === ep.name, templated: ep.templated }"
          :disabled="ep.templated" :title="ep.templated ? t('system.actuator.templated') : ep.href" @click="select(ep)">
          <span class="act-ep-ic"><v-icon size="18">{{ ep.icon }}</v-icon></span>
          <span class="act-ep-txt"><span class="act-ep-name">{{ ep.label }}</span><span class="act-ep-key">{{ ep.name }}</span></span>
          <v-icon v-if="ep.templated" size="14" class="act-ep-tpl">mdi-variable</v-icon>
        </button>
      </aside>

      <!-- Detail viewer -->
      <section class="act-detail">
        <div v-if="!current" class="act-empty">
          <v-icon size="42">mdi-gauge</v-icon>
          <p>{{ t('system.actuator.pickHint') }}</p>
        </div>
        <template v-else>
          <div class="act-detail-head">
            <span class="dh-ic"><v-icon size="20">{{ current.icon }}</v-icon></span>
            <div class="dh-txt"><h3>{{ current.label }}</h3><code class="dh-href">{{ current.href }}</code></div>
            <span class="sp" />
            <button class="lj-iconbtn" :title="t('common.refresh')" :disabled="loadingDetail || isBinary || isWrite || isLogfile" @click="loadDetail(current)"><v-icon size="18">mdi-refresh</v-icon></button>
            <button v-if="rendererComponent" class="lj-iconbtn" :class="{ on: rawMode }" :title="rawMode ? t('system.actuator.prettyView') : t('system.actuator.rawView')" :disabled="loadingDetail || detail == null" @click="rawMode = !rawMode"><v-icon size="18">{{ rawMode ? 'mdi-table-eye' : 'mdi-code-json' }}</v-icon></button>
            <button class="lj-iconbtn" :title="t('system.actuator.download')" :disabled="loadingDetail || detail == null" @click="downloadJson"><v-icon size="18">mdi-download</v-icon></button>
            <button class="lj-iconbtn" :title="t('system.actuator.copy')" :disabled="loadingDetail || detail == null" @click="copy(detailPretty, { message: t('system.actuator.copied') })"><v-icon size="18">mdi-content-copy</v-icon></button>
          </div>

          <!-- Binary / streaming endpoint: direct download instead of rendering -->
          <div v-if="isBinary" class="act-binary">
            <v-icon size="42">mdi-download-circle-outline</v-icon>
            <p>{{ t('system.actuator.binaryHint') }}</p>
            <v-btn :href="current.href" :download="`actuator-${selected}`" color="primary" variant="flat" prepend-icon="mdi-download">{{ t('system.actuator.download') }}</v-btn>
          </div>
          <!-- Log file: the dedicated tabbed log viewer (shared with LogsView) -->
          <LogPanel v-else-if="isLogfile" class="act-logpanel" />
          <!-- POST-only operation: invoke via a submit button (with confirm for destructive ones) -->
          <div v-else-if="isWrite" class="act-op">
            <span class="op-ic" :class="{ danger: isDangerous }"><v-icon size="40">{{ current.icon }}</v-icon></span>
            <p class="op-desc">{{ opDesc }}</p>
            <v-alert v-if="opResult" :type="opResult.ok ? 'success' : 'error'" variant="tonal" density="compact" class="op-alert">{{ opResult.msg }}</v-alert>
            <div v-if="confirming" class="op-confirm">
              <span class="op-confirm-q"><v-icon size="18" color="error">mdi-alert</v-icon>{{ t('system.actuator.op.confirm', { op: current.label }) }}</span>
              <div class="op-confirm-btns">
                <v-btn variant="text" :disabled="opRunning" @click="confirming = false">{{ t('common.cancel') }}</v-btn>
                <v-btn color="error" variant="flat" :loading="opRunning" @click="runOperation">{{ t('system.actuator.op.submit') }}</v-btn>
              </div>
            </div>
            <v-btn v-else :color="isDangerous ? 'error' : 'primary'" variant="flat" size="large"
              prepend-icon="mdi-play" :loading="opRunning" @click="isDangerous ? (confirming = true) : runOperation()">{{ t('system.actuator.op.submit') }}</v-btn>
          </div>
          <div v-else-if="loadingDetail" class="act-loading"><span class="mspin" /></div>
          <p v-else-if="detailError" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ detailError }}</p>
          <!-- Dedicated user-friendly renderer, or the raw JSON fallback -->
          <component :is="rendererComponent" v-else-if="rendererComponent && !rawMode" :data="detail" :copy="copy" :fetch="fetchManage" :post="postManage" class="act-render" />
          <pre v-else class="act-json">{{ detailPretty }}</pre>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi, useAppStore, useClipboard, useI18nStore, APP_BASE, LjPageHeader, LjButton } from '@ligoj/host'
import { ACTUATOR_RENDERERS } from '../components/actuator/registry.js'
import LogPanel from '../components/LogPanel.vue'

const route = useRoute()
const router = useRouter()
const app = useAppStore()
// The actuator browser lives under /system/information/actuator/<endpoint>; the
// selected endpoint is driven by the route param (default `info`).
const ACTUATOR_BASE = '/system/information/actuator'
const DEFAULT_EP = 'info'

const api = useApi()
const i18n = useI18nStore()
const t = i18n.t
const { copy } = useClipboard()

// Friendly label + icon for the well-known Spring Boot Actuator endpoints.
// Unknown endpoints fall back to a humanised name + a generic icon.
const EP_META = {
  health: { label: 'Health', icon: 'mdi-heart-pulse' },
  info: { label: 'Info', icon: 'mdi-information-outline' },
  metrics: { label: 'Metrics', icon: 'mdi-chart-line' },
  env: { label: 'Environment', icon: 'mdi-cog-outline' },
  beans: { label: 'Beans', icon: 'mdi-cube-outline' },
  mappings: { label: 'Mappings', icon: 'mdi-sitemap-outline' },
  configprops: { label: 'Config properties', icon: 'mdi-tune-variant' },
  conditions: { label: 'Conditions', icon: 'mdi-source-branch' },
  loggers: { label: 'Loggers', icon: 'mdi-text-box-outline' },
  threaddump: { label: 'Thread dump', icon: 'mdi-cpu-64-bit' },
  heapdump: { label: 'Heap dump', icon: 'mdi-memory' },
  logfile: { label: 'Log file', icon: 'mdi-file-document-outline' },
  scheduledtasks: { label: 'Scheduled tasks', icon: 'mdi-clock-outline' },
  caches: { label: 'Caches', icon: 'mdi-database-outline' },
  sbom: { label: 'SBOM', icon: 'mdi-package-variant-closed' },
  startup: { label: 'Startup', icon: 'mdi-rocket-launch-outline' },
  metricsname: { label: 'Metric', icon: 'mdi-chart-line' },
  liquibase: { label: 'Liquibase', icon: 'mdi-database-sync' },
  flyway: { label: 'Flyway', icon: 'mdi-database-sync' },
  loggersname: { label: 'Logger', icon: 'mdi-text-box-outline' },
}

const endpoints = ref([])
const selected = ref(null)
const detail = ref(null)
const detailError = ref(null)
const error = ref(null)
const loadingIndex = ref(false)
const loadingDetail = ref(false)
const rawMode = ref(false)

// Binary / streaming endpoints must not be fetched-and-rendered as text (a heap
// dump can be hundreds of MB) — they're offered as a direct download instead.
const BINARY_EPS = new Set(['heapdump'])
const isBinary = computed(() => BINARY_EPS.has(selected.value))

// `logfile` gets the dedicated tabbed log viewer (LogPanel, shared with
// LogsView) instead of being fetched/rendered as a blob of text.
const isLogfile = computed(() => selected.value === 'logfile')

// POST-only lifecycle / Spring Cloud operations. These can't be GET-rendered
// (a GET returns 405) — they're invoked from a submit button instead, with a
// confirmation step for the destructive ones.
const OP_META = {
  restart: { danger: true, desc: 'Restart the Spring application context — beans are torn down and recreated (brief downtime).' },
  shutdown: { danger: true, desc: 'Shut the application down. The process stops and must be restarted externally.' },
  refresh: { danger: false, desc: 'Reload externalized configuration and re-bind @ConfigurationProperties / @RefreshScope beans.' },
  pause: { danger: false, desc: 'Pause the application lifecycle (stop) without exiting the process.' },
  resume: { danger: false, desc: 'Resume a paused application lifecycle (start).' },
}
const isWrite = computed(() => !!OP_META[selected.value])
const isDangerous = computed(() => !!OP_META[selected.value]?.danger)
const opDesc = computed(() => OP_META[selected.value]?.desc || '')
const confirming = ref(false)
const opRunning = ref(false)
const opResult = ref(null)

const current = computed(() => endpoints.value.find((e) => e.name === selected.value) || null)

// Breadcrumbs: System → Information → Actuator → <endpoint>, so the actuator
// browser reads as a child of the Information view.
const crumbs = computed(() => {
  const trail = [
    { icon: 'mdi-cog-outline', label: t('system.breadcrumb') },
    { label: t('system.info.title'), to: '/system/information' },
    { label: t('system.actuator.title'), to: `${ACTUATOR_BASE}/${DEFAULT_EP}` },
  ]
  if (current.value) trail.push({ label: current.value.label, current: true })
  else trail[trail.length - 1].current = true
  return trail
})

// Shell breadcrumb (top bar) — driven by the app store, separate from the
// in-page LjPageHeader crumbs above. Build the same trail so the bar reads
// `Home › System › Information › Actuator › <endpoint>`. The store only re-runs
// the factory on locale change, so re-set it whenever the selection changes.
function breadcrumbFactory() {
  const trail = [
    { title: t('nav.home'), to: '/' },
    { title: t('system.breadcrumb') },
    { title: t('system.info.title'), to: '/system/information' },
    { title: t('system.actuator.title'), to: `${ACTUATOR_BASE}/${DEFAULT_EP}` },
  ]
  if (current.value) trail.push({ title: current.value.label })
  return trail
}
function updateBreadcrumbs() {
  app.setBreadcrumbs(breadcrumbFactory, { refresh: loadIndex })
}
watch(current, updateBreadcrumbs, { immediate: true })
const detailPretty = computed(() => (typeof detail.value === 'string' ? detail.value : JSON.stringify(detail.value, null, 2)))
// The dedicated, user-friendly renderer for the selected endpoint (null → only
// the raw JSON view is available).
const rendererComponent = computed(() => ACTUATOR_RENDERERS[selected.value] || null)

// Download the current endpoint's payload as a pretty-printed .json file.
function downloadJson() {
  if (detail.value == null) return
  const blob = new Blob([detailPretty.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `actuator-${selected.value}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function humanise(name) {
  const s = name.replace(/[-_]/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// The actuator index reports hrefs under the BACKEND's own context path
// (e.g. `/ligoj-api/manage/health`), which differs from the path the UI used to
// reach it (`${APP_BASE}manage`, proxied to the API). Keep only the segment
// after `/manage/` and rebuild it against APP_BASE so the fetch goes through the
// same reachable (proxied, same-origin) route as the index.
function toPath(href) {
  try {
    const path = new URL(href, window.location.origin).pathname
    const marker = '/manage/'
    const i = path.indexOf(marker)
    if (i >= 0) return `${APP_BASE}manage/${path.slice(i + marker.length)}`
  } catch { /* fall through to the raw href */ }
  return href
}

async function loadIndex() {
  loadingIndex.value = true
  error.value = null
  try {
    const data = await api.get(`${APP_BASE}manage`, { silent: true, raw: true })
    if (!data?.ok) { error.value = t('system.actuator.error'); endpoints.value = []; return }
    const links = (await data.json())?._links || {}
    endpoints.value = Object.entries(links)
      .filter(([name]) => name !== 'self')
      .map(([name, link]) => {
        const meta = EP_META[name] || { label: humanise(name), icon: 'mdi-api' }
        return { name, label: meta.label, icon: meta.icon, templated: !!link.templated, href: toPath(link.href) }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
    // Select the endpoint named in the route (default `info`).
    syncFromRoute()
  } catch {
    error.value = t('system.actuator.error')
    endpoints.value = []
  } finally {
    loadingIndex.value = false
  }
}

// Endpoint catalog click → navigate; the route param drives the actual
// selection (so deep links and the back button work).
function select(ep) {
  if (ep.templated) return
  if (route.params.endpoint === ep.name) { applySelect(ep); return }
  router.push(`${ACTUATOR_BASE}/${ep.name}`)
}

// Reflect the route param onto the selected endpoint (default `info`).
function syncFromRoute() {
  if (!endpoints.value.length) return
  const want = route.params.endpoint || DEFAULT_EP
  const ep = endpoints.value.find((e) => e.name === want && !e.templated)
    || endpoints.value.find((e) => e.name === DEFAULT_EP && !e.templated)
    || endpoints.value.find((e) => !e.templated)
  if (ep) applySelect(ep)
}

function applySelect(ep) {
  selected.value = ep.name
  rawMode.value = false // default to the friendly view for each endpoint
  detail.value = null
  detailError.value = null
  opResult.value = null
  confirming.value = false
  if (BINARY_EPS.has(ep.name)) return // offered as a direct download, not fetched
  if (ep.name === 'logfile') return // rendered by the embedded LogPanel (self-fetching)
  if (OP_META[ep.name]) return // POST-only operation — invoked via the submit button
  loadDetail(ep)
}

// React to in-app navigation between actuator endpoints.
watch(() => route.params.endpoint, syncFromRoute)

// Generic fetcher passed to renderers that need to pull sub-resources (e.g.
// ActMetrics fetching `metrics/<name>` lazily). Same raw+parse handling as the
// detail loader, against the reachable/proxied `${APP_BASE}manage/` base.
async function fetchManage(subpath) {
  const resp = await api.get(`${APP_BASE}manage/${subpath}`, { silent: true, raw: true })
  if (!resp?.ok) return null
  const text = await resp.text()
  try { return JSON.parse(text) } catch { return text }
}

// Generic POST passed to renderers that mutate actuator state (e.g. ActLoggers
// changing a logger's level). Returns the raw Response so callers can branch on
// `.ok`. `body` is JSON-encoded by useApi when present.
async function postManage(subpath, body) {
  return api.post(`${APP_BASE}manage/${subpath}`, body, { silent: true, raw: true })
}

// Invoke the selected POST-only operation (restart/refresh/pause/resume/shutdown).
async function runOperation() {
  if (!current.value) return
  const label = current.value.label
  opRunning.value = true
  opResult.value = null
  try {
    const resp = await postManage(selected.value)
    opResult.value = resp?.ok
      ? { ok: true, msg: t('system.actuator.op.success', { op: label }) }
      : { ok: false, msg: t('system.actuator.op.failed', { op: label, status: resp?.status ?? '' }) }
  } catch {
    // restart/shutdown frequently drop the connection before replying — treat a
    // network error on a destructive op as "triggered" rather than a failure.
    opResult.value = isDangerous.value
      ? { ok: true, msg: t('system.actuator.op.triggered', { op: label }) }
      : { ok: false, msg: t('system.actuator.op.failed', { op: label, status: '' }) }
  } finally {
    opRunning.value = false
    confirming.value = false
  }
}

async function loadDetail(ep) {
  loadingDetail.value = true
  detailError.value = null
  detail.value = null
  try {
    // Actuator uses `application/vnd.spring-boot.actuator.v3+json`, which the
    // shared `useApi` doesn't recognise as JSON — fetch raw and parse here,
    // falling back to plain text for non-JSON endpoints.
    const resp = await api.get(ep.href, { silent: true, raw: true })
    if (!resp?.ok) { detailError.value = t('system.actuator.detailError'); return }
    const text = await resp.text()
    try { detail.value = JSON.parse(text) } catch { detail.value = text }
  } catch {
    detailError.value = t('system.actuator.detailError')
  } finally {
    loadingDetail.value = false
  }
}

loadIndex()
</script>

<style scoped>
.actuator { padding-bottom: 24px; }
.errline { display: flex; align-items: center; gap: 6px; color: rgb(var(--v-theme-warning)); font-size: 13px; margin: 0 0 12px; }

.act-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; align-items: start; }
@media (max-width: 760px) { .act-layout { grid-template-columns: 1fr; } }

/* Endpoint catalog */
.act-list { background: var(--surface); border: var(--border-w) solid var(--border-c); border-radius: var(--radius); padding: 8px; box-shadow: var(--shadow); }
.act-list-head { display: flex; align-items: center; gap: 8px; font-family: var(--font); font-weight: var(--bold); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-3); padding: 6px 8px 8px; }
.act-count { margin-left: auto; font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: var(--pill); color: var(--ink-2); }
.act-ep { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 8px 10px; border: 0; background: transparent; border-radius: var(--radius-sm); cursor: pointer; color: var(--ink); transition: background .12s; }
.act-ep:hover:not(:disabled) { background: var(--hover); }
.act-ep.on { background: rgba(var(--v-theme-secondary), .14); }
.act-ep.templated { opacity: .5; cursor: not-allowed; }
.act-ep-ic { display: grid; place-items: center; width: 30px; height: 30px; flex: none; border-radius: var(--radius-sm); background: var(--pill); color: var(--ink-2); }
.act-ep.on .act-ep-ic { background: rgba(var(--v-theme-secondary), .2); color: rgb(var(--v-theme-secondary)); }
.act-ep-txt { display: flex; flex-direction: column; min-width: 0; }
.act-ep-name { font-family: var(--font); font-weight: 700; font-size: 13.5px; }
.act-ep-key { font-family: var(--mono); font-size: 11px; color: var(--ink-3); }
.act-ep-tpl { color: var(--ink-3); margin-left: auto; }

/* Detail viewer */
.act-detail { background: var(--surface); border: var(--border-w) solid var(--border-c); border-radius: var(--radius); box-shadow: var(--shadow); min-height: 220px; overflow: hidden; }
.act-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 48px 16px; color: var(--ink-3); text-align: center; }
.act-detail-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: var(--border-w) solid var(--border-c); }
.dh-ic { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: var(--radius-sm); background: rgba(var(--v-theme-secondary), .15); color: rgb(var(--v-theme-secondary)); }
.dh-txt { min-width: 0; }
.dh-txt h3 { margin: 0; font-family: var(--font); font-weight: var(--bold); font-size: 16px; color: var(--ink); }
.dh-href { font-family: var(--mono); font-size: 11.5px; color: var(--ink-3); }
.sp { flex: 1; }

.act-loading { display: flex; justify-content: center; padding: 40px; }
.mspin { width: 26px; height: 26px; border: 3px solid var(--pill); border-top-color: rgb(var(--v-theme-secondary)); border-radius: 50%; animation: act-spin .7s linear infinite; }
@keyframes act-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .mspin { animation: none; } }

.act-json { margin: 0; padding: 16px; font-family: var(--mono); font-size: 12.5px; line-height: 1.55; color: var(--ink-2); white-space: pre; overflow: auto; max-height: 70vh; }

/* Dedicated renderer wrapper */
.act-render { padding: 16px; max-height: 72vh; overflow: auto; }
.act-binary { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 16px; color: var(--ink-3); text-align: center; }
.act-logpanel { padding: 16px; }

/* POST-only operation panel */
.act-op { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px 24px; text-align: center; }
.op-ic { display: grid; place-items: center; width: 64px; height: 64px; border-radius: var(--radius); background: rgba(var(--v-theme-primary), .12); color: rgb(var(--v-theme-primary)); }
.op-ic.danger { background: rgba(var(--v-theme-error), .12); color: rgb(var(--v-theme-error)); }
.op-desc { margin: 0; max-width: 460px; font-size: 13.5px; line-height: 1.55; color: var(--ink-2); }
.op-alert { width: 100%; max-width: 460px; }
.op-confirm { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.op-confirm-q { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: var(--ink); }
.op-confirm-btns { display: flex; gap: 8px; }

/* Shared table conventions for ALL actuator renderers (:deep reaches the child
   mounted as <component class="act-render">). Tables never scroll horizontally:
   fixed layout + single-line ellipsis cells. Plus the shared copy-cell and the
   right-aligned panel counter classes the renderers use. */
.act-render :deep(.v-table__wrapper) { overflow-x: hidden; }
.act-render :deep(.v-table table) { table-layout: fixed; width: 100%; }
.act-render :deep(.v-table thead th),
.act-render :deep(.v-table tbody td) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Copy-on-hover cell: ellipsised text + a reveal-on-hover copy button. */
.act-render :deep(.cc) { display: flex; align-items: center; gap: 6px; min-width: 0; }
.act-render :deep(.cc-txt) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1 1 auto; }
.act-render :deep(.cc-copy) { flex: none; display: inline-flex; align-items: center; opacity: 0; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; color: var(--ink-3); transition: opacity .12s; }
.act-render :deep(tr:hover .cc-copy),
.act-render :deep(.pt:hover .cc-copy) { opacity: .6; }
.act-render :deep(.cc-copy:hover) { opacity: 1; }
/* Expansion-panel title row with a right-aligned counter chip. */
.act-render :deep(.pt) { display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0; }
.act-render :deep(.pt-count) { margin-left: auto; }
.lj-iconbtn.on { background: rgba(var(--v-theme-secondary), .18); color: rgb(var(--v-theme-secondary)); }
</style>
