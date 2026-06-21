<!--
  SubscriptionStatus — the status indicator used everywhere a node / subscription
  status is shown. A small coloured dot whose v-tooltip (project convention: all
  tooltips are v-tooltip, never native `title`) gathers everything known about the
  subscription, each section shown only when its data is available:
    - the service / tool (icon + id + name) and the instance (id + name),
    - the status icon + translated value,
    - the subscription mode (link / create), enabled flag, audit (created /
      modified by + date),
    - the parameters (name + value; secrets masked).

  Accepts a full `subscription` (its `.node` chain + status/mode/parameters/audit),
  or a bare `node` (+ `status`) for node-only contexts (e.g. node tables).
-->
<template>
  <v-tooltip location="top" max-width="420" open-delay="120">
    <template #activator="{ props: a }">
      <span v-bind="a" class="sst-dot" :class="dot" :aria-label="statusText" />
    </template>
    <div class="sst">
      <!-- node chain: service → tool → instance -->
      <div v-for="r in nodeRows" :key="r.id" class="sst-node">
        <NodeIcon v-if="r.showIcon" :node="r.node" class="sst-ic" />
        <span v-else class="sst-ic sst-ic-empty" />
        <div class="sst-ntxt">
          <span class="sst-type">{{ r.type }}</span>
          <span class="sst-name">{{ r.name || r.id }}</span>
          <code class="sst-id">{{ r.id }}</code>
        </div>
      </div>

      <div v-if="nodeRows.length" class="sst-sep" />

      <div class="sst-line">
        <v-icon size="14" :color="dotColor">{{ dotIcon }}</v-icon>
        <span class="sst-k">{{ t('subscription.tip.status') }}</span><b>{{ statusText }}</b>
      </div>
      <div v-if="modeText" class="sst-line"><span class="sst-k">{{ t('subscription.tip.mode') }}</span><span>{{ modeText }}</span></div>
      <div v-if="enabledText" class="sst-line"><span class="sst-k">{{ t('subscription.tip.enabled') }}</span><span>{{ enabledText }}</span></div>
      <div v-if="audit.created" class="sst-line sst-audit"><span class="sst-k">{{ t('subscription.tip.created') }}</span><span>{{ audit.created }}</span></div>
      <div v-if="audit.modified" class="sst-line sst-audit"><span class="sst-k">{{ t('subscription.tip.modified') }}</span><span>{{ audit.modified }}</span></div>

      <template v-if="params.length">
        <div class="sst-sep" />
        <div class="sst-ptitle">{{ t('subscription.tip.parameters') }}</div>
        <div v-for="p in params" :key="p.id" class="sst-param"><span class="sst-pk">{{ p.label }}</span><span class="sst-pv">{{ p.value }}</span></div>
      </template>
    </div>
  </v-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { NodeIcon, useI18nStore, nodeType } from '@ligoj/host'

const props = defineProps({
  subscription: { type: Object, default: null },
  node: { type: Object, default: null },
  status: { type: [String, Object, Number], default: null },
})

const t = useI18nStore().t

const rootNode = computed(() => props.subscription?.node || props.node || null)
const rawStatus = computed(() => props.subscription?.status ?? props.status ?? props.node?.status ?? null)

function statusDot(raw) {
  const s = String(raw?.status ?? raw ?? '').toLowerCase()
  if (s === 'up' || s === 'ok') return 'ok'
  if (s === 'down' || s === 'error' || s === 'ko') return 'err'
  if (s === 'warn' || s === 'blocked') return 'warn'
  return 'idle'
}
const DOT_META = {
  ok: { c: '#16a34a', i: 'mdi-check-circle' },
  warn: { c: '#d98a16', i: 'mdi-alert-circle' },
  err: { c: '#df4d42', i: 'mdi-close-circle' },
  idle: { c: '#9aa0a6', i: 'mdi-help-circle' },
}
// Node rows have no operational UP/DOWN status — fall back to the enabled flag
// so the dot still reflects something meaningful (enabled → green, else grey).
const enabledFlag = computed(() => {
  if (typeof rootNode.value?.enabled === 'boolean') return rootNode.value.enabled
  if (typeof props.subscription?.enabled === 'boolean') return props.subscription.enabled
  return null
})
const hasOpStatus = computed(() => {
  const r = rawStatus.value
  return r != null && String(r?.status ?? r) !== ''
})
const dot = computed(() => {
  if (hasOpStatus.value) return statusDot(rawStatus.value)
  if (enabledFlag.value === true) return 'ok'
  return 'idle'
})
const dotColor = computed(() => DOT_META[dot.value].c)
const dotIcon = computed(() => DOT_META[dot.value].i)
const statusText = computed(() => {
  if (hasOpStatus.value) {
    const key = `subscription.status.${dot.value}`
    const v = t(key)
    return v !== key ? v : (String(rawStatus.value?.status ?? rawStatus.value ?? '').toUpperCase() || dot.value)
  }
  if (enabledFlag.value !== null) return t(enabledFlag.value ? 'system.node.statusEnabled' : 'system.node.statusDisabled')
  const key = `subscription.status.${dot.value}`
  const v = t(key)
  return v !== key ? v : dot.value
})

// Node chain (instance → tool → service), classified by id depth, oldest first.
const TYPE_LABEL = {
  service: 'system.node.typeService',
  feature: 'system.node.typeFeature',
  tool: 'system.node.typeTool',
  instance: 'system.node.typeInstance',
}
const nodeRows = computed(() => {
  const rows = []
  const seen = new Set()
  let n = rootNode.value
  let guard = 0
  while (n && n.id && guard++ < 6) {
    const ty = nodeType(n)
    if (!seen.has(ty)) {
      seen.add(ty)
      rows.push({ type: t(TYPE_LABEL[ty] || TYPE_LABEL.service), id: n.id, name: n.name || '', node: n, showIcon: ty !== 'instance' })
    }
    n = n.refined
  }
  return rows.reverse()
})

const MODE_KEY = { LINK: 'wizard.modeLink', CREATE: 'wizard.modeCreate', ALL: 'subscription.tip.modeAll' }
const modeText = computed(() => {
  // Mode is a subscription field, but node rows carry it too (NodeVo.mode).
  const m = props.subscription?.mode ?? rootNode.value?.mode
  if (!m) return ''
  const key = MODE_KEY[String(m).toUpperCase()]
  return key ? t(key) : String(m)
})

const enabledText = computed(() => {
  // Shown as a separate line only when the dot reflects an OPERATIONAL status;
  // for node rows the Status line already conveys enabled/disabled.
  if (!hasOpStatus.value || enabledFlag.value === null) return ''
  return t(enabledFlag.value ? 'system.node.statusEnabled' : 'system.node.statusDisabled')
})

function userName(u) {
  if (!u) return ''
  if (typeof u === 'string') return u
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.id || ''
}
function fmtDate(d) {
  if (d == null) return ''
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleString()
}
const audit = computed(() => {
  const s = props.subscription || {}
  return {
    created: [fmtDate(s.createdDate), userName(s.createdBy)].filter(Boolean).join(' · '),
    modified: [fmtDate(s.lastModifiedDate), userName(s.lastModifiedBy)].filter(Boolean).join(' · '),
  }
})

const SENSITIVE = /secret|key|password|token/i
const params = computed(() => {
  const p = props.subscription?.parameters
  if (!p || typeof p !== 'object') return []
  return Object.keys(p).sort().map((id) => {
    const label = (() => { const v = t(id); return v === id ? id : v })()
    let value = p[id]
    if (SENSITIVE.test(id)) value = '••••••'
    else if (value && typeof value === 'object') value = JSON.stringify(value)
    return { id, label, value: String(value ?? '') }
  })
})
</script>

<style scoped>
/* Activator dot (lives in normal DOM — scoped + fixed status colours). */
.sst-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; position: relative; vertical-align: middle; cursor: default; }
.sst-dot::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; background: currentColor; opacity: .18; }
.sst-dot.ok { background: #16a34a; color: #16a34a; }
.sst-dot.warn { background: #d98a16; color: #d98a16; }
.sst-dot.err { background: #df4d42; color: #df4d42; }
.sst-dot.idle { background: #9aa0a6; color: #9aa0a6; }

/* Tooltip body (teleported; avoid .lj-surface tokens — they don't cascade
   there. The dim styling rides on the tooltip's own text colour). */
.sst { display: flex; flex-direction: column; gap: 4px; padding: 2px 0; font-size: 12px; min-width: 210px; }
.sst-node { display: flex; align-items: center; gap: 8px; }
.sst-ic { width: 20px; height: 20px; flex: none; display: inline-grid; place-items: center; }
.sst-ic :deep(img.tool-icon) { width: 18px; height: 18px; object-fit: contain; }
.sst-ic :deep(i) { font-size: 18px; }
.sst-ic-empty { visibility: hidden; }
.sst-ntxt { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; }
.sst-type { font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; opacity: .6; }
.sst-name { font-weight: 700; }
.sst-id { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 10.5px; opacity: .7; }
.sst-sep { height: 1px; background: currentColor; opacity: .15; margin: 3px 0; }
.sst-line { display: flex; align-items: center; gap: 6px; }
.sst-k { opacity: .6; min-width: 66px; }
.sst-audit { font-size: 11px; opacity: .85; }
.sst-ptitle { font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; opacity: .6; margin-top: 2px; }
.sst-param { display: flex; justify-content: space-between; gap: 12px; }
.sst-pk { opacity: .7; white-space: nowrap; }
.sst-pv { font-family: ui-monospace, SFMono-Regular, monospace; text-align: right; word-break: break-all; }
</style>
