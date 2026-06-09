<!--
  SystemBenchView — 2026 "Vibrant" database benchmark tool
  (Administration → Bench). Ports plugin-ui's SystemBenchView logic (runs
  INSERT → SELECT → SELECT * → UPDATE → DELETE against rest/system/bench/* and
  reports each step's duration; the INSERT step needs a multipart FormData
  body to satisfy the server's @Consumes constraint) onto the Vibrant chrome:
  breadcrumb-chip header, an explainer + control panel (custom number input +
  Run CTA + total badge) and a results panel with per-step proportion bars.
-->
<template>
  <div class="bench lj-surface">
    <LjPageHeader :title="t('system.bench.heading')" :subtitle="t('system.bench.subtitle')"
      :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.bench.title'), current: true }]">
      <template v-if="totalDuration != null" #actions>
        <div class="total-badge">
          <span class="tb-label">{{ t('system.bench.total') }}</span>
          <span class="tb-num">{{ totalDuration }}<small>{{ t('system.bench.ms') }}</small></span>
        </div>
      </template>
    </LjPageHeader>

    <div class="panel-card help">
      <span class="help-ic"><v-icon size="20">mdi-database-clock-outline</v-icon></span>
      <p>{{ t('system.bench.help') }}</p>
    </div>

    <div class="ctrl">
      <div class="numfield">
        <v-icon size="17" class="nf-ic">mdi-counter</v-icon>
        <input v-model.number="nb" type="number" min="1" :aria-label="t('system.bench.fieldNb')" />
      </div>
      <LjButton icon="mdi-play" :loading="running" @click="run">{{ t('system.bench.run') }}</LjButton>
    </div>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <div class="panel-card steps">
      <div v-for="(r, i) in results" :key="r.step" class="step" :style="{ animationDelay: (i * 60) + 'ms' }">
        <span class="st-badge" :class="{ done: typeof r.duration === 'number', running: r.loading }">{{ i + 1 }}</span>
        <span class="st-name">{{ r.step }}</span>
        <div class="st-bar"><i :style="{ width: barWidth(r) + '%' }" :class="{ idle: r.duration == null }" /></div>
        <span class="st-dur">
          <span v-if="r.loading" class="mspin sm" aria-hidden="true" />
          <template v-else-if="typeof r.duration === 'number'">{{ r.duration }}<small>{{ t('system.bench.ms') }}</small></template>
          <template v-else>{{ r.duration ?? '—' }}</template>
        </span>
      </div>
      <p v-if="!hasRun" class="idle-hint">{{ t('system.bench.idle') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useI18nStore, APP_BASE, LjPageHeader, LjButton } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const nb = ref(1000)

// `prepare` is @Consumes(FORM_URLENCODED, MULTIPART) / @Produces(TEXT_HTML), so
// posting via useApi (empty body, no Content-Type) returns 415. Send FormData —
// fetch sets the multipart boundary — and parse the text response. The other
// four steps are well-behaved JSON endpoints and go through useApi.
const STEPS = [
  { key: 'insert', step: 'INSERT', form: true, url: 'rest/system/bench/prepare' },
  { key: 'select', step: 'SELECT', method: 'get', url: 'rest/system/bench/read' },
  { key: 'select-all', step: 'SELECT *', method: 'get', url: 'rest/system/bench/read/all' },
  { key: 'update', step: 'UPDATE', method: 'put', url: 'rest/system/bench/update' },
  { key: 'delete', step: 'DELETE', method: 'del', url: 'rest/system/bench/delete' },
]

const running = ref(false)
const hasRun = ref(false)
const error = ref(null)
const results = ref(STEPS.map((s) => ({ step: s.step, duration: null, loading: false })))

const totalDuration = computed(() => {
  const nums = results.value.map((r) => r.duration).filter((d) => typeof d === 'number')
  return nums.length === STEPS.length ? nums.reduce((s, d) => s + d, 0) : null
})
const maxDuration = computed(() => Math.max(1, ...results.value.map((r) => (typeof r.duration === 'number' ? r.duration : 0))))
function barWidth(r) { return typeof r.duration === 'number' ? Math.max(3, Math.round(r.duration / maxDuration.value * 100)) : 0 }

async function runStep(step) {
  if (step.form) {
    const form = new FormData()
    form.append('nb', nb.value || 1000)
    const resp = await fetch(`${APP_BASE}${step.url}`, { method: 'POST', credentials: 'include', body: form })
    if (!resp.ok) throw new Error(`${step.step} HTTP ${resp.status}`)
    const text = (await resp.text()).trim()
    if (!text) return { duration: '' }
    try { return JSON.parse(text) } catch { /* fall through */ }
    const n = Number(text)
    return { duration: Number.isFinite(n) ? n : text }
  }
  return api[step.method](step.url)
}

async function run() {
  running.value = true; hasRun.value = true; error.value = null
  results.value = STEPS.map((s) => ({ step: s.step, duration: null, loading: false }))
  for (let i = 0; i < STEPS.length; i++) {
    results.value[i].loading = true
    try {
      const data = await runStep(STEPS[i])
      results.value[i].duration = data?.duration ?? '—'
    } catch (e) {
      error.value = `${STEPS[i].step} failed: ${e.message || e}`
      break
    } finally {
      results.value[i].loading = false
    }
  }
  running.value = false
}

onMounted(() => {
  app.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.bench.title') }])
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, primary Run button) comes
   from the shared host components + the global `.lj-surface` class, which
   supplies the ink, pill, radius, mono, surface, card and shadow vars these
   rules read. The `.mspin` here drives the per-step row spinners (not the
   button, which uses LjButton's own spinner). */
.total-badge { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding: 10px 18px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) color-mix(in srgb, var(--accent) 30%, var(--border)); background: linear-gradient(135deg, rgba(var(--v-theme-secondary), .1), var(--card)); }
.tb-label { font-family: var(--font); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-3); }
.tb-num { font-family: var(--mono); font-weight: 700; font-size: 24px; line-height: 1; color: var(--accent); }
.tb-num small { font-size: 13px; margin-left: 2px; }

.panel-card { border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); margin-bottom: 16px; }
.help { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
.help-ic { width: 42px; height: 42px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #2f6df6, #1e40af); box-shadow: 0 8px 18px -8px rgba(47, 109, 246, .55); }
.help p { margin: 0; font-size: 13.5px; color: var(--ink-2); font-weight: 500; line-height: 1.5; }

.ctrl { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.numfield { display: inline-flex; align-items: center; gap: 8px; padding: 0 14px; height: 46px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--surface); width: 180px; transition: border-color .15s; }
.numfield:focus-within { border-color: var(--border-2); }
.nf-ic { color: var(--ink-3); }
.numfield input { flex: 1; border: 0; outline: 0; background: transparent; color: var(--ink); font-family: var(--mono); font-size: 15px; font-weight: 600; min-width: 0; }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

.steps { padding: 8px 18px; max-width: 720px; }
.step { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); animation: rowin .34s cubic-bezier(.2, .7, .3, 1) both; }
@keyframes rowin { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .step { animation: none; } }
.step:last-of-type { border-bottom: 0; }
.st-badge { width: 26px; height: 26px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; font-family: var(--mono); font-weight: 700; font-size: 12px; color: var(--ink-3); background: var(--pill); transition: background .2s, color .2s; }
.st-badge.done { color: #fff; background: linear-gradient(135deg, #1d9d63, #15784b); }
.st-badge.running { color: #fff; background: linear-gradient(135deg, #ff9436, #ff5a52); }
.st-name { font-family: var(--mono); font-weight: 600; font-size: 13.5px; color: var(--ink); width: 90px; flex: none; }
.st-bar { flex: 1; height: 8px; border-radius: 5px; background: var(--pill); overflow: hidden; }
.st-bar i { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 55%, white)); transition: width .5s cubic-bezier(.2, .7, .3, 1); }
.st-bar i.idle { width: 0; }
.st-dur { font-family: var(--mono); font-weight: 700; font-size: 14px; color: var(--ink-2); min-width: 70px; text-align: right; display: inline-flex; justify-content: flex-end; align-items: center; }
.st-dur small { font-size: 11px; color: var(--ink-3); margin-left: 2px; }
.idle-hint { margin: 0; padding: 14px 0 6px; font-size: 13px; color: var(--ink-3); font-weight: 500; text-align: center; }

.mspin { width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, .5); border-top-color: #fff; border-radius: 50%; animation: sspin .7s linear infinite; }
.mspin.sm { width: 14px; height: 14px; border-color: var(--border-2); border-top-color: var(--accent); }
@keyframes sspin { to { transform: rotate(360deg); } }
</style>
