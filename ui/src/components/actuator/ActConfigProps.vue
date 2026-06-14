<!--
  ActConfigProps — friendly renderer for the Actuator `configprops` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router. Robust to
  missing / variant shapes across Spring versions (optional chaining
  everywhere) with a graceful empty state. The shell (ActuatorView) owns the
  title, refresh, raw-JSON toggle and JSON download — this renderer only draws
  the friendly view. See ActHealth.vue for the full contract.
-->
<template>
  <div class="act-configprops">
    <v-alert v-if="!beans.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter…"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />

      <v-alert v-if="!filtered.length" type="info" variant="tonal" density="compact">No matching configuration property.</v-alert>
      <v-expansion-panels v-else variant="accordion" multiple>
        <v-expansion-panel v-for="b in filtered" :key="b.key">
          <v-expansion-panel-title>
            <div class="pt">
              <span class="mono cc-txt">{{ b.title }}</span>
              <v-chip v-if="b.prefix && b.prefix !== b.title" size="x-small" variant="tonal" label class="mono">{{ b.prefix }}</v-chip>
              <v-chip size="x-small" color="primary" variant="tonal" label class="pt-count">{{ b.rows.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table v-if="b.rows.length" density="compact" class="act-tbl">
              <thead><tr><th class="col-key">Property</th><th>Value</th></tr></thead>
              <tbody>
                <tr v-for="r in b.rows" :key="r.key">
                  <td>
                    <div class="cc"><span class="cc-txt mono">{{ r.key }}</span><button class="cc-copy" title="Copy property" @click="copy && copy(r.key)"><v-icon size="13">mdi-content-copy</v-icon></button></div>
                  </td>
                  <td>
                    <div v-if="r.value !== ''" class="cc"><code class="cc-txt dets">{{ r.value }}</code><button class="cc-copy" title="Copy value" @click="copy && copy(r.value)"><v-icon size="13">mdi-content-copy</v-icon></button></div>
                    <span v-else class="text-disabled">—</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <span v-else class="text-disabled">No properties.</span>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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

function flatten(obj, prefix, out) {
  if (obj === null || obj === undefined) return out
  if (typeof obj !== 'object') {
    out.push({ key: prefix, value: String(obj) })
    return out
  }
  const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v]) : Object.entries(obj)
  if (!entries.length) {
    out.push({ key: prefix, value: Array.isArray(obj) ? '[]' : '{}' })
    return out
  }
  for (const [k, v] of entries) {
    const next = prefix ? `${prefix}.${k}` : k
    flatten(v, next, out)
  }
  return out
}

const beans = computed(() => {
  const contexts = props.data?.contexts
  if (!contexts || typeof contexts !== 'object') return []
  const result = []
  for (const [ctx, ctxVal] of Object.entries(contexts)) {
    const beanMap = ctxVal?.beans
    if (!beanMap || typeof beanMap !== 'object') continue
    for (const [beanName, bean] of Object.entries(beanMap)) {
      const prefix = bean?.prefix || ''
      const title = prefix || beanName
      const rows = flatten(bean?.properties, '', []).sort((a, b) => a.key.localeCompare(b.key))
      result.push({ key: `${ctx}::${beanName}`, beanName, prefix, title, rows })
    }
  }
  return result
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return beans.value
  return beans.value.filter((b) =>
    b.title.toLowerCase().includes(needle) ||
    b.beanName.toLowerCase().includes(needle) ||
    b.prefix.toLowerCase().includes(needle))
})
</script>

<style scoped>
.act-tbl .mono, .mono, .dets { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.dets { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
.col-key { width: 42%; }
</style>
