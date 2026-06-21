<!--
  ActMappings — friendly renderer for the Actuator `mappings` endpoint.

  Follows the Act*.vue CONTRACT (see ActHealth.vue):
   - Presentational only: receives the already-fetched, parsed payload as the
     `data` prop. NO API calls, NO @ligoj/host imports, NO router.
   - Robust to missing / variant shapes (Spring versions differ): optional
     chaining everywhere, and a graceful empty state when there's nothing to show.
   - Built from globally-registered Vuetify components for a modern, consistent
     look — `density="compact"` on tables. Filter input for the long route list.
   - The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
     download — renderers only draw the friendly view.
   - Labels are plain English technical terms (admin/debug surface); CSS reads
     the `.lj-surface` tokens (var(--mono), var(--ink-2)) that cascade from the view.
-->
<template>
  <div class="act-mappings">
    <v-alert v-if="!routes.length && !filters.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <template v-if="routes.length">
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter routes"
          density="compact" variant="outlined" hide-details clearable class="mb-3" style="max-width:340px" />
        <v-table density="compact" class="act-tbl">
          <thead><tr><th>Methods</th><th>Path</th><th>Handler</th></tr></thead>
          <tbody>
            <tr v-for="r in filteredRoutes" :key="r.key">
              <td>
                <template v-if="r.methods.length">
                  <v-chip v-for="m in r.methods" :key="m" size="x-small" :color="methodColor(m)" variant="tonal" label class="mr-1 mb-1">{{ m }}</v-chip>
                </template>
                <v-chip v-else size="x-small" color="grey" variant="tonal" label>ALL</v-chip>
              </td>
              <td class="mono path">{{ r.path }}</td>
              <td class="mono handler" :title="r.handler">{{ r.handler }}</td>
            </tr>
            <tr v-if="!filteredRoutes.length"><td colspan="3" class="text-disabled pa-3">No matching route.</td></tr>
          </tbody>
        </v-table>
      </template>

      <template v-if="filters.length">
        <h3 class="section-title">Servlet filters</h3>
        <v-table density="compact" class="act-tbl">
          <thead><tr><th>Name</th><th>Class</th></tr></thead>
          <tbody>
            <tr v-for="f in filters" :key="f.key">
              <td>{{ f.name }}</td>
              <td class="mono handler" :title="f.className">{{ f.className }}</td>
            </tr>
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

const contexts = computed(() => {
  const c = props.data?.contexts
  return c && typeof c === 'object' ? Object.values(c) : []
})

const routes = computed(() => {
  const out = []
  let i = 0
  for (const ctx of contexts.value) {
    const dispatchers = ctx?.mappings?.dispatcherServlets
    if (!dispatchers || typeof dispatchers !== 'object') continue
    for (const list of Object.values(dispatchers)) {
      if (!Array.isArray(list)) continue
      for (const m of list) {
        const cond = m?.details?.requestMappingConditions
        const methods = Array.isArray(cond?.methods) ? cond.methods : []
        const patterns = Array.isArray(cond?.patterns) ? cond.patterns : []
        const path = patterns.length ? patterns.join(', ') : (m?.predicate ?? '—')
        out.push({
          key: `r${i++}`,
          methods,
          path,
          handler: m?.handler ?? '—',
        })
      }
    }
  }
  return out
})

const filteredRoutes = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return routes.value
  return routes.value.filter((r) =>
    r.path.toLowerCase().includes(needle)
    || r.handler.toLowerCase().includes(needle)
    || r.methods.some((m) => m.toLowerCase().includes(needle)))
})

const filters = computed(() => {
  const out = []
  let i = 0
  for (const ctx of contexts.value) {
    const list = ctx?.mappings?.servletFilters
    if (!Array.isArray(list)) continue
    for (const f of list) {
      out.push({
        key: `f${i++}`,
        name: f?.name ?? '—',
        className: f?.className ?? f?.classNameUsedForDispatch ?? '—',
      })
    }
  }
  return out
})

function methodColor(method) {
  switch (String(method || '').toUpperCase()) {
    case 'GET': return 'success'
    case 'POST': return 'info'
    case 'PUT': return 'warning'
    case 'PATCH': return 'warning'
    case 'DELETE': return 'error'
    default: return 'grey'
  }
}
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.handler { color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.path { word-break: break-all; }
.section-title { margin: 1.25rem 0 .5rem; font-size: 13px; font-weight: 600; color: var(--ink-2, rgba(var(--v-theme-on-surface), .7)); }
</style>
