<!--
  ActLoggers — friendly renderer for the Actuator `loggers` endpoint.

  Follows the Act*.vue contract (see ActHealth.vue):
   - Receives the already-fetched, parsed payload as the `data` prop, plus the
     injected `copy`, `fetch` and `post` helpers from ActuatorView.
   - Robust to missing / variant shapes (Spring versions differ): optional
     chaining everywhere, and a graceful empty state when there's nothing to show.
   - Built from globally-registered Vuetify components (v-table, v-chip, v-menu,
     v-list, v-text-field, v-alert, v-icon) — `density="compact"` on the table.
   - The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
     download — renderers only draw the friendly view.

  RUNTIME EDITING: the "Configured" level is editable — picking a level POSTs
  `loggers/<name>` with `{configuredLevel: <level>}` (Spring changes the logger
  at runtime, e.g. flip a package to DEBUG), then the single logger is re-fetched
  to reflect the new effective level. "Reset" posts a null level (inherit).
-->
<template>
  <div class="act-loggers">
    <v-alert v-if="!rows.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <template v-else>
      <div class="lg-head">
        <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Filter loggers"
          density="compact" variant="outlined" hide-details clearable style="max-width:340px" />
        <span v-if="post" class="lg-hint"><v-icon size="14">mdi-pencil-outline</v-icon>Click a configured level to change it live — runtime only, not persisted across restarts</span>
      </div>
      <v-table density="compact" class="act-tbl">
        <thead>
          <tr>
            <th class="sortable col-name" @click="toggleSort">
              Logger
              <v-icon size="x-small">{{ desc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}</v-icon>
            </th>
            <th class="col-lvl">Configured</th>
            <th class="col-lvl">Effective</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.name">
            <td><div class="cc"><span class="cc-txt mono">{{ r.name }}</span><button class="cc-copy" title="Copy logger" @click="copy && copy(r.name)"><v-icon size="13">mdi-content-copy</v-icon></button></div></td>
            <td>
              <v-menu v-if="post" :disabled="!!busy[r.name]">
                <template #activator="{ props: menu }">
                  <button class="lvl-btn" v-bind="menu" :disabled="!!busy[r.name]" title="Change level">
                    <v-chip v-if="r.configured" size="x-small" :color="levelColor(r.configured)" variant="tonal" label>{{ r.configured }}</v-chip>
                    <span v-else class="lvl-set">set…</span>
                    <v-icon size="13" class="lvl-caret">mdi-menu-down</v-icon>
                    <span v-if="busy[r.name]" class="lvl-spin" />
                  </button>
                </template>
                <v-list density="compact" min-width="170">
                  <v-list-item v-for="lvl in levels" :key="lvl" :active="r.configured === lvl" @click="setLevel(r, lvl)">
                    <template #prepend><v-icon size="13" :color="levelColor(lvl)">mdi-circle</v-icon></template>
                    <v-list-item-title>{{ lvl }}</v-list-item-title>
                  </v-list-item>
                  <v-divider />
                  <v-list-item :disabled="!r.configured" @click="setLevel(r, null)">
                    <template #prepend><v-icon size="14">mdi-backup-restore</v-icon></template>
                    <v-list-item-title>Reset (inherit)</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template v-else>
                <v-chip v-if="r.configured" size="x-small" :color="levelColor(r.configured)" variant="tonal" label>{{ r.configured }}</v-chip>
                <span v-else class="text-disabled">—</span>
              </template>
            </td>
            <td>
              <v-chip v-if="r.effective" size="x-small" :color="levelColor(r.effective)" variant="tonal" label>{{ r.effective }}</v-chip>
              <span v-else class="text-disabled">—</span>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="3" class="text-disabled pa-3">No matching logger.</td></tr>
        </tbody>
      </v-table>
    </template>

    <!-- Confirmation + persistence guidance after a runtime level change. -->
    <v-snackbar v-model="snack.show" :timeout="12000" location="bottom right" multi-line>
      <div class="snk">
        <v-icon size="20" color="success" class="snk-ic">mdi-check-circle</v-icon>
        <div class="snk-body">
          <div class="snk-title">
            <span class="snk-name">{{ snack.name }}</span> →
            <v-chip size="x-small" :color="levelColor(snack.level || snack.effective)" variant="tonal" label>{{ snack.level || 'inherited' }}</v-chip>
          </div>
          <div class="snk-note">Applied live, but <b>runtime only</b> — this change is lost on a full restart.</div>
          <template v-if="snack.level">
            <div class="snk-note">To keep it after a restart, add this to the container configuration (application.properties) and restart:</div>
            <code class="snk-code">logging.level.{{ snack.name }}={{ snack.level }}</code>
          </template>
          <div v-else class="snk-note">To make the reset permanent, remove any <code>logging.level.{{ snack.name }}</code> entry from the configuration.</div>
        </div>
      </div>
      <template #actions>
        <v-btn v-if="snack.level && copy" variant="text" size="small" @click="copy(`logging.level.${snack.name}=${snack.level}`, { message: 'Config line copied' })">Copy</v-btn>
        <v-btn variant="text" size="small" icon="mdi-close" @click="snack.show = false" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  data: { type: [Object, Array, String], default: null },
  copy: { type: Function, default: null },
  post: { type: Function, default: null },
  fetch: { type: Function, default: null },
})

const q = ref('')
const desc = ref(false)
const busy = reactive({})
// Confirmation snackbar shown after a successful runtime level change.
const snack = reactive({ show: false, name: '', level: null, effective: null })
// Local overrides applied after a successful runtime level change, so the table
// reflects the new state without re-fetching the whole endpoint.
const overrides = reactive({})

const levels = computed(() => {
  const ls = props.data?.levels
  return Array.isArray(ls) && ls.length ? ls : ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']
})

const rows = computed(() => {
  const loggers = props.data?.loggers
  if (!loggers || typeof loggers !== 'object') return []
  return Object.entries(loggers).map(([name, v]) => {
    const o = overrides[name]
    return {
      name,
      configured: o ? o.configured : (v?.configuredLevel ?? null),
      effective: o ? o.effective : (v?.effectiveLevel ?? null),
    }
  })
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  const list = needle ? rows.value.filter((r) => r.name.toLowerCase().includes(needle)) : rows.value
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name))
  return desc.value ? sorted.reverse() : sorted
})

function toggleSort() {
  desc.value = !desc.value
}

// Change (or reset, level === null) a logger's level at runtime.
async function setLevel(r, level) {
  if (!props.post || busy[r.name]) return
  if (r.configured === level) return
  busy[r.name] = true
  try {
    const resp = await props.post(`loggers/${encodeURIComponent(r.name)}`, { configuredLevel: level })
    if (resp?.ok) {
      // Re-fetch the single logger for an accurate effective level; fall back to
      // an optimistic update if no fetcher is available.
      let next = { configured: level, effective: level || r.effective }
      if (props.fetch) {
        const d = await props.fetch(`loggers/${encodeURIComponent(r.name)}`)
        if (d && typeof d === 'object') next = { configured: d.configuredLevel ?? null, effective: d.effectiveLevel ?? next.effective }
      }
      overrides[r.name] = next
      snack.name = r.name
      snack.level = level
      snack.effective = next.effective
      snack.show = true
    }
  } finally {
    busy[r.name] = false
  }
}

function levelColor(level) {
  switch (String(level || '').toUpperCase()) {
    case 'ERROR':
    case 'FATAL': return 'error'
    case 'WARN': return 'warning'
    case 'INFO': return 'info'
    case 'DEBUG': return 'success'
    case 'TRACE': return 'purple'
    default: return 'grey'
  }
}
</script>

<style scoped>
.act-tbl .mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
.sortable { cursor: pointer; user-select: none; }
.col-name { width: auto; }
.col-lvl { width: 150px; }

.lg-head { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
.lg-hint { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--ink-3); }

.lvl-btn { display: inline-flex; align-items: center; gap: 2px; background: none; border: 0; padding: 1px 2px; border-radius: var(--radius-sm); cursor: pointer; color: inherit; }
.lvl-btn:hover:not(:disabled) { background: var(--hover); }
.lvl-btn:disabled { cursor: default; }
.lvl-set { font-size: 12px; color: var(--ink-3); font-style: italic; }
.lvl-caret { opacity: .45; }
.lvl-spin { width: 12px; height: 12px; margin-left: 4px; border: 2px solid var(--pill); border-top-color: rgb(var(--v-theme-primary)); border-radius: 50%; animation: lg-spin .7s linear infinite; }
@keyframes lg-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .lvl-spin { animation: none; } }

/* Confirmation snackbar (teleported to <body>, so use self-contained styling
   with font fallbacks — the .lj-surface tokens aren't in scope there). */
.snk { display: flex; align-items: flex-start; gap: 10px; }
.snk-ic { flex: none; margin-top: 1px; }
.snk-body { min-width: 0; }
.snk-title { display: flex; align-items: center; gap: 6px; font-size: 13px; margin-bottom: 6px; }
.snk-name { font-family: var(--mono, ui-monospace, SFMono-Regular, monospace); font-weight: 700; word-break: break-all; }
.snk-note { font-size: 12px; line-height: 1.45; opacity: .9; margin-top: 4px; }
.snk-note code { font-family: var(--mono, ui-monospace, SFMono-Regular, monospace); }
.snk-code { display: block; margin-top: 6px; padding: 6px 8px; border-radius: 6px; background: rgba(127, 127, 127, .25); font-family: var(--mono, ui-monospace, SFMono-Regular, monospace); font-size: 11.5px; white-space: nowrap; overflow: auto; }
</style>
