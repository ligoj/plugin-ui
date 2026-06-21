<!--
  ActInfo — friendly renderer for the Actuator `info` endpoint.

  Follows the Act*.vue contract (see ActHealth.vue):
   - Presentational only: receives the already-fetched, parsed payload as the
     `data` prop. NO API calls, NO @ligoj/host imports, NO router.
   - Robust to missing / variant shapes (Spring versions differ): optional
     chaining everywhere, and a graceful empty state when there's nothing to show.
   - Built from globally-registered Vuetify components (v-table, v-alert) for a
     modern, consistent look — `density="compact"` on tables.
   - The shell (ActuatorView) owns the title, refresh, raw-JSON toggle and JSON
     download — renderers only draw the friendly view.
   - Labels are plain English technical terms (admin/debug surface); CSS reads
     the `.lj-surface` tokens (var(--ink), var(--mono)…) that cascade from the view.

  Each top-level group (build, git, java, os, plus any others present) becomes a
  small card with a key/value table; nested objects are flattened to dotted keys
  (e.g. git.commit.id).
-->
<template>
  <div class="act-info">
    <v-alert v-if="!groups.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <div v-else class="info-grid">
      <v-card v-for="g in groups" :key="g.name" class="info-card" variant="flat">
        <div class="ic-head"><span class="ic-ic"><v-icon size="20">{{ g.icon }}</v-icon></span><h3>{{ g.label }}</h3></div>
        <div class="ic-body">
          <div v-for="row in g.rows" :key="row.key" class="frow">
            <span class="fk">{{ row.key }}</span>
            <span class="fv mono">{{ row.value }}</span>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

// Plain-English headings + an icon for the well-known groups; anything else is
// humanised with a generic icon.
const LABELS = {
  build: 'Build',
  git: 'Git',
  java: 'Java',
  os: 'Operating System',
  process: 'Process',
}
const ICONS = {
  build: 'mdi-package-variant-closed',
  git: 'mdi-git',
  java: 'mdi-language-java',
  os: 'mdi-desktop-classic',
  process: 'mdi-cog-outline',
}

function labelFor(name) {
  return LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1)
}
function iconFor(name) {
  return ICONS[name] || 'mdi-information-outline'
}

// Flatten a nested object/array into dotted-key rows; scalars become a single row.
function flatten(value, prefix, out) {
  if (value === null || value === undefined) {
    out.push({ key: prefix, value: '—' })
  } else if (Array.isArray(value)) {
    if (!value.length) out.push({ key: prefix, value: '[]' })
    else value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out))
  } else if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) out.push({ key: prefix, value: '{}' })
    else entries.forEach(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k, out))
  } else {
    out.push({ key: prefix, value: String(value) })
  }
}

const groups = computed(() => {
  const d = props.data
  if (!d || typeof d !== 'object' || Array.isArray(d)) return []
  return Object.entries(d)
    .map(([name, value]) => {
      const rows = []
      flatten(value, '', rows)
      return { name, label: labelFor(name), icon: iconFor(name), rows }
    })
    .filter((g) => g.rows.length)
})
</script>

<style scoped>
/* ProfileView-style cards (.pcard / .infoline / .fk / .fv). */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 1100px) { .info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) { .info-grid { grid-template-columns: 1fr; } }
.info-card {
  background: var(--surface) !important;
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c) !important;
  border-radius: var(--radius) !important;
  padding: 18px 20px;
  box-shadow: var(--shadow) !important;
}
.ic-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.ic-head h3 {
  margin: 0;
  font-family: var(--font);
  font-weight: var(--bold, 800);
  font-size: 16px;
  color: var(--ink);
}
.ic-ic {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 16%, transparent);
  color: rgb(var(--v-theme-primary));
}
.frow {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
}
.frow + .frow { border-top: var(--border-w) var(--lj-border-style, solid) var(--border-c); }
.fk {
  font-size: 12.5px;
  color: var(--ink-2, rgba(var(--v-theme-on-surface), .7));
  font-weight: 600;
  min-width: 120px;
  flex: none;
  word-break: break-word;
}
.fv {
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  word-break: break-word;
  min-width: 0;
}
.fv.mono { font-family: var(--mono, ui-monospace, monospace); font-weight: 500; }
</style>
