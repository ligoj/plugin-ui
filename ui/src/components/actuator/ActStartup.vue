<!--
  ActStartup — friendly renderer for the Actuator `startup` endpoint.

  Presentational only (see ActHealth.vue for the full contract): receives the
  already-fetched, parsed payload as the `data` prop. NO API calls, NO
  @ligoj/host imports, NO router. Robust to missing / variant shapes across
  Spring versions: optional chaining everywhere and a graceful empty state.
  The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
  download — this renderer only draws the friendly view.
-->
<template>
  <div class="act-startup">
    <v-alert v-if="!events.length && !version" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <div class="meta mb-4">
        <v-chip v-if="version" color="primary" variant="tonal" size="small" label class="mr-2">
          <v-icon start size="small">mdi-spring</v-icon>Spring Boot {{ version }}
        </v-chip>
        <v-chip color="grey" variant="tonal" size="small" label>
          <v-icon start size="small">mdi-timeline-clock-outline</v-icon>{{ events.length }} step{{ events.length === 1 ? '' : 's' }}
        </v-chip>
      </div>

      <template v-if="events.length">
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter steps"
          density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />
        <v-table density="compact" class="act-tbl">
          <thead><tr><th>Step name</th><th class="dur-col">Duration</th></tr></thead>
          <tbody>
            <tr v-for="e in filtered" :key="e.key">
              <td class="mono">{{ e.name }}</td>
              <td class="dur-col mono">{{ formatMs(e.ms) }}</td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="2" class="text-disabled pa-3">No matching step.</td></tr>
          </tbody>
        </v-table>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

const q = ref('')

const version = computed(() => props.data?.springBootVersion ?? '')

const events = computed(() => {
  const raw = props.data?.timeline?.events
  if (!Array.isArray(raw)) return []
  return raw.map((e, i) => ({
    key: e?.startupStep?.id ?? i,
    name: e?.startupStep?.name ?? '—',
    ms: durationToMs(e?.duration),
  })).sort((a, b) => b.ms - a.ms)
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? events.value.filter((e) => String(e.name).toLowerCase().includes(needle)) : events.value
})

// Parse an ISO-8601 duration (e.g. "PT0.123S", "PT1M2.5S") or a numeric value into milliseconds.
function durationToMs(d) {
  if (d == null) return 0
  if (typeof d === 'number') return Number.isFinite(d) ? d : 0
  const s = String(d)
  const m = /^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(s)
  if (m) {
    const h = parseFloat(m[1] || '0')
    const min = parseFloat(m[2] || '0')
    const sec = parseFloat(m[3] || '0')
    return (h * 3600 + min * 60 + sec) * 1000
  }
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

function formatMs(ms) {
  if (!Number.isFinite(ms)) return '—'
  if (ms >= 1000) return `${(ms / 1000).toFixed(3)} s`
  return `${ms.toFixed(ms < 1 ? 3 : 1)} ms`
}
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.dur-col { text-align: right; white-space: nowrap; color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
</style>
