<!--
  ActThreadDump — friendly renderer for the Actuator `threaddump` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router.
  Robust to missing / variant shapes (Spring versions differ): optional
  chaining everywhere, and a graceful empty state when there's nothing to show.
  Built from globally-registered Vuetify components for a modern, consistent
  look — `density="compact"` on tables. The shell owns the title, refresh,
  raw-JSON toggle and JSON download — this renderer only draws the friendly view.
-->
<template>
  <div class="act-threaddump">
    <v-alert v-if="!threads.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <div class="mb-4 chips">
        <v-chip v-for="s in stateCounts" :key="s.state" :color="stateColor(s.state)" variant="tonal" size="small" label class="mr-2 mb-2">
          {{ s.state }}: {{ s.count }}
        </v-chip>
        <v-chip color="grey" variant="flat" size="small" label class="mb-2">Total: {{ threads.length }}</v-chip>
      </div>

      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter…"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />

      <v-table density="compact" class="act-tbl">
        <thead>
          <tr><th style="width:32px"></th><th>Name</th><th>State</th><th>Id</th><th>Priority</th></tr>
        </thead>
        <tbody>
          <template v-for="t in filtered" :key="t.threadId ?? t.threadName">
            <tr class="row-head" @click="toggle(t.key)">
              <td>
                <v-btn :icon="expanded.has(t.key) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                  size="x-small" variant="text" :disabled="!t.stackTrace.length" @click.stop="toggle(t.key)" />
              </td>
              <td class="mono">
                {{ t.threadName || '—' }}
                <v-chip v-if="t.daemon" size="x-small" color="grey" variant="tonal" label class="ml-2">daemon</v-chip>
              </td>
              <td><v-chip size="x-small" :color="stateColor(t.threadState)" variant="tonal" label>{{ t.threadState || '—' }}</v-chip></td>
              <td class="mono">{{ t.threadId ?? '—' }}</td>
              <td class="mono">{{ t.priority ?? '—' }}</td>
            </tr>
            <tr v-if="expanded.has(t.key) && t.stackTrace.length" :key="t.key + '-stack'" class="row-stack">
              <td></td>
              <td colspan="4"><pre class="stack">{{ t.stackTrace.join('\n') }}</pre></td>
            </tr>
          </template>
          <tr v-if="!filtered.length"><td colspan="5" class="text-disabled pa-3">No matching thread.</td></tr>
        </tbody>
      </v-table>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

const q = ref('')
const expanded = ref(new Set())

function toggle(key) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

function frameLabel(f) {
  if (typeof f === 'string') return f
  if (!f || typeof f !== 'object') return ''
  const where = `${f.className ?? ''}${f.methodName ? '.' + f.methodName : ''}`
  const line = f.lineNumber != null && f.lineNumber >= 0 ? `:${f.lineNumber}` : ''
  return `at ${where}${line}`.trim()
}

const threads = computed(() => {
  const list = Array.isArray(props.data) ? props.data : props.data?.threads
  if (!Array.isArray(list)) return []
  return list.map((t, i) => ({
    threadName: t?.threadName,
    threadId: t?.threadId,
    threadState: t?.threadState,
    priority: t?.priority,
    daemon: t?.daemon === true,
    stackTrace: Array.isArray(t?.stackTrace) ? t.stackTrace.map(frameLabel).filter(Boolean) : [],
    key: (t?.threadId ?? t?.threadName ?? '') + ':' + i,
  }))
})

const stateCounts = computed(() => {
  const counts = {}
  for (const t of threads.value) {
    const s = t.threadState || 'UNKNOWN'
    counts[s] = (counts[s] || 0) + 1
  }
  return Object.entries(counts).map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count)
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? threads.value.filter((t) => String(t.threadName || '').toLowerCase().includes(needle)) : threads.value
})

function stateColor(state) {
  switch (String(state || '').toUpperCase()) {
    case 'RUNNABLE': return 'success'
    case 'BLOCKED':
    case 'TIMED_WAITING':
    case 'WAITING': return 'warning'
    default: return 'grey'
  }
}
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.row-head { cursor: pointer; }
.stack {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 12px;
  color: var(--ink-2, rgba(var(--v-theme-on-surface), .7));
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: 6px 0;
}
</style>
