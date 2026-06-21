<!--
  ActScheduledTasks — friendly renderer for the Actuator `scheduledtasks` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router. Robust to
  missing / variant shapes across Spring versions (optional chaining, graceful
  empty state). Built from globally-registered Vuetify components; the shell
  (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON download.

  One section per category present (Cron, Fixed delay, Fixed rate, Custom),
  each a compact table: Target (mono) plus the timing columns relevant to that
  category. See ActHealth.vue for the full renderer contract.
-->
<template>
  <div class="act-scheduled">
    <v-alert v-if="!hasAny" type="info" variant="tonal" density="compact">No scheduled tasks.</v-alert>
    <template v-else>
      <v-text-field v-if="totalCount > 6" v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter tasks"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />

      <section v-for="cat in sections" :key="cat.key" class="mb-5">
        <div class="cat-head mb-2">
          <v-icon size="small" class="mr-1">{{ cat.icon }}</v-icon>
          <span class="cat-title">{{ cat.label }}</span>
          <v-chip size="x-small" variant="tonal" label class="ml-2">{{ cat.rows.length }}</v-chip>
        </div>
        <v-table density="compact" class="act-tbl">
          <thead>
            <tr>
              <th>Target</th>
              <th v-for="col in cat.cols" :key="col.key">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in cat.rows" :key="cat.key + '-' + i">
              <td class="mono">{{ row.target }}</td>
              <td v-for="col in cat.cols" :key="col.key">
                <code v-if="row[col.key] != null && row[col.key] !== ''" class="val">{{ formatCell(col, row[col.key]) }}</code>
                <span v-else class="text-disabled">—</span>
              </td>
            </tr>
            <tr v-if="!cat.rows.length">
              <td :colspan="cat.cols.length + 1" class="text-disabled pa-3">No matching task.</td>
            </tr>
          </tbody>
        </v-table>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

const q = ref('')

const expressionCols = [{ key: 'expression', label: 'Expression' }]
const intervalCols = [
  { key: 'initialDelay', label: 'Initial delay (ms)', ms: true },
  { key: 'interval', label: 'Interval (ms)', ms: true },
]

const categories = [
  { key: 'cron', label: 'Cron', icon: 'mdi-calendar-clock', cols: expressionCols },
  { key: 'fixedDelay', label: 'Fixed delay', icon: 'mdi-timer-sand', cols: intervalCols },
  { key: 'fixedRate', label: 'Fixed rate', icon: 'mdi-timer-sync', cols: intervalCols },
  { key: 'custom', label: 'Custom', icon: 'mdi-cog-clock', cols: expressionCols },
]

function targetOf(task) {
  return task?.runnable?.target ?? task?.target ?? '—'
}

function rowsFor(cat) {
  const list = Array.isArray(props.data?.[cat.key]) ? props.data[cat.key] : []
  return list.map((task) => {
    const row = { target: targetOf(task) }
    for (const col of cat.cols) row[col.key] = task?.[col.key]
    return row
  })
}

const totalCount = computed(() =>
  categories.reduce((sum, cat) => sum + (Array.isArray(props.data?.[cat.key]) ? props.data[cat.key].length : 0), 0),
)

const sections = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return categories
    .map((cat) => {
      let rows = rowsFor(cat)
      if (needle) rows = rows.filter((r) => String(r.target).toLowerCase().includes(needle))
      return { ...cat, rows, total: rowsFor(cat).length }
    })
    .filter((cat) => cat.total > 0)
})

const hasAny = computed(() => totalCount.value > 0)

function formatCell(col, value) {
  if (col.ms && typeof value === 'number') return value.toLocaleString()
  return value
}
</script>

<style scoped>
.act-tbl .mono, .val { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.val { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); word-break: break-all; }
.cat-head { display: flex; align-items: center; }
.cat-title { font-weight: 600; }
</style>
