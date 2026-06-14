<!--
  ActBeans — friendly renderer for the Actuator `beans` endpoint.

  Presentational only (see ActHealth.vue for the full contract): receives the
  already-fetched, parsed payload as the `data` prop. NO API calls, NO
  @ligoj/host imports, NO router. Robust to missing / variant shapes across
  Spring versions via optional chaining, with a graceful empty state.

  Flattens every bean across all application contexts into one compact table:
  Bean (mono), Scope (chip), Type (mono, truncated) and a Dependencies count
  chip whose tooltip lists the wired dependencies. Sorted by bean name.
-->
<template>
  <div class="act-beans">
    <v-alert v-if="!beans.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter beans"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />
      <v-table density="compact" class="act-tbl">
        <thead>
          <tr>
            <th class="col-bean">Bean</th>
            <th class="col-scope">Scope</th>
            <th>Type</th>
            <th class="col-deps">Dependencies</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filtered" :key="b.key">
            <td><div class="cc"><span class="cc-txt mono">{{ b.name }}</span><button class="cc-copy" title="Copy bean" @click="copy && copy(b.name)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
            <td><v-chip size="x-small" :color="scopeColor(b.scope)" variant="tonal" label>{{ b.scope }}</v-chip></td>
            <td><div class="cc"><span class="cc-txt mono type" :title="b.type">{{ b.type }}</span><button class="cc-copy" title="Copy type" @click="copy && copy(b.type)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
            <td>
              <template v-if="b.dependencies.length">
                <v-tooltip location="top">
                  <template #activator="{ props: tip }">
                    <v-chip v-bind="tip" size="x-small" color="primary" variant="tonal" label>{{ b.dependencies.length }}</v-chip>
                  </template>
                  <ul class="dep-list">
                    <li v-for="(d, i) in b.dependencies" :key="i">{{ d }}</li>
                  </ul>
                </v-tooltip>
              </template>
              <span v-else class="text-disabled">—</span>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="4" class="text-disabled pa-3">No matching bean.</td></tr>
        </tbody>
      </v-table>
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

const beans = computed(() => {
  const contexts = props.data?.contexts
  if (!contexts || typeof contexts !== 'object') return []
  const out = []
  for (const [ctxName, ctx] of Object.entries(contexts)) {
    const ctxBeans = ctx?.beans
    if (!ctxBeans || typeof ctxBeans !== 'object') continue
    for (const [name, b] of Object.entries(ctxBeans)) {
      const deps = Array.isArray(b?.dependencies) ? b.dependencies.filter((d) => d != null).map(String) : []
      out.push({
        key: `${ctxName}/${name}`,
        name,
        scope: b?.scope || 'singleton',
        type: b?.type || '—',
        dependencies: deps,
      })
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return beans.value
  return beans.value.filter((b) =>
    b.name.toLowerCase().includes(needle) || b.type.toLowerCase().includes(needle))
})

function scopeColor(scope) {
  switch (String(scope || '').toLowerCase()) {
    case 'singleton': return 'success'
    case 'prototype': return 'info'
    case 'request': return 'warning'
    case 'session': return 'primary'
    default: return 'grey'
  }
}
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.act-tbl .type { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
.col-bean { width: 34%; }
.col-scope { width: 110px; }
.col-deps { width: 130px; }
.dep-list { margin: 0; padding-left: 16px; max-height: 320px; overflow: auto; font-family: var(--mono, ui-monospace, monospace); font-size: 12px; }
</style>
