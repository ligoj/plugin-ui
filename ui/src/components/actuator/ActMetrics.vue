<!--
  ActMetrics — friendly renderer for the Actuator `metrics` endpoint.

  The `metrics` endpoint only lists meter NAMES; the actual values live at
  `metrics/<name>`. This renderer therefore takes a `fetch` prop (provided by
  ActuatorView) and pulls values ASYNCHRONOUSLY:
   - a top "Highlights" strip eagerly loads a curated set of key meters (memory,
     CPU, uptime, threads, disk…) and shows them as stat cards with progress
     bars where a ratio/max is available;
   - the full meter list is filterable; each meter lazily loads its value when
     expanded, rendered with unit-aware formatting (bytes → KB/MB/GB, seconds →
     duration/ms, percent → %), its measurements as tiles and its tags as chips.

  Presentational beyond the injected `fetch`/`copy`: no @ligoj/host import, no
  router. Robust to missing/variant shapes. See ActHealth.vue for the contract.
-->
<template>
  <div class="act-metrics">
    <v-alert v-if="!names.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <!-- Highlights -->
      <div v-if="highlightCards.length" class="hl-grid">
        <div v-for="h in highlightCards" :key="h.name" class="hl-card" :style="{ '--c': h.color }">
          <div class="hl-top"><span class="hl-ic"><v-icon size="20">{{ h.icon }}</v-icon></span><span class="hl-label">{{ h.label }}</span></div>
          <div class="hl-val">{{ h.display }}<small v-if="h.sub"> {{ h.sub }}</small></div>
          <div v-if="h.pct != null" class="hl-bar"><i :style="{ width: h.pct + '%' }" /></div>
        </div>
      </div>

      <div class="mt-head">
        <v-chip color="primary" variant="tonal" size="small" label>
          <v-icon start size="small">mdi-chart-line</v-icon>{{ names.length }} metric{{ names.length === 1 ? '' : 's' }}
        </v-chip>
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter metrics"
          density="compact" variant="outlined" hide-details clearable style="max-width:340px" />
      </div>

      <v-alert v-if="!filtered.length" type="info" variant="tonal" density="compact">No matching metric.</v-alert>

      <v-expansion-panels v-else v-model="openPanels" multiple variant="accordion">
        <v-expansion-panel v-for="name in filtered" :key="name" :value="name">
          <v-expansion-panel-title>
            <div class="pt mt-pt">
              <span class="mono cc-txt">{{ name }}</span>
              <button class="cc-copy" title="Copy metric name" @click.stop="copy && copy(name)"><v-icon size="13">mdi-content-copy</v-icon></button>
              <template v-if="values[name] && values[name].data">
                <!-- Tags as a chip list -->
                <span v-if="values[name].tags.length" class="mt-tags">
                  <v-chip v-for="tg in values[name].tags" :key="tg" size="x-small" variant="tonal" label class="mt-tag">{{ tg }}</v-chip>
                </span>
                <!-- Value rendered by metric type: progress / number+unit / multi-stat -->
                <span class="mt-val" :class="'is-' + values[name].disp.kind">
                  <template v-if="values[name].disp.kind === 'progress'">
                    <span class="mt-bar"><i :style="{ width: values[name].disp.pct + '%' }" /></span>
                    <span class="mt-num">{{ values[name].disp.text }}</span>
                  </template>
                  <template v-else-if="values[name].disp.kind === 'multi'">
                    <v-chip v-for="m in values[name].disp.items" :key="m.statistic" size="x-small" variant="flat" label class="mt-mchip"><span class="mt-mstat">{{ m.statistic }}</span>{{ m.display }}</v-chip>
                  </template>
                  <span v-else class="mt-num">{{ values[name].disp.text }}</span>
                </span>
              </template>
              <span v-else-if="values[name] && values[name].loading" class="mt-mini-spin" />
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="values[name]?.loading" class="mt-load"><span class="mspin" /></div>
            <v-alert v-else-if="values[name]?.error" type="warning" variant="tonal" density="compact">Unable to load this metric.</v-alert>
            <template v-else-if="values[name]?.data">
              <p v-if="values[name].data.description" class="mt-desc">{{ values[name].data.description }}</p>
              <div class="meas">
                <div v-for="m in measurements(values[name].data)" :key="m.statistic" class="meas-row">
                  <span class="meas-stat">{{ m.statistic }}</span>
                  <span class="meas-val mono">{{ m.display }}<small v-if="m.unit"> {{ m.unit }}</small></span>
                </div>
                <div v-if="!measurements(values[name].data).length" class="text-disabled">No measurements.</div>
              </div>
              <div v-if="tagList(values[name].data).length" class="tags">
                <span class="tags-lbl">Tags</span>
                <v-chip v-for="tg in tagList(values[name].data)" :key="tg" size="x-small" variant="tonal" label class="mono">{{ tg }}</v-chip>
              </div>
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const props = defineProps({
  data: { type: [Object, Array, String], default: null },
  copy: { type: Function, default: null },
  fetch: { type: Function, default: null },
})

const q = ref('')
const openPanels = ref([])
const values = reactive({})
const highlightCards = ref([])

const names = computed(() => {
  const raw = Array.isArray(props.data) ? props.data : props.data?.names
  if (!Array.isArray(raw)) return []
  return raw.filter((n) => typeof n === 'string').slice().sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? names.value.filter((n) => n.toLowerCase().includes(needle)) : names.value
})

async function loadMetric(name) {
  if (!props.fetch) { values[name] = { error: true }; return }
  if (values[name]?.loading || values[name]?.data) return // idempotent
  values[name] = { loading: true }
  try {
    const d = await props.fetch(`metrics/${encodeURIComponent(name)}`)
    values[name] = d && typeof d === 'object'
      ? { data: d, disp: titleDisplay(d), tags: titleTags(d) }
      : { error: true }
  } catch {
    values[name] = { error: true }
  }
}

// Eagerly load values for every visible meter (so each panel TITLE can show its
// value + tags), batched to avoid firing a hundred requests at once. A token
// guards against a stale run when the filter changes mid-load.
let loadToken = 0
async function loadVisible() {
  const token = ++loadToken
  const pending = filtered.value.filter((n) => !(n in values))
  const CONCURRENCY = 8
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    if (token !== loadToken) return
    await Promise.all(pending.slice(i, i + CONCURRENCY).map(loadMetric))
  }
}
watch(filtered, loadVisible)

// ---- formatting helpers --------------------------------------------------
function humanBytes(n) {
  if (n == null || isNaN(n)) return '—'
  const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let i = 0; let v = Number(n)
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${i === 0 ? v : v.toFixed(1)} ${u[i]}`
}
function humanNumber(n) {
  if (n == null || isNaN(n)) return '—'
  const v = Number(n)
  return Number.isInteger(v) ? v.toLocaleString() : v.toLocaleString(undefined, { maximumFractionDigits: 3 })
}
function humanDuration(sec) {
  if (sec == null || isNaN(sec)) return '—'
  let s = Math.floor(Number(sec))
  const d = Math.floor(s / 86400); s %= 86400
  const h = Math.floor(s / 3600); s %= 3600
  const m = Math.floor(s / 60); s %= 60
  const parts = []
  if (d) parts.push(`${d}d`)
  if (h || d) parts.push(`${h}h`)
  if (m || h || d) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.slice(0, 3).join(' ')
}
function fmtByUnit(value, unit) {
  if (value == null || isNaN(value)) return '—'
  const u = String(unit || '').toLowerCase()
  if (u === 'bytes') return humanBytes(value)
  if (u === 'seconds') return Number(value) >= 1 ? humanDuration(value) : `${(Number(value) * 1000).toFixed(1)} ms`
  if (u === 'percent') return `${(Number(value) * 100).toFixed(1)}%`
  return humanNumber(value)
}

function measurements(d) {
  const ms = d?.measurements
  if (!Array.isArray(ms)) return []
  const unit = ['bytes', 'seconds', 'percent'].includes(String(d?.baseUnit || '').toLowerCase()) ? '' : (d?.baseUnit || '')
  return ms.map((m) => ({ statistic: m?.statistic ?? '?', display: fmtByUnit(m?.value, d?.baseUnit), unit }))
}
function tagList(d) {
  const tags = d?.availableTags
  if (!Array.isArray(tags)) return []
  return tags.map((t) => {
    const vals = Array.isArray(t?.values) ? t.values : []
    const shown = vals.slice(0, 4).join(', ')
    return `${t?.tag}=[${shown}${vals.length > 4 ? ', …' : ''}]`
  })
}

// ---- title display -------------------------------------------------------
// Tag NAMES as compact chips for the panel title (capped, with a "+N" overflow).
function titleTags(d) {
  const names = (Array.isArray(d?.availableTags) ? d.availableTags : []).map((t) => t?.tag).filter(Boolean)
  return names.length > 4 ? names.slice(0, 4).concat(`+${names.length - 4}`) : names
}

// Number + unit, keeping a non-special baseUnit as a suffix (e.g. "12 threads").
function fmtFull(d, value) {
  const u = String(d?.baseUnit || '').toLowerCase()
  if (['bytes', 'seconds', 'percent'].includes(u)) return fmtByUnit(value, d?.baseUnit)
  const num = humanNumber(value)
  return d?.baseUnit ? `${num} ${d.baseUnit}` : num
}

function shortStat(s) {
  return String(s || '').replace('TOTAL_TIME', 'TOTAL').replace('ACTIVE_TASKS', 'ACTIVE').replace(/_/g, ' ')
}

// Pick the right title widget for a meter: a progress bar for ratios, a single
// number+unit for a lone measurement, or a chip per statistic for multi-value
// meters (timers/ranges).
function titleDisplay(d) {
  const ms = Array.isArray(d?.measurements) ? d.measurements : []
  if (!ms.length) return { kind: 'value', text: '—' }
  const unit = String(d?.baseUnit || '').toLowerCase()
  const nm = String(d?.name || '')
  const primary = ms.find((m) => m.statistic === 'VALUE') || ms.find((m) => m.statistic === 'COUNT') || ms[0]
  const percentLike = unit === 'percent' || /usage|utilization/i.test(nm)
  if (ms.length === 1 && percentLike && primary?.value != null) {
    const ratio = Number(primary.value)
    return { kind: 'progress', pct: Math.max(0, Math.min(100, Math.round(ratio * 100))), text: `${(ratio * 100).toFixed(1)}%` }
  }
  if (ms.length === 1) return { kind: 'value', text: fmtFull(d, primary?.value) }
  return { kind: 'multi', items: ms.map((m) => ({ statistic: shortStat(m?.statistic), display: fmtByUnit(m?.value, d?.baseUnit) })) }
}

// ---- highlights ----------------------------------------------------------
const HL = [
  { name: 'jvm.memory.used', max: 'jvm.memory.max', label: 'JVM memory', icon: 'mdi-memory', color: '#2f6df6', kind: 'bytesBar' },
  { name: 'system.cpu.usage', label: 'System CPU', icon: 'mdi-cpu-64-bit', color: '#d9701a', kind: 'percent' },
  { name: 'process.cpu.usage', label: 'Process CPU', icon: 'mdi-chip', color: '#8b5cf6', kind: 'percent' },
  { name: 'process.uptime', label: 'Uptime', icon: 'mdi-timer-outline', color: '#1d9d63', kind: 'duration' },
  { name: 'jvm.threads.live', label: 'Live threads', icon: 'mdi-sitemap-outline', color: '#0891b2', kind: 'number' },
  { name: 'disk.free', total: 'disk.total', label: 'Disk usage', icon: 'mdi-harddisk', color: '#64748b', kind: 'diskBar' },
]

function primaryValue(d) {
  const ms = d?.measurements
  if (!Array.isArray(ms) || !ms.length) return null
  const v = ms.find((m) => m.statistic === 'VALUE') || ms.find((m) => m.statistic === 'COUNT') || ms[0]
  return v?.value
}

async function loadHighlights() {
  if (!props.fetch) return
  const set = new Set(names.value)
  const present = HL.filter((h) => set.has(h.name))
  const cards = await Promise.all(present.map(async (h) => {
    try {
      const d = await props.fetch(`metrics/${encodeURIComponent(h.name)}`)
      const val = primaryValue(d)
      if (val == null) return null
      const card = { name: h.name, label: h.label, icon: h.icon, color: h.color }
      if (h.kind === 'bytesBar') {
        let max = null
        if (h.max && set.has(h.max)) max = primaryValue(await props.fetch(`metrics/${encodeURIComponent(h.max)}`))
        card.display = humanBytes(val)
        card.sub = max ? `/ ${humanBytes(max)}` : ''
        card.pct = max && max > 0 ? Math.min(100, Math.round((val / max) * 100)) : null
      } else if (h.kind === 'diskBar') {
        // `disk.free` is free space; usage = (total - free) / total.
        let total = null
        if (h.total && set.has(h.total)) total = primaryValue(await props.fetch(`metrics/${encodeURIComponent(h.total)}`))
        const used = total != null ? total - val : null
        card.display = humanBytes(used != null ? used : val)
        card.sub = total ? `/ ${humanBytes(total)} used` : 'free'
        card.pct = total && total > 0 ? Math.max(0, Math.min(100, Math.round(((total - val) / total) * 100))) : null
      } else if (h.kind === 'percent') {
        card.display = `${(val * 100).toFixed(1)}%`
        card.pct = Math.max(0, Math.min(100, Math.round(val * 100)))
      } else if (h.kind === 'duration') {
        card.display = humanDuration(val)
      } else if (h.kind === 'bytes') {
        card.display = humanBytes(val)
      } else {
        card.display = humanNumber(val)
      }
      return card
    } catch {
      return null
    }
  }))
  highlightCards.value = cards.filter(Boolean)
}

onMounted(() => { loadHighlights(); loadVisible() })
</script>

<style scoped>
.mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }

/* Highlights */
.hl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 18px; }
.hl-card { border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); padding: 12px 14px; background: var(--surface); box-shadow: var(--shadow); }
.hl-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.hl-ic { width: 30px; height: 30px; border-radius: var(--radius-sm); display: grid; place-items: center; background: color-mix(in srgb, var(--c, #2f6df6) 16%, transparent); color: var(--c, #2f6df6); }
.hl-label { font-size: 12px; font-weight: 600; color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
.hl-val { font-family: var(--font); font-weight: var(--bold, 800); font-size: 22px; color: var(--ink); line-height: 1.1; }
.hl-val small { font-size: 12px; font-weight: 500; color: var(--ink-3, rgba(var(--v-theme-on-surface), .5)); }
.hl-bar { margin-top: 8px; height: 6px; border-radius: 999px; background: var(--pill); overflow: hidden; }
.hl-bar i { display: block; height: 100%; border-radius: 999px; background: var(--c, #2f6df6); transition: width .4s; }

.mt-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }

/* Meter detail */
.mt-load { display: flex; justify-content: center; padding: 16px; }
.mspin { width: 22px; height: 22px; border: 3px solid var(--pill); border-top-color: rgb(var(--v-theme-primary)); border-radius: 50%; animation: mt-spin .7s linear infinite; }
@keyframes mt-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .mspin { animation: none; } }
.mt-desc { margin: 0 0 10px; font-size: 12.5px; color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
/* Compact rows: statistic on the left, value + unit inlined on the right. */
.meas { display: flex; flex-direction: column; gap: 0; }
.meas-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 7px 0; }
.meas-row + .meas-row { border-top: var(--border-w) var(--lj-border-style, solid) var(--border-c); }
.meas-stat { font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-3, rgba(var(--v-theme-on-surface), .5)); }
.meas-val { font-weight: 700; font-size: 15px; color: var(--ink); text-align: right; }
.meas-val small { font-size: 11px; font-weight: 500; color: var(--ink-3); }
.tags { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.tags-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-3, rgba(var(--v-theme-on-surface), .5)); margin-right: 4px; }

/* Panel title: value widget + tag chips pushed to the right (name flex-grows). */
.mt-pt { gap: 8px; }
.mt-tags { display: inline-flex; flex: none; align-items: center; gap: 4px; }
.mt-tag { opacity: .85; }
.mt-val { display: inline-flex; flex: none; align-items: center; gap: 8px; margin-left: 4px; }
.mt-num { font-family: var(--mono, ui-monospace, monospace); font-weight: 700; font-size: 13px; color: var(--ink); white-space: nowrap; }
.mt-bar { width: 72px; height: 6px; flex: none; border-radius: 999px; background: var(--pill); overflow: hidden; }
.mt-bar i { display: block; height: 100%; border-radius: 999px; background: rgb(var(--v-theme-primary)); }
.mt-mchip { font-family: var(--mono, ui-monospace, monospace); font-weight: 700; }
.mt-mstat { opacity: .55; margin-right: 4px; font-size: 9.5px; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; }
.mt-mini-spin { width: 14px; height: 14px; flex: none; margin-left: auto; border: 2px solid var(--pill); border-top-color: rgb(var(--v-theme-primary)); border-radius: 50%; animation: mt-spin .7s linear infinite; }
@media (max-width: 720px) { .mt-tags { display: none; } }
</style>
