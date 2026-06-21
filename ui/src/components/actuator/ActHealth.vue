<!--
  ActHealth — friendly renderer for the Actuator `health` endpoint.

  REFERENCE COMPONENT / CONTRACT for every Act*.vue actuator renderer:
   - Presentational only: receives the already-fetched, parsed payload as the
     `data` prop. NO API calls, NO @ligoj/host imports, NO router.
   - Robust to missing / variant shapes (Spring versions differ): optional
     chaining everywhere, and a graceful empty state when there's nothing to show.
   - Built from globally-registered Vuetify components (v-table, v-chip,
     v-text-field, v-expansion-panels, v-alert, v-icon) for a modern, consistent
     look — `density="compact"` on tables. Add a filter input for long lists.
   - The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
     download — renderers only draw the friendly view.
   - Labels are plain English technical terms (admin/debug surface); CSS reads
     the `.lj-surface` tokens (var(--ink), var(--pill)…) that cascade from the view.
-->
<template>
  <div class="act-health">
    <v-alert v-if="!data || typeof data !== 'object'" type="info" variant="tonal" density="compact">No health data.</v-alert>
    <template v-else>
      <v-chip :color="statusColor(data.status)" variant="flat" size="large" label class="mb-4">
        <v-icon start>{{ statusIcon(data.status) }}</v-icon>{{ data.status || 'UNKNOWN' }}
      </v-chip>

      <template v-if="components.length">
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter components"
          density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />
        <v-table density="compact" class="act-tbl">
          <thead><tr><th>Component</th><th>Status</th><th>Details</th></tr></thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.name">
              <td class="mono">{{ c.name }}</td>
              <td><v-chip size="x-small" :color="statusColor(c.status)" variant="tonal" label>{{ c.status }}</v-chip></td>
              <td><code v-if="c.details" class="dets">{{ c.details }}</code><span v-else class="text-disabled">—</span></td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="3" class="text-disabled pa-3">No matching component.</td></tr>
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

const components = computed(() => {
  const c = props.data?.components || props.data?.details
  if (!c || typeof c !== 'object') return []
  return Object.entries(c).map(([name, v]) => ({
    name,
    status: v?.status ?? '—',
    details: v?.details ? JSON.stringify(v.details) : '',
  }))
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return needle ? components.value.filter((c) => c.name.toLowerCase().includes(needle)) : components.value
})

function statusColor(status) {
  switch (String(status || '').toUpperCase()) {
    case 'UP': return 'success'
    case 'DOWN': return 'error'
    case 'OUT_OF_SERVICE': return 'warning'
    default: return 'grey'
  }
}
function statusIcon(status) {
  switch (String(status || '').toUpperCase()) {
    case 'UP': return 'mdi-check-circle'
    case 'DOWN': return 'mdi-alert-circle'
    case 'OUT_OF_SERVICE': return 'mdi-pause-circle'
    default: return 'mdi-help-circle'
  }
}
</script>

<style scoped>
.act-tbl .mono, .dets { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.dets { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); word-break: break-all; }
</style>
