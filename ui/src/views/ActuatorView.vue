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
    <LjPageHeader :title="t('system.actuator.title')" :subtitle="t('system.actuator.subtitle')"
      :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.info.title'), to: '/system/information' }, { label: t('system.actuator.title'), current: true }]">
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
            <button class="lj-iconbtn" :title="t('common.refresh')" :disabled="loadingDetail" @click="loadDetail(current)"><v-icon size="18">mdi-refresh</v-icon></button>
            <button class="lj-iconbtn" :title="t('system.actuator.copy')" :disabled="loadingDetail || detail == null" @click="copy(detailPretty, { message: t('system.actuator.copied') })"><v-icon size="18">mdi-content-copy</v-icon></button>
          </div>

          <div v-if="loadingDetail" class="act-loading"><span class="mspin" /></div>
          <p v-else-if="detailError" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ detailError }}</p>

          <!-- Friendly health board -->
          <div v-else-if="selected === 'health' && isObject(detail)" class="act-health">
            <div class="hstatus" :class="statusClass(detail.status)"><v-icon size="20">{{ statusIcon(detail.status) }}</v-icon>{{ detail.status || '—' }}</div>
            <div v-if="healthComponents.length" class="hcomps">
              <div v-for="c in healthComponents" :key="c.name" class="hcomp">
                <span class="hc-dot" :class="statusClass(c.status)" />
                <span class="hc-name">{{ c.name }}</span>
                <span class="hc-status" :class="statusClass(c.status)">{{ c.status }}</span>
              </div>
            </div>
          </div>

          <!-- Generic JSON / text -->
          <pre v-else class="act-json">{{ detailPretty }}</pre>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi, useClipboard, useI18nStore, APP_BASE, LjPageHeader, LjButton } from '@ligoj/host'

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

const current = computed(() => endpoints.value.find((e) => e.name === selected.value) || null)
const detailPretty = computed(() => (typeof detail.value === 'string' ? detail.value : JSON.stringify(detail.value, null, 2)))
const healthComponents = computed(() => {
  const c = isObject(detail.value) ? (detail.value.components || detail.value.details) : null
  return c ? Object.entries(c).map(([name, v]) => ({ name, status: v?.status ?? '—' })) : []
})

function isObject(v) { return v != null && typeof v === 'object' }

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

function statusClass(status) {
  switch (String(status || '').toUpperCase()) {
    case 'UP': return 'ok'
    case 'DOWN': return 'err'
    case 'OUT_OF_SERVICE': return 'warn'
    default: return 'muted'
  }
}
function statusIcon(status) {
  switch (String(status || '').toUpperCase()) {
    case 'UP': return 'mdi-check-circle'
    case 'DOWN': return 'mdi-alert-circle'
    case 'OUT_OF_SERVICE': return 'mdi-pause-circle'
    default: return 'mdi-help-circle'
  }
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
    // Auto-select a sensible default so the page isn't empty on arrival.
    const def = endpoints.value.find((e) => e.name === 'health' && !e.templated)
      || endpoints.value.find((e) => !e.templated)
    if (def) select(def)
  } catch {
    error.value = t('system.actuator.error')
    endpoints.value = []
  } finally {
    loadingIndex.value = false
  }
}

function select(ep) {
  if (ep.templated) return
  selected.value = ep.name
  loadDetail(ep)
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

/* Health board */
.act-health { padding: 16px; }
.hstatus { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font); font-weight: 800; font-size: 15px; padding: 8px 14px; border-radius: 999px; margin-bottom: 16px; }
.hstatus.ok { background: rgba(29, 157, 99, .14); color: #1d9d63; }
.hstatus.err { background: rgba(var(--v-theme-error), .14); color: rgb(var(--v-theme-error)); }
.hstatus.warn { background: rgba(217, 112, 26, .14); color: #d9701a; }
.hstatus.muted { background: var(--pill); color: var(--ink-2); }
.hcomps { display: grid; gap: 6px; }
.hcomp { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: var(--border-w) solid var(--border-c); border-radius: var(--radius-sm); }
.hc-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.hc-dot.ok { background: #1d9d63; }
.hc-dot.err { background: rgb(var(--v-theme-error)); }
.hc-dot.warn { background: #d9701a; }
.hc-dot.muted { background: var(--ink-3); }
.hc-name { font-family: var(--mono); font-size: 13px; color: var(--ink); }
.hc-status { margin-left: auto; font-size: 11.5px; font-weight: 700; }
.hc-status.ok { color: #1d9d63; }
.hc-status.err { color: rgb(var(--v-theme-error)); }
.hc-status.warn { color: #d9701a; }
.hc-status.muted { color: var(--ink-3); }
</style>
