<!--
  NodeStatusBadge — a single Ligoj-style status dot summarising a group's health
  across BOTH its node operational statuses (NodeResource#getNodeStatus — tool
  health, independent of subscriptions) AND its subscription statuses
  (rest/node/status/subscription). Mirrors the host LjStatus dot look and the
  SubscriptionStatus click-to-refresh interaction.

  Each of `nodeStats` / `subStats` is { total, up, down, unknown }. The v-tooltip
  shows BOTH breakdowns — one section each, one row per state (icon · name ·
  value · percentage), HIDING any state at 0% or 100%.

  Overall dot colour combines both: green (ok) when everything is up, red (error)
  when everything is down, orange (warn) for any mix, grey (idle) when nothing is
  known. Clicking the dot emits `refresh` (refresh node statuses); SHIFT+click
  emits `refresh` with `true` (refresh subscription statuses). `refreshing` blinks
  the dot.
-->
<template>
  <v-tooltip location="top" max-width="320" open-delay="120">
    <template #activator="{ props: a }">
      <span v-bind="a" class="nsb-dot" :class="[overall, { refreshing }]" role="button"
        :aria-label="t('home.status.refresh')" @click.stop="onClick" />
    </template>
    <div class="nsb">
      <template v-for="sec in sections" :key="sec.key">
        <div class="nsb-title"><v-icon size="12">{{ sec.icon }}</v-icon>{{ sec.label }} · {{ sec.total }}</div>
        <span class="nsb-bar">
          <i class="seg up" :style="{ width: sec.bar.up + '%' }" />
          <i class="seg nost" :style="{ width: sec.bar.unknown + '%' }" />
          <i class="seg down" :style="{ width: sec.bar.down + '%' }" />
        </span>
        <div v-for="r in sec.rows" :key="r.key" class="nsb-row">
          <v-icon size="13" :color="r.color">{{ r.icon }}</v-icon>
          <span class="nsb-name">{{ r.name }}</span>
          <b class="nsb-val">{{ r.value }}</b>
          <span class="nsb-pct">{{ r.pct }}%</span>
        </div>
      </template>
      <div class="nsb-foot">
        <v-icon size="12" :class="{ spin: refreshing }">mdi-refresh</v-icon>
        <span>{{ refreshing ? t('subscription.tip.refreshing') : t('home.status.refreshHint') }}</span>
      </div>
    </div>
  </v-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@ligoj/host'

const props = defineProps({
  // Node operational health and subscription health; each { total, up, down, unknown }.
  nodeStats: { type: Object, default: null },
  subStats: { type: Object, default: null },
  refreshing: { type: Boolean, default: false },
})
const emit = defineEmits(['refresh'])

const t = useI18nStore().t

// Click → refresh node statuses; SHIFT+click → refresh subscription statuses.
function onClick(e) { emit('refresh', !!e.shiftKey) }

// Combined overall colour over BOTH node + subscription items: all up → ok,
// all down → error, nothing known → idle, anything else → warn.
const overall = computed(() => {
  const a = props.nodeStats || {}
  const b = props.subStats || {}
  const total = (a.total || 0) + (b.total || 0)
  const up = (a.up || 0) + (b.up || 0)
  const down = (a.down || 0) + (b.down || 0)
  if (!total) return 'idle'
  if (up === total) return 'ok'
  if (down === total) return 'error'
  if (up === 0 && down === 0) return 'idle' // only unknowns
  return 'warn'
})

const STATES = [
  { key: 'up', icon: 'mdi-check-circle', color: '#1d9d63', nameKey: 'home.nodeStatus.up' },
  { key: 'unknown', icon: 'mdi-help-circle', color: '#9aa0a6', nameKey: 'home.nodeStatus.noStatus' },
  { key: 'down', icon: 'mdi-close-circle', color: '#df4d42', nameKey: 'home.nodeStatus.down' },
]
// Per-state rows for a section, hiding 0% (none) and 100% (all) per spec.
function buildRows(s) {
  const total = s.total || 0
  if (!total) return []
  return STATES
    .map((st) => {
      const value = s[st.key] || 0
      return { key: st.key, icon: st.icon, color: st.color, name: t(st.nameKey), value, pct: Math.round((value / total) * 100) }
    })
    .filter((r) => r.pct > 0 && r.pct < 100)
}

// Full-width segment percentages for a section's progress bar (unrounded so the
// three segments sum to exactly 100%).
function buildBar(s) {
  const total = s.total || 0
  const f = (n) => (total ? ((n || 0) / total) * 100 : 0)
  return { up: f(s.up), unknown: f(s.unknown), down: f(s.down) }
}

// Two tooltip sections: subscriptions then instances (only those present). Each
// keeps a progress bar (UP/unknown/DOWN) + per-state rows; the section icons
// match the original subscription / instance progress bars.
const sections = computed(() => {
  const out = []
  if (props.subStats) out.push({ key: 'sub', label: t('home.subStatus.label'), icon: 'mdi-connection', total: props.subStats.total || 0, bar: buildBar(props.subStats), rows: buildRows(props.subStats) })
  if (props.nodeStats) out.push({ key: 'node', label: t('home.nodeStatus.label'), icon: 'mdi-server-outline', total: props.nodeStats.total || 0, bar: buildBar(props.nodeStats), rows: buildRows(props.nodeStats) })
  return out
})
</script>

<style scoped>
/* Dot mirrors the host LjStatus colours/glow; clickable + blink-on-refresh like
   SubscriptionStatus. */
.nsb-dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; cursor: pointer; vertical-align: middle; background: rgba(var(--v-theme-on-surface), .2); transition: background .15s, box-shadow .15s; }
.nsb-dot.ok { background: #1d9d63; box-shadow: 0 0 0 3px rgba(29, 157, 99, .18), 0 0 10px 1px rgba(29, 157, 99, .6); }
.nsb-dot.warn { background: #df8a42; box-shadow: 0 0 0 3px rgba(223, 138, 66, .18), 0 0 10px 1px rgba(223, 138, 66, .6); }
.nsb-dot.error { background: #df4d42; box-shadow: 0 0 0 3px rgba(223, 77, 66, .18), 0 0 10px 1px rgba(223, 77, 66, .6); }
.nsb-dot.idle { background: rgba(var(--v-theme-on-surface), .2); }
.nsb-dot.refreshing { animation: nsb-blink .8s ease-in-out infinite; }
@keyframes nsb-blink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
@media (prefers-reduced-motion: reduce) { .nsb-dot.refreshing { animation: none; } }

/* Tooltip body (teleported — uses the tooltip's own text colour). */
.nsb { display: flex; flex-direction: column; gap: 3px; padding: 2px 0; font-size: 12px; min-width: 180px; }
.nsb-title { display: flex; align-items: center; gap: 5px; font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; opacity: .6; margin-top: 2px; }
.nsb-title:first-child { margin-top: 0; }
/* Per-section progress bar (UP / unknown / DOWN). Fixed colours — the tooltip is
   teleported, so the card's --ok/--err/--idle vars don't cascade here. */
.nsb-bar { display: flex; width: 100%; height: 6px; border-radius: 4px; overflow: hidden; background: #9aa0a6; margin: 1px 0 2px; }
.nsb-bar .seg { height: 100%; transition: width .4s cubic-bezier(.2, .7, .3, 1); }
.nsb-bar .seg.up { background: #1d9d63; }
.nsb-bar .seg.nost { background: #9aa0a6; }
.nsb-bar .seg.down { background: #df4d42; }
.nsb-row { display: flex; align-items: center; gap: 6px; }
.nsb-name { flex: 1; }
.nsb-val { font-variant-numeric: tabular-nums; }
.nsb-pct { opacity: .6; font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
.nsb-foot { display: flex; align-items: center; gap: 6px; font-size: 11px; opacity: .8; margin-top: 4px; }
.nsb-foot .spin { animation: nsb-spin .8s linear infinite; }
@keyframes nsb-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .nsb-foot .spin { animation: none; } }
</style>
