<!--
  ActCaches — friendly renderer for the Actuator `caches` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router. Robust to
  missing / variant shapes (Spring versions differ) via optional chaining,
  with a graceful empty state. The shell (ActuatorView) owns the title,
  refresh, raw-JSON toggle and JSON download — this only draws the friendly
  view. See ActHealth.vue for the full renderer contract.
-->
<template>
  <div class="act-caches">
    <v-alert v-if="!caches.length && !q" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter…"
        density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />
      <v-table density="compact" class="act-tbl">
        <thead><tr><th>Cache</th><th>Cache manager</th><th>Target</th></tr></thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.key">
            <td class="mono">{{ c.name }}</td>
            <td>{{ c.manager }}</td>
            <td class="mono target"><span v-if="c.target">{{ c.target }}</span><span v-else class="text-disabled">—</span></td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="3" class="text-disabled pa-3">No matching cache.</td></tr>
        </tbody>
      </v-table>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

const q = ref('')

const caches = computed(() => {
  const managers = props.data?.cacheManagers
  if (!managers || typeof managers !== 'object') return []
  const out = []
  for (const [manager, mv] of Object.entries(managers)) {
    const entries = mv?.caches
    if (!entries || typeof entries !== 'object') continue
    for (const [name, cv] of Object.entries(entries)) {
      out.push({ key: `${manager}::${name}`, name, manager, target: cv?.target ?? '' })
    }
  }
  return out
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return caches.value
  return caches.value.filter((c) =>
    c.name.toLowerCase().includes(needle) ||
    c.manager.toLowerCase().includes(needle) ||
    String(c.target).toLowerCase().includes(needle))
})
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.act-tbl .target { max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
</style>
