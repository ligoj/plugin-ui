<!--
  ActEnv — friendly renderer for the Actuator `env` endpoint.

  Presentational only (see ActHealth.vue for the full contract): receives the
  already-fetched, parsed payload as the `data` prop. NO API calls, NO
  @ligoj/host imports, NO router. Robust to missing / variant shapes across
  Spring versions (optional chaining everywhere), with a graceful empty state.
  The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
  download — this renderer only draws the friendly view.
-->
<template>
  <div class="act-env">
    <v-alert v-if="!sources.length && !profiles.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <div v-if="profiles.length" class="mb-4">
        <span class="lbl mr-2">Active profiles</span>
        <v-chip v-for="p in profiles" :key="p" color="primary" variant="tonal" size="small" label class="mr-1 mb-1">{{ p }}</v-chip>
      </div>

      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter keys"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />

      <v-expansion-panels v-if="filteredSources.length" v-model="openModel" multiple variant="accordion">
        <v-expansion-panel v-for="s in filteredSources" :key="s.name" :value="s.name">
          <v-expansion-panel-title>
            <div class="pt">
              <span class="mono cc-txt">{{ s.name }}</span>
              <v-chip size="x-small" color="primary" variant="tonal" label class="pt-count">{{ s.properties.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table density="compact" class="act-tbl">
              <thead><tr><th class="col-key">Key</th><th>Value</th><th class="col-origin">Origin</th></tr></thead>
              <tbody>
                <tr v-for="p in s.properties" :key="p.key">
                  <td><div class="cc"><span class="cc-txt mono">{{ p.key }}</span><button class="cc-copy" title="Copy key" @click="copy && copy(p.key)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
                  <td>
                    <span v-if="p.sensitive" class="masked" title="Hidden (sensitive name)">••••••••</span>
                    <div v-else-if="p.value !== ''" class="cc"><code class="cc-txt val">{{ p.value }}</code><button class="cc-copy" title="Copy value" @click="copy && copy(p.value)"><v-icon size="13">mdi-content-copy</v-icon></button></div>
                    <span v-else class="text-disabled">—</span>
                  </td>
                  <td><span v-if="p.origin" class="origin">{{ p.origin }}</span><span v-else class="text-disabled">—</span></td>
                </tr>
                <tr v-if="!s.properties.length"><td colspan="3" class="text-disabled pa-3">No properties.</td></tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-alert v-else type="info" variant="tonal" density="compact">No matching property.</v-alert>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: [Object, Array, String], default: null },
  copy: { type: Function, default: null },
})

// Property names matching these are masked in the UI regardless of the backend.
const SENSITIVE = /secret|key|password/i

const q = ref('')
const open = ref([])

const profiles = computed(() => {
  const p = props.data?.activeProfiles
  return Array.isArray(p) ? p : []
})

const sources = computed(() => {
  const list = props.data?.propertySources
  if (!Array.isArray(list)) return []
  return list.map((src) => {
    const props2 = src?.properties && typeof src.properties === 'object' ? src.properties : {}
    const properties = Object.entries(props2).map(([key, v]) => ({
      key,
      value: stringify(v?.value !== undefined ? v.value : v),
      origin: v?.origin ?? '',
      sensitive: SENSITIVE.test(key),
    }))
    return { name: src?.name ?? '(unnamed)', properties }
  })
})

const filteredSources = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return sources.value
  return sources.value
    .map((s) => ({ ...s, properties: s.properties.filter((p) => p.key.toLowerCase().includes(needle)) }))
    .filter((s) => s.properties.length)
})

// Auto-open panels that contain matches while filtering, keep manual state otherwise.
const openModel = computed({
  get: () => (q.value.trim() ? filteredSources.value.map((s) => s.name) : open.value),
  set: (v) => { open.value = v },
})

function stringify(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch { return String(v) }
  }
  return String(v)
}
</script>

<style scoped>
.act-tbl .mono, .val, .origin { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.origin { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
.lbl { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); font-size: 13px; }
.masked { font-family: var(--mono, ui-monospace, monospace); letter-spacing: 2px; color: var(--ink-3, rgba(var(--v-theme-on-surface), .5)); }
.col-key { width: 34%; }
.col-origin { width: 24%; }
</style>
