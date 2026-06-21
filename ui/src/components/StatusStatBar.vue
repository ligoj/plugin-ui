<!--
  StatusStatBar — a compact 3-segment status progress bar (UP / no status / DOWN)
  with an "up/total" counter and an optional refresh button.

  Shared by SubscriptionGroupCard for BOTH the per-node SUBSCRIPTION-status bar
  and the node/INSTANCE operational-status bar: same shape, two data sources, so
  the markup + CSS live here once instead of being duplicated per bar.

  `stats` = { total, up, down, noStatus }. Emits `refresh` when the button is
  clicked. The tooltip uses the shared `home.nodeStatus.{up,noStatus,down}`
  labels, prefixed by `label` so the two bars read distinctly.
-->
<template>
  <span class="statbar">
    <v-icon v-if="icon" size="13" class="sb-ic">{{ icon }}</v-icon>
    <span class="sb-bar">
      <i class="seg up" :style="{ width: pct(stats.up) + '%' }" />
      <i class="seg nost" :style="{ width: pct(stats.noStatus) + '%' }" />
      <i class="seg down" :style="{ width: pct(stats.down) + '%' }" />
      <v-tooltip activator="parent" location="top" :text="tooltip" />
    </span>
    <span class="sb-count">{{ stats.up }}/{{ stats.total }}</span>
    <button v-if="refreshable" type="button" class="sb-refresh" :class="{ spin: refreshing }" :disabled="refreshing"
      :aria-label="refreshLabel" @click.stop="$emit('refresh')">
      <v-icon size="14">mdi-refresh</v-icon>
      <v-tooltip activator="parent" location="top" :text="refreshLabel" />
    </button>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@ligoj/host'

const props = defineProps({
  stats: { type: Object, required: true },        // { total, up, down, noStatus }
  label: { type: String, default: '' },           // entity name, prefixes the tooltip
  icon: { type: String, default: '' },            // optional leading mdi icon
  refreshing: { type: Boolean, default: false },
  refreshable: { type: Boolean, default: true },
  refreshLabel: { type: String, default: '' },
})
defineEmits(['refresh'])

const t = useI18nStore().t

function pct(n) {
  const total = props.stats?.total || 0
  return total ? Math.round((n / total) * 100) : 0
}
const tooltip = computed(() => {
  const s = props.stats || {}
  const head = props.label ? `${props.label} — ` : ''
  return `${head}${t('home.nodeStatus.up')} ${s.up || 0} · ${t('home.nodeStatus.noStatus')} ${s.noStatus || 0} · ${t('home.nodeStatus.down')} ${s.down || 0}`
})
</script>

<style scoped>
/* `--ok` / `--err` / `--idle` cascade in from the host card (`.subcard`);
   the fallbacks keep the bar correct if it's ever used stand-alone. */
.statbar { flex: none; display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; color: var(--ink-3); }
.sb-ic { color: var(--ink-3); flex: none; }
.sb-bar { display: flex; width: 64px; height: 7px; border-radius: 5px; overflow: hidden; background: var(--idle, #bcb6a8); cursor: default; }
.sb-bar .seg { height: 100%; transition: width .4s cubic-bezier(.2, .7, .3, 1); }
.sb-bar .seg.up { background: var(--ok, #1d9d63); }
.sb-bar .seg.nost { background: var(--idle, #bcb6a8); }
.sb-bar .seg.down { background: var(--err, #df4d42); }
.sb-count { font-family: var(--mono); font-variant-numeric: tabular-nums; color: color-mix(in srgb, var(--ok, #1d9d63) 70%, var(--ink)); }
.sb-refresh { flex: none; width: 26px; height: 26px; border: 0; background: transparent; border-radius: var(--radius-sm); color: var(--ink-3); cursor: pointer; display: grid; place-items: center; transition: background .12s, color .12s; }
.sb-refresh:hover:not(:disabled) { background: rgba(var(--v-theme-on-surface), .08); color: var(--ink); }
.sb-refresh:disabled { cursor: default; opacity: .65; }
.sb-refresh.spin :deep(.v-icon) { animation: sbspin .8s linear infinite; }
@keyframes sbspin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .sb-refresh.spin :deep(.v-icon) { animation: none; } }
</style>
