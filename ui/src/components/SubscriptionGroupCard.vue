<!--
  SubscriptionGroupCard — one tool (service) group of a project's subscriptions,
  rendered as a 2026 dashboard card. The CARD CHROME mirrors the HomeView
  subscription blocks (coloured top edge + tinted gradient header, glyph, name,
  kind, health bar + counter, collapse chevron, mini-table rows).

  The per-subscription RENDERING DELEGATION is preserved verbatim from
  ProjectDetailView: each row delegates to the owning plugin via PluginFeatures —
  `renderDetailsKey` (stable resource identity) + `renderDetailsFeatures` (live
  chips) for the summary, and `renderFeatures` (plugin row actions) next to the
  host overflow cog. The cog click is emitted as `rowmenu` so the parent keeps
  ownership of the unsubscribe menu.
-->
<template>
  <article class="subcard" :style="{ '--c': group.color }">
    <!-- Two-row header (HomeView style): glyph + name + count + status + collapse; kind + (health bar when no stats). -->
    <div class="card-head">
      <div class="ch-row top">
        <span class="glyph"><component :is="group.icon" /></span>
        <div class="name">{{ group.name }}</div>
        <!-- Amount of subscriptions in this group — shown on every card (the
             demo `.count` badge style), just left of the status dot. -->
        <span class="count" :aria-label="group.rows.length + ' ' + t('project.detail.subscriptions')">{{ group.rows.length }}</span>
        <!-- One Ligoj status dot summarising BOTH node operational health
             (getNodeStatus) and subscription health; tooltip shows both
             breakdowns. Click → refresh nodes, Shift+click → refresh
             subscriptions. Sits just left of the collapse toggle. -->
        <NodeStatusBadge v-if="hasStats" :node-stats="group.instanceStatus" :sub-stats="group.subStatus" :refreshing="!!group.refreshing"
          @refresh="(shift) => $emit('refresh-node', { key: group.key, subIds: group.subIds, kind: shift ? 'subscription' : 'node' })" />
        <button class="chev" type="button" :aria-label="collapsed ? t('common.expandAll') : t('common.collapseAll')" @click.stop="$emit('toggle')">
          <v-icon size="18">{{ collapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
        </button>
      </div>
      <div class="ch-row bottom">
        <div class="kind">{{ group.kind }}</div>
        <!-- Legacy health bar — only when no aggregated status is available
             (demo groups, ProjectDetail cards, stats not yet loaded). -->
        <span v-if="!hasStats" class="health">
          <span class="barh"><i :style="{ width: Math.round(group.health * 100) + '%' }" /></span>
          <span class="pct">{{ Math.round(group.health * 100) }}%</span>
        </span>
      </div>
    </div>

    <v-expand-transition>
      <div v-show="!collapsed" class="mini">
        <div v-for="(r, j) in shownRows" :key="j" class="mrow" v-appear="() => r.sub && $emit('row-appear', r.sub)">
          <SubscriptionStatus :subscription="r.sub" :status="r.status" />
          <span class="mlabel">{{ r.name }}</span>
          <span class="m-sum">
            <!-- Plugin-rendered summary, split like the legacy renderDetailsKey /
                 renderDetailsFeatures pair; degrade to nothing when the owning
                 plugin bundle isn't loaded — the synthetic pills always show. -->
            <PluginFeatures v-if="r.sub" :subscription="r.sub" action="renderDetailsKey" />
            <PluginFeatures v-if="r.sub" :subscription="r.sub" action="renderDetailsFeatures" />
            <span v-for="(p, k) in r.pills" :key="k" class="pill" :class="{ cost: r.cost }">{{ p }}</span>
          </span>
          <span v-if="r.sub" class="rowact">
            <!-- Plugin-contributed row actions; the host never interprets the HTML. -->
            <PluginFeatures :subscription="r.sub" action="renderFeatures" />
            <button v-if="r.sub.id" class="rowcog" :title="t('common.actions') || 'Actions'" @click.stop="$emit('rowmenu', { event: $event, sub: r.sub })">
              <v-icon size="16">mdi-dots-vertical</v-icon>
            </button>
          </span>
        </div>
        <div v-if="!group.rows.length" class="mrow mempty">{{ t('project.detail.noSubscriptions') }}</div>
        <button v-if="group.rows.length > 4" class="rowmore" @click.stop="expanded = !expanded">
          <v-icon size="14">{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          <span v-if="expanded">{{ t('common.reduce') || 'Réduire' }}</span>
          <span v-else>+{{ group.rows.length - 4 }} {{ t('project.detail.more') }}</span>
        </button>
      </div>
    </v-expand-transition>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PluginFeatures, useI18nStore } from '@ligoj/host'
import SubscriptionStatus from './SubscriptionStatus.vue'
import NodeStatusBadge from './NodeStatusBadge.vue'
import { vAppear } from '../directives/appear.js'

const props = defineProps({
  group: { type: Object, required: true },
  // Collapse is controlled by the parent panel (so "collapse all" can drive it).
  collapsed: { type: Boolean, default: false },
})
defineEmits(['rowmenu', 'toggle', 'row-appear', 'refresh-node'])

const t = useI18nStore().t
const expanded = ref(false)
const shownRows = computed(() => (expanded.value ? props.group.rows : props.group.rows.slice(0, 4)))

// Show the status badge when either aggregation is present; otherwise the card
// falls back to the legacy health bar.
const hasStats = computed(() => !!(props.group.instanceStatus || props.group.subStatus))
</script>

<style scoped>
.subcard {
  --ok: #1d9d63; --warn: #d98a16; --err: #df4d42; --idle: #bcb6a8;
  position: relative; display: flex; flex-direction: column;
  background: var(--card); border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow);
  opacity: 0; transform: translateY(12px); animation: rise .5s cubic-bezier(.2,.7,.3,1) forwards;
  transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .18s;
}
@keyframes rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .subcard { animation: none; opacity: 1; transform: none; } }
.subcard:hover { transform: translateY(-3px); box-shadow: 0 26px 50px -24px color-mix(in srgb, var(--c) 55%, transparent); }

/* Header: 4px coloured top edge + tinted gradient, two stacked rows. */
.card-head { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px 12px; border-top: 4px solid var(--c); background: linear-gradient(180deg, color-mix(in srgb, var(--c) 16%, var(--card)), color-mix(in srgb, var(--c) 5%, var(--card))); border-bottom: 1px solid color-mix(in srgb, var(--c) 16%, var(--border)); }
.ch-row { display: flex; align-items: center; gap: 10px; }
.ch-row.bottom { justify-content: space-between; }
.glyph { width: 44px; height: 44px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: var(--card); box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--c) 50%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c) 22%, var(--border)); }
.glyph :deep(img.tool-icon), .glyph :deep(.demo-logo) { width: 26px; height: 26px; object-fit: contain; }
.glyph :deep(i) { font-size: 24px; color: color-mix(in srgb, var(--c) 75%, var(--ink)); }
.ch-row.top .name { flex: 1 1 auto; min-width: 0; font-family: var(--font); font-weight: var(--bold); font-size: 16.5px; letter-spacing: -.03em; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chev { flex: none; width: 30px; height: 30px; border-radius: var(--radius-sm); border: none; background: transparent; color: var(--ink-3); cursor: pointer; display: grid; place-items: center; transition: background .12s, color .12s; }
.chev:hover { background: color-mix(in srgb, var(--c) 12%, var(--card)); color: var(--ink); }
.ch-row.bottom .kind { flex: 1 1 auto; min-width: 0; font-family: var(--mono); font-size: 10px; font-weight: 700; color: color-mix(in srgb, var(--c) 55%, var(--ink-3)); text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.health { flex: none; display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--ink-3); }
.pct { font-variant-numeric: tabular-nums; }
.barh { width: 44px; height: 7px; border-radius: 5px; background: var(--pill); overflow: hidden; }
.barh i { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 60%, white)); }
.count { font-family: var(--mono); font-size: 11px; font-weight: 700; color: color-mix(in srgb, var(--c) 65%, var(--ink)); background: var(--card); border: var(--border-w) var(--lj-border-style, solid) color-mix(in srgb, var(--c) 22%, var(--border)); border-radius: var(--radius-sm); padding: 4px 8px; white-space: nowrap; }


/* Mini-table rows (HomeView look) carrying the per-subscription delegation. */
.mini { padding: 6px 10px 10px; max-height: 360px; overflow-y: auto; }
.mrow { position: relative; display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 11px; transition: background .12s; }
.mrow + .mrow::before { content: ""; position: absolute; top: 0; left: 8px; right: 8px; height: 1px; background: var(--border); }
.mrow:hover { background: color-mix(in srgb, var(--c) 8%, var(--card)); }
.mlabel { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.m-sum { flex: none; display: flex; align-items: center; gap: 5px; }
.mempty { display: block; text-align: center; font-size: 12px; font-weight: 600; color: var(--ink-3); padding: 8px; }
.mempty::before { display: none; }

/* Status dot. */
.st { width: 9px; height: 9px; border-radius: 50%; flex: none; position: relative; }
.st::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; background: currentColor; opacity: .18; }
.st.ok { background: var(--ok); color: var(--ok); }
.st.warn { background: var(--warn); color: var(--warn); }
.st.err { background: var(--err); color: var(--err); }
.st.idle { background: var(--idle); color: var(--idle); }

.pill { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--ink-2); background: var(--pill); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius-sm); padding: 2px 7px; }
.pill.cost { color: #b85b00; background: #fff3e6; border-color: #ffe0bf; }

/* Plugin row actions + host overflow cog. */
.rowact { display: inline-flex; align-items: center; gap: 2px; flex: none; }
.rowact :deep(.v-btn) { width: 28px; height: 28px; color: var(--ink-3); }
.rowact :deep(.v-btn:hover) { color: var(--ink); }
.rowcog { width: 28px; height: 28px; border: 0; background: transparent; border-radius: 8px; cursor: pointer; display: inline-grid; place-items: center; color: var(--ink-3); transition: background .14s, color .14s; }
.rowcog:hover { background: rgba(var(--v-theme-on-surface), .08); color: var(--ink); }

.rowmore { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font); font-size: 12.5px; font-weight: 700; color: var(--ink-3); padding: 6px 10px; margin-top: 4px; border: 0; background: rgba(var(--v-theme-on-surface), .05); border-radius: 8px; cursor: pointer; transition: background .14s, color .14s; }
.rowmore:hover { background: rgba(var(--v-theme-on-surface), .1); color: var(--ink); }
</style>
