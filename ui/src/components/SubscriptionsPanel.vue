<!--
  SubscriptionsPanel — the reusable subscriptions display, shared by
  ProjectDetailView and HomeView. Renders a toolbar (Cartes/Liste toggle +
  optional search + optional "collapse all") over a grid of SubscriptionGroupCard
  (cards) or a flat VibrantDataTable (list). Both keep the per-subscription plugin
  RENDERING DELEGATION (renderDetailsKey / renderDetailsFeatures / renderFeatures).

  Input is the already-grouped `groups` model (one entry per tool):
    { key, name, kind, color, icon, health, rows: [{ name, status, pills, cost?, sub }] }

  Lazy details: each row emits `row-appear` (once it scrolls into view) so a host
  that only has light subscription data can fetch the full details on demand.
  The host cog click is surfaced as `rowmenu` ({ event, sub }).
-->
<template>
  <div class="subs-panel">
    <div class="sp-toolbar">
      <LjSegmented v-model="view" :options="viewOptions" />
      <button v-if="collapsible && view === 'cards'" class="collapse-all" type="button" @click="toggleAll">
        <v-icon size="16">{{ anyCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal' }}</v-icon>
        <span>{{ anyCollapsed ? t('common.expandAll') : t('common.collapseAll') }}</span>
      </button>
      <LjSearch v-if="searchable" v-model="query" :placeholder="t('common.search')" />
      <slot name="toolbar" />
      <span class="sp-sp" />
      <span class="sp-count"><b>{{ filteredGroups.length }}</b> {{ t('project.detail.tool').toLowerCase() }}{{ filteredGroups.length > 1 ? 's' : '' }} · <b>{{ rowCount }}</b> {{ t('project.detail.subscriptions').toLowerCase() }}</span>
    </div>

    <div v-if="loading" class="sp-grid">
      <div v-for="n in 4" :key="n" class="sp-skel" />
    </div>

    <template v-else-if="filteredGroups.length">
      <!-- Cards -->
      <div v-if="view === 'cards'" class="sp-grid">
        <SubscriptionGroupCard v-for="(g, i) in filteredGroups" :key="g.key" :group="g" :cog="cog"
          :collapsed="collapsedKeys.has(g.key)" :style="{ animationDelay: (i * 45) + 'ms' }"
          @toggle="toggle(g.key)" @rowmenu="$emit('rowmenu', $event)" @row-appear="$emit('row-appear', $event)" @refresh-node="$emit('refresh-node', $event)" />
      </div>

      <!-- List: one row per subscription, same delegation in the cells -->
      <VibrantDataTable v-else :headers="listHeaders" :items="subRows" :items-length="subRows.length" item-value="id" default-sort="tool" :tools="false">
        <template #cell.tool="{ item }">
          <div class="avatar-cell" v-appear="() => item.sub && $emit('row-appear', item.sub)">
            <span class="glyph sm" :style="{ '--c': item.color }"><component :is="item.icon" /></span>
            <div><div class="ac-name">{{ item.tool }}</div><div class="ac-kind">{{ item.kind }}</div></div>
          </div>
        </template>
        <template #cell.details="{ item }">
          <span class="lsum">
            <PluginFeatures v-if="item.sub" :subscription="item.sub" action="renderDetailsKey" />
            <PluginFeatures v-if="item.sub" :subscription="item.sub" action="renderDetailsFeatures" />
            <span v-for="(p, k) in item.pills" :key="k" class="pill" :class="{ cost: item.cost }">{{ p }}</span>
          </span>
        </template>
        <template #cell.status="{ item }"><SubscriptionStatus :subscription="item.sub" :status="item.status" /></template>
        <template #actions="{ item }">
          <span v-if="item.sub" class="rowact">
            <PluginFeatures :subscription="item.sub" action="renderFeatures" />
            <button v-if="cog && item.sub.id" class="rowcog" :title="t('common.actions') || 'Actions'" @click.stop="$emit('rowmenu', { event: $event, sub: item.sub })"><v-icon size="16">mdi-dots-vertical</v-icon></button>
          </span>
        </template>
      </VibrantDataTable>
    </template>

    <slot v-else name="empty"><div class="sp-empty">{{ t('common.noData') }}</div></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PluginFeatures, useI18nStore, LjSegmented, LjSearch, VibrantDataTable } from '@ligoj/host'
import SubscriptionGroupCard from './SubscriptionGroupCard.vue'
import SubscriptionStatus from './SubscriptionStatus.vue'
import { vAppear } from '../directives/appear.js'

const props = defineProps({
  groups: { type: Array, default: () => [] },
  defaultView: { type: String, default: 'list' }, // 'list' | 'cards'
  searchable: { type: Boolean, default: true },
  collapsible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  cog: { type: Boolean, default: true }, // show the host overflow (unsubscribe) cog
  storageKey: { type: String, default: '' }, // localStorage scope for the cards/list choice; '' disables persistence
})
defineEmits(['rowmenu', 'row-appear', 'refresh-node'])

const t = useI18nStore().t

// The single source of truth for the toggle (was duplicated in both views).
const viewOptions = [
  { value: 'cards', icon: 'mdi-view-grid-outline', label: 'Cartes' },
  { value: 'list', icon: 'mdi-format-list-bulleted', label: 'Liste' },
]

// View mode (cards/list) is remembered per context in localStorage when a
// `storageKey` is given (e.g. 'home', 'project'); without one the panel keeps
// its previous in-memory-only behaviour (backward compatible).
const STORAGE_PREFIX = 'ligoj-subview:'
function readStoredView() {
  if (!props.storageKey) return null
  try {
    const v = localStorage.getItem(STORAGE_PREFIX + props.storageKey)
    return (v === 'cards' || v === 'list') ? v : null
  } catch { return null }
}
const view = ref(readStoredView() ?? props.defaultView)
watch(view, (v) => {
  if (!props.storageKey) return
  try { localStorage.setItem(STORAGE_PREFIX + props.storageKey, v) } catch { /* storage unavailable (private mode / quota) */ }
})
const query = ref('')
const collapsedKeys = ref(new Set())

// Filter groups by tool name/kind, or keep only the rows matching the query.
const filteredGroups = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.groups
  return props.groups
    .map((g) => {
      if ((g.name || '').toLowerCase().includes(q) || (g.kind || '').toLowerCase().includes(q)) return g
      const rows = g.rows.filter((r) => (r.name || '').toLowerCase().includes(q))
      return rows.length ? { ...g, rows } : null
    })
    .filter(Boolean)
})

const rowCount = computed(() => filteredGroups.value.reduce((a, g) => a + g.rows.length, 0))

// Flat one-row-per-subscription model for the list view.
const subRows = computed(() => filteredGroups.value.flatMap((g) => g.rows.map((r, i) => ({
  id: r.sub?.id ?? `${g.key}:${i}`,
  tool: g.name, kind: g.kind, color: g.color, icon: g.icon,
  name: r.name, status: r.status, pills: r.pills, cost: r.cost, sub: r.sub,
}))))

const listHeaders = computed(() => [
  { key: 'tool', label: t('project.detail.tool') || 'Outil', sortable: true, icon: 'mdi-hammer-wrench' },
  { key: 'details', label: t('project.detail.subscriptions'), sortable: false },
  { key: 'status', label: t('common.status'), sortable: false, align: 'center' },
])

// Per-card collapse (cards view); "collapse all" toggles the whole filtered set.
const anyCollapsed = computed(() => collapsedKeys.value.size > 0)
function toggle(key) {
  const next = new Set(collapsedKeys.value)
  if (next.has(key)) next.delete(key); else next.add(key)
  collapsedKeys.value = next
}
function toggleAll() {
  collapsedKeys.value = anyCollapsed.value ? new Set() : new Set(filteredGroups.value.map((g) => g.key))
}
</script>

<style scoped>
.subs-panel { --ok: #1d9d63; --warn: #d98a16; --err: #df4d42; --idle: #bcb6a8; }

.sp-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.sp-sp { flex: 1; }
.sp-count { font-size: 13px; color: var(--ink-3); white-space: nowrap; }
.sp-count b { color: var(--ink-2); font-family: var(--mono); }
.collapse-all { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 12px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--card); color: var(--ink-2); font-family: var(--font); font-weight: 700; font-size: 13px; cursor: pointer; transition: background .12s, color .12s; }
.collapse-all:hover { background: var(--pill); color: var(--ink); }

.sp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
@media (max-width: 1100px) { .sp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px)  { .sp-grid { grid-template-columns: 1fr; } }
.sp-skel { height: 220px; border-radius: var(--radius); background: linear-gradient(100deg, var(--card), color-mix(in srgb, var(--ink) 4%, var(--card)), var(--card)); background-size: 200% 100%; animation: sp-shimmer 1.3s linear infinite; }
@keyframes sp-shimmer { to { background-position: -200% 0; } }
.sp-empty { padding: 48px 0; text-align: center; color: var(--ink-3); font-weight: 600; }

/* List cells. */
.avatar-cell { display: flex; align-items: center; gap: 12px; }
.glyph { width: 44px; height: 44px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: var(--card); box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--c) 50%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c) 22%, var(--border)); }
.glyph.sm { width: 36px; height: 36px; }
.glyph.sm :deep(img.tool-icon), .glyph.sm :deep(.demo-logo) { width: 22px; height: 22px; object-fit: contain; }
.glyph.sm :deep(i) { font-size: 20px; color: color-mix(in srgb, var(--c) 75%, var(--ink)); }
.ac-name { font-family: var(--font); font-weight: 700; font-size: 14px; color: var(--ink); }
.ac-kind { font-family: var(--mono); font-size: 11px; color: var(--ink-3); }
.ln { font-size: 13.5px; font-weight: 600; color: var(--ink); }
.lsum { display: inline-flex; align-items: center; gap: 5px; flex-wrap: wrap; }

.pill { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--ink-2); background: var(--pill); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius-sm); padding: 2px 7px; }
.pill.cost { color: #b85b00; background: #fff3e6; border-color: #ffe0bf; }

.st { width: 9px; height: 9px; border-radius: 50%; flex: none; position: relative; display: inline-block; }
.st::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; background: currentColor; opacity: .18; }
.st.ok { background: var(--ok); color: var(--ok); }
.st.warn { background: var(--warn); color: var(--warn); }
.st.err { background: var(--err); color: var(--err); }
.st.idle { background: var(--idle); color: var(--idle); }

.rowact { display: inline-flex; align-items: center; gap: 2px; flex: none; }
.rowact :deep(.v-btn) { width: 28px; height: 28px; color: var(--ink-3); }
.rowact :deep(.v-btn:hover) { color: var(--ink); }
.rowcog { width: 28px; height: 28px; border: 0; background: transparent; border-radius: 8px; cursor: pointer; display: inline-grid; place-items: center; color: var(--ink-3); transition: background .14s, color .14s; }
.rowcog:hover { background: rgba(var(--v-theme-on-surface), .08); color: var(--ink); }
</style>
