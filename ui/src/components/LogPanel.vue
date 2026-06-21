<!--
  LogPanel — reusable, tabbed container-log viewer. Streams the Spring Boot
  Actuator `logfile` endpoint of BOTH containers, kept separate behind tabs:
   - API → `${APP_BASE}manage/logfile`    (proxied by app-ui to ligoj-api)
   - UI  → `${APP_BASE}actuator/logfile`   (app-ui's own actuator)

  Used by both the dedicated LogsView (`/system/logs`) and the Actuator view's
  `logfile` entry. Self-fetching (no `data` prop): each tab lazily loads its log,
  tailing ~256 KB via an HTTP Range request ("Full log" loads everything). The UI
  tab is probed on mount and only shown when app-ui's own actuator actually
  serves a log (no dead tab on older deployments); the API tab is always present.
  Filter, line-wrap, auto-refresh (5 s), manual refresh and a raw download are
  provided. Reads the `.lj-surface` design tokens from its host view root.
-->
<template>
  <div class="log-panel">
    <v-tabs v-model="tab" density="compact" color="primary" class="log-tabs">
      <v-tab v-for="s in sources" :key="s.key" :value="s.key">
        <v-icon start size="18">{{ s.icon }}</v-icon>{{ s.label }}
      </v-tab>
    </v-tabs>

    <div class="log-card">
      <div class="log-bar">
        <span class="log-meta">{{ currentSource.sub }}</span>
        <v-chip size="x-small" variant="tonal" label color="primary">{{ t('system.logs.lines', { n: shownLines.length }) }}</v-chip>
        <span class="sp" />
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" :placeholder="t('system.logs.filter')"
          density="compact" variant="outlined" hide-details clearable style="max-width:260px" />
        <v-btn-toggle v-model="active.full" mandatory density="compact" variant="outlined" divided class="log-seg">
          <v-btn :value="false" size="small">{{ t('system.logs.tail') }}</v-btn>
          <v-btn :value="true" size="small">{{ t('system.logs.full') }}</v-btn>
        </v-btn-toggle>
        <button class="lj-iconbtn" :title="t('common.refresh')" :disabled="active.loading" @click="load(tab, true)"><v-icon size="18">mdi-refresh</v-icon></button>
        <button class="lj-iconbtn" :class="{ on: wrap }" :title="t('system.logs.wrap')" @click="wrap = !wrap"><v-icon size="18">mdi-wrap</v-icon></button>
        <button class="lj-iconbtn" :class="{ on: auto }" :title="t('system.logs.autoRefresh')" @click="auto = !auto"><v-icon size="18">mdi-autorenew</v-icon></button>
        <button class="lj-iconbtn" :title="t('system.logs.bottom')" @click="scrollBottom"><v-icon size="18">mdi-arrow-down-bold</v-icon></button>
        <a class="lj-iconbtn" :href="currentSource.url" :download="`${tab}.log`" :title="t('system.logs.download')"><v-icon size="18">mdi-download</v-icon></a>
      </div>

      <div v-if="active.loading && !active.text" class="log-loading"><span class="mspin" /></div>
      <v-alert v-else-if="active.error === 'unavailable'" type="info" variant="tonal" density="compact" class="log-msg">{{ t('system.logs.unavailable') }}</v-alert>
      <v-alert v-else-if="active.error" type="warning" variant="tonal" density="compact" class="log-msg">{{ t('system.logs.error') }}</v-alert>
      <p v-else-if="!shownLines.length" class="log-empty">{{ t('system.logs.empty') }}</p>
      <pre v-else ref="logBox" class="log-view" :class="{ wrap }">{{ shownText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useApi, useI18nStore, APP_BASE } from '@ligoj/host'

const api = useApi()
const i18n = useI18nStore()
const t = i18n.t

const TAIL_BYTES = 256 * 1024
const AUTO_MS = 5000
// Detects an HTML document at the start of a body — the backend's error page
// (returned as 206 when a Range header hits a missing logfile endpoint).
const HTML_START = /^\s*<(?:!doctype|html)\b/i

const allSources = computed(() => [
  { key: 'api', label: t('system.logs.api'), sub: t('system.logs.apiSub'), icon: 'mdi-api', url: `${APP_BASE}manage/logfile` },
  { key: 'ui', label: t('system.logs.ui'), sub: t('system.logs.uiSub'), icon: 'mdi-monitor-dashboard', url: `${APP_BASE}actuator/logfile` },
])

// The UI container's own actuator may not be present (older deployments, or
// app-ui not rebuilt with spring-boot-starter-actuator). Probe it once on mount
// and only surface the UI tab when it actually serves a log — no dead tab.
const uiAvailable = ref(false)
const sources = computed(() => allSources.value.filter((s) => s.key !== 'ui' || uiAvailable.value))

const tab = ref('api')
const wrap = ref(true)
const auto = ref(false)
const q = ref('')
const logBox = ref(null)

// Per-source state, so switching tabs keeps each log's content.
const state = reactive({
  api: { loading: false, text: '', error: null, full: false, loaded: false },
  ui: { loading: false, text: '', error: null, full: false, loaded: false },
})

const currentSource = computed(() => sources.value.find((s) => s.key === tab.value) || sources.value[0])
const active = computed(() => state[tab.value])

const shownLines = computed(() => {
  const text = active.value.text || ''
  if (!text) return []
  const lines = text.split('\n')
  const needle = q.value.trim().toLowerCase()
  return needle ? lines.filter((l) => l.toLowerCase().includes(needle)) : lines
})
const shownText = computed(() => shownLines.value.join('\n'))

async function load(key, force) {
  const src = allSources.value.find((s) => s.key === key)
  const st = state[key]
  if (!src || (st.loading && !force)) return
  st.loading = true
  st.error = null
  try {
    const headers = st.full ? {} : { Range: `bytes=-${TAIL_BYTES}` }
    const resp = await api.get(src.url, { silent: true, raw: true, headers })
    if (resp.status === 404 || resp.status === 405 || resp.status === 501) {
      st.error = 'unavailable'; st.text = ''; return
    }
    if (!resp.ok && resp.status !== 206) { st.error = 'error'; st.text = ''; return }
    // The `logfile` endpoint serves text/plain. When it's not active the backend
    // forwards to its HTML error page — and the Range header makes that come back
    // as `206 Partial Content`, so status alone isn't enough. Never show HTML as
    // logs: treat an HTML body as "endpoint unavailable".
    const ct = resp.headers.get('content-type') || ''
    const body = await resp.text()
    if (ct.includes('text/html') || HTML_START.test(body.slice(0, 64))) {
      st.error = 'unavailable'; st.text = ''; return
    }
    st.text = body
    st.loaded = true
  } catch {
    st.error = 'error'; st.text = ''
  } finally {
    st.loading = false
    scrollBottom()
  }
}

function scrollBottom() {
  nextTick(() => { const el = logBox.value; if (el) el.scrollTop = el.scrollHeight })
}

// Cheap availability probe for the UI container's actuator: fetch the first
// bytes only. A missing endpoint answers with the HTML error page (200/206
// text/html); a live one answers text/plain. Reveals the UI tab when present.
async function probeUi() {
  const ui = allSources.value.find((s) => s.key === 'ui')
  if (!ui) return
  try {
    const resp = await api.get(ui.url, { silent: true, raw: true, headers: { Range: 'bytes=0-1023' } })
    if (resp.status === 404 || resp.status === 405 || resp.status === 501) return
    // 416 (Range Not Satisfiable) means the endpoint exists but the log is empty
    // — still "available", just nothing to read yet.
    if (resp.status === 416) { uiAvailable.value = true; return }
    if (!resp.ok && resp.status !== 206) return
    const ct = resp.headers.get('content-type') || ''
    const body = await resp.text()
    if (ct.includes('text/html') || HTML_START.test(body.slice(0, 64))) return
    uiAvailable.value = true
  } catch { /* keep the UI tab hidden */ }
}

// Auto-refresh the visible tab on a timer.
let timer = null
function syncAuto() {
  if (timer) { clearInterval(timer); timer = null }
  if (auto.value) timer = setInterval(() => load(tab.value, true), AUTO_MS)
}
watch(auto, syncAuto)
watch(tab, (k) => { if (!state[k].loaded) load(k); else scrollBottom(); syncAuto() })
// Reload when the tail/full scope changes for the active tab.
watch(() => active.value.full, () => load(tab.value, true))

onMounted(() => { load(tab.value); probeUi() })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.log-tabs { margin-bottom: 12px; }

.log-card { background: var(--surface); border: var(--border-w) solid var(--border-c); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
.log-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 10px 14px; border-bottom: var(--border-w) solid var(--border-c); }
.log-meta { font-family: var(--mono); font-size: 12px; color: var(--ink-3); }
.sp { flex: 1; }
.log-seg :deep(.v-btn) { text-transform: none; }

.log-loading { display: flex; justify-content: center; padding: 40px; }
.mspin { width: 26px; height: 26px; border: 3px solid var(--pill); border-top-color: rgb(var(--v-theme-primary)); border-radius: 50%; animation: log-spin .7s linear infinite; }
@keyframes log-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .mspin { animation: none; } }
.log-msg, .log-empty { margin: 16px; }
.log-empty { color: var(--ink-3); font-size: 13px; }

.log-view { margin: 0; padding: 14px 16px; font-family: var(--mono); font-size: 12px; line-height: 1.5; color: var(--ink-2); background: var(--card, var(--surface)); max-height: 70vh; overflow: auto; white-space: pre; tab-size: 2; }
.log-view.wrap { white-space: pre-wrap; word-break: break-word; }

a.lj-iconbtn { display: inline-grid; place-items: center; text-decoration: none; }
.lj-iconbtn.on { background: rgba(var(--v-theme-primary), .16); color: rgb(var(--v-theme-primary)); }
</style>
