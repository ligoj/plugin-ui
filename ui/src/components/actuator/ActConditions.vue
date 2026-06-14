<!--
  ActConditions — friendly renderer for the Actuator `conditions` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router. Robust to
  missing / variant shapes across Spring versions (optional chaining
  everywhere), with a graceful empty state when there's nothing to show. The
  shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
  download — this renderer only draws the friendly view.

  Shape (best-effort): data = { contexts: { ctx: {
    positiveMatches: { name: [ { condition, message } ] },
    negativeMatches: { name: { notMatched: [ { condition, message } ], matched: [] } },
    unconditionalClasses?: [ ... ] } } }
-->
<template>
  <div class="act-conditions">
    <v-alert v-if="!positive.length && !negative.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter conditions"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />

      <v-tabs v-model="tab" density="compact" class="mb-3">
        <v-tab value="positive">
          <v-icon start size="small">mdi-check-circle</v-icon>Positive ({{ filteredPositive.length }})
        </v-tab>
        <v-tab value="negative">
          <v-icon start size="small">mdi-close-circle</v-icon>Negative ({{ filteredNegative.length }})
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="positive">
          <v-table density="compact" class="act-tbl">
            <thead><tr><th class="col-name">Bean / class</th><th class="col-cond">Condition</th><th>Message</th><th v-if="multiCtx" class="col-ctx">Context</th></tr></thead>
            <tbody>
              <tr v-for="(r, i) in filteredPositive" :key="`p-${r.ctx}-${r.name}-${i}`">
                <td><div class="cc"><span class="cc-txt mono">{{ r.name }}</span><button class="cc-copy" title="Copy bean / class" @click="copy && copy(r.name)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
                <td class="mono">{{ r.condition || '—' }}</td>
                <td><span v-if="r.message" class="msg">{{ r.message }}</span><span v-else class="text-disabled">—</span></td>
                <td v-if="multiCtx" class="mono text-disabled">{{ r.ctx }}</td>
              </tr>
              <tr v-if="!filteredPositive.length"><td :colspan="multiCtx ? 4 : 3" class="text-disabled pa-3">No matching condition.</td></tr>
            </tbody>
          </v-table>
        </v-window-item>

        <v-window-item value="negative">
          <v-table density="compact" class="act-tbl">
            <thead><tr><th class="col-name">Bean / class</th><th class="col-cond">Condition</th><th>Message</th><th v-if="multiCtx" class="col-ctx">Context</th></tr></thead>
            <tbody>
              <tr v-for="(r, i) in filteredNegative" :key="`n-${r.ctx}-${r.name}-${i}`">
                <td><div class="cc"><span class="cc-txt mono">{{ r.name }}</span><button class="cc-copy" title="Copy bean / class" @click="copy && copy(r.name)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
                <td class="mono">{{ r.condition || '—' }}</td>
                <td><span v-if="r.message" class="msg">{{ r.message }}</span><span v-else class="text-disabled">—</span></td>
                <td v-if="multiCtx" class="mono text-disabled">{{ r.ctx }}</td>
              </tr>
              <tr v-if="!filteredNegative.length"><td :colspan="multiCtx ? 4 : 3" class="text-disabled pa-3">No matching condition.</td></tr>
            </tbody>
          </v-table>
        </v-window-item>
      </v-window>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: [Object, Array, String], default: null },
  copy: { type: Function, default: null },
})

const q = ref('')
const tab = ref('positive')

const contexts = computed(() => {
  const c = props.data?.contexts
  if (!c || typeof c !== 'object') return []
  return Object.entries(c).map(([ctx, v]) => ({ ctx, ctxData: v }))
})

const multiCtx = computed(() => contexts.value.length > 1)

const positive = computed(() => {
  const rows = []
  for (const { ctx, ctxData } of contexts.value) {
    const matches = ctxData?.positiveMatches
    if (!matches || typeof matches !== 'object') continue
    for (const [name, list] of Object.entries(matches)) {
      const items = Array.isArray(list) ? list : [list]
      for (const it of items) {
        rows.push({ ctx, name, condition: it?.condition ?? '', message: it?.message ?? '' })
      }
    }
  }
  return rows
})

const negative = computed(() => {
  const rows = []
  for (const { ctx, ctxData } of contexts.value) {
    const matches = ctxData?.negativeMatches
    if (!matches || typeof matches !== 'object') continue
    for (const [name, v] of Object.entries(matches)) {
      const items = Array.isArray(v?.notMatched) ? v.notMatched
        : Array.isArray(v) ? v
        : v ? [v] : []
      if (!items.length) {
        rows.push({ ctx, name, condition: '', message: '' })
        continue
      }
      for (const it of items) {
        rows.push({ ctx, name, condition: it?.condition ?? '', message: it?.message ?? '' })
      }
    }
  }
  return rows
})

function match(r, needle) {
  return r.name?.toLowerCase().includes(needle)
    || r.condition?.toLowerCase().includes(needle)
    || r.message?.toLowerCase().includes(needle)
    || r.ctx?.toLowerCase().includes(needle)
}

const filteredPositive = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? positive.value.filter((r) => match(r, needle)) : positive.value
})

const filteredNegative = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? negative.value.filter((r) => match(r, needle)) : negative.value
})
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.msg { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); font-size: 12.5px; }
.col-name { width: 300px; }
.col-cond { width: 220px; }
.col-ctx { width: 140px; }
</style>
