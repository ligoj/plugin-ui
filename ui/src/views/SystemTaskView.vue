<!--
  SystemTaskView — 2026 "Vibrant" long-task dashboard (Administration -> Tasks).
  Consumes the Lot A backend (org.ligoj.app.resource.task.TaskStatusResource):
    GET rest/system/task            -> the LongTaskRunner beans + per-status stats
    GET rest/system/task/{key}      -> that runner's tasks (server-paginated TableItem)

  Runners are shown as cards GROUPED by type (Node / Subscription / Other; a
  section is rendered only when non-empty). Each card carries a 3-segment
  progress bar (succeeded / running / failed, modelled on NodeStatusBadge's
  .nsb-bar) and the counters. Clicking a card opens a dialog listing that
  runner's tasks through useDataTable (server pagination + a status filter
  passed as extraParams), with relative start time, computed duration and the
  locked entity (NodeIcon resolved straight from the node id; for a
  subscription runner, a router-link to the owning project).
-->
<template>
  <div class="tasks lj-surface">
    <LjPageHeader :title="t('system.task.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.task.title'), current: true }]">
      <template #subtitle>
        <b>{{ runners.length }}</b> {{ t('system.task.countLabel') }}
      </template>
    </LjPageHeader>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <div v-if="loading && !runners.length" class="loading"><v-progress-circular indeterminate size="32" /></div>

    <div v-for="group in groups" :key="group.type" class="section">
      <div class="section-head">
        <v-icon size="18">{{ group.icon }}</v-icon>
        <span class="section-title">{{ group.label }}</span>
        <span class="section-count">{{ group.runners.length }}</span>
      </div>
      <div class="cards">
        <button v-for="r in group.runners" :key="r.key" type="button" class="card" @click="openRunner(r)">
          <div class="card-top">
            <span class="card-label">{{ r.label }}</span>
            <span class="card-type" :class="`t-${r.type}`">{{ t('system.task.type.' + r.type) }}</span>
          </div>
          <div class="bar" :title="''">
            <i class="seg succeeded" :style="{ width: pct(r.stats, 'succeeded') + '%' }" />
            <i class="seg running" :style="{ width: pct(r.stats, 'running') + '%' }" />
            <i class="seg failed" :style="{ width: pct(r.stats, 'failed') + '%' }" />
          </div>
          <div class="counts">
            <span class="count total"><b>{{ r.stats.total }}</b>{{ t('system.task.statTotal') }}</span>
            <span class="count succeeded"><i class="dot" /><b>{{ r.stats.succeeded }}</b>{{ t('system.task.status.succeeded') }}</span>
            <span class="count running"><i class="dot" /><b>{{ r.stats.running }}</b>{{ t('system.task.status.running') }}</span>
            <span class="count failed"><i class="dot" /><b>{{ r.stats.failed }}</b>{{ t('system.task.status.failed') }}</span>
          </div>
        </button>
      </div>
    </div>

    <p v-if="!loading && !runners.length && !error" class="empty">{{ t('common.noData') }}</p>

    <!-- Scheduled tasks (rest/system/schedule): the Spring @Scheduled methods
         and the schedules contributed by plugins (e.g. the plug-in automation),
         with their trigger, next/last execution and state. -->
    <div class="section sched">
      <div class="section-head">
        <v-icon size="18">mdi-calendar-clock</v-icon>
        <span class="section-title">{{ t('system.task.scheduled') }}</span>
        <span class="section-count">{{ scheduled.length }}</span>
      </div>
      <VibrantDataTable :headers="scheduledHeaders" :items="scheduled" :items-length="scheduled.length" :loading="scheduledLoading"
        item-value="id" default-sort="bean" :empty-text="t('system.task.noScheduled')" filename="system-schedule.csv">
        <template #cell.bean="{ item }">
          <span class="sbean"><code class="author">{{ item.bean }}</code><span class="smethod">.{{ item.method }}()</span>
            <v-tooltip activator="parent" location="top" max-width="420" :text="t('system.task.beanTip', { bean: item.beanClass || item.bean, method: item.method, source: item.source || '' })" />
          </span>
        </template>
        <template #cell.expression="{ item }">
          <code class="nid">{{ item.expression || '—' }}
            <v-tooltip activator="parent" location="top" max-width="360" :text="t('system.task.trigger.' + (item.trigger || 'unknown'))" />
          </code>
        </template>
        <template #cell.nextExecution="{ item }">
          <span class="rel">{{ item.nextExecution ? relTime(toMs(item.nextExecution)) : '—' }}
            <v-tooltip activator="parent" location="top">{{ item.nextExecution ? fullDate(toMs(item.nextExecution)) : t('system.task.never') }}</v-tooltip>
          </span>
        </template>
        <template #cell.lastExecution="{ item }">
          <span class="lastrun">
            <span class="rel">{{ item.lastExecution ? relTime(toMs(item.lastExecution)) : '—' }}</span>
            <span v-if="item.lastStatus" class="schip" :class="`s-${item.lastStatus}`"><v-icon size="13">{{ statusIcon(item.lastStatus) }}</v-icon>{{ t('system.task.status.' + item.lastStatus) }}</span>
            <v-tooltip activator="parent" location="top" max-width="420">{{ lastTip(item) }}</v-tooltip>
          </span>
        </template>
        <template #cell.status="{ item }">
          <span class="schip" :class="`sch-${item.status}`"><v-icon size="13">{{ scheduleIcon(item.status) }}</v-icon>{{ t('system.task.schedule.' + (item.status || 'scheduled')) }}</span>
        </template>
      </VibrantDataTable>
    </div>

    <!-- Tasks of the selected runner. -->
    <LjDialog v-model="dialog" :title="current ? current.label : ''" icon="mdi-timer-sand" :max-width="920">
      <template v-if="current">
        <div class="dlg-head">
          <span class="card-type" :class="`t-${current.type}`">{{ t('system.task.type.' + current.type) }}</span>
          <LjSegmented v-model="statusFilter" :options="filterOptions" @update:model-value="onFilter" />
        </div>
        <VibrantDataTable v-if="dt" :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value"
          item-value="id" default-sort="start" default-order="desc" :empty-text="t('system.task.noTask')" @update:options="loadData">
          <template #cell.status="{ item }">
            <span class="schip" :class="`s-${item.status}`"><v-icon size="13">{{ statusIcon(item.status) }}</v-icon>{{ t('system.task.status.' + item.status) }}</span>
          </template>
          <template #cell.author="{ item }">
            <code class="author">{{ item.author }}</code>
          </template>
          <template #cell.start="{ item }">
            <span class="rel">{{ relTime(item.start) }}
              <v-tooltip activator="parent" location="top">{{ fullDate(item.start) }}</v-tooltip>
            </span>
          </template>
          <template #cell.duration="{ item }">
            <span class="dur">{{ durationLabel(item) }}
              <v-tooltip activator="parent" location="top">{{ durationTip(item) }}</v-tooltip>
            </span>
          </template>
          <template #cell.locked="{ item }">
            <span class="locked">
              <NodeIcon :node="item.locked.node" />
              <template v-if="item.locked.type === 'subscription' && item.locked.project">
                <router-link class="proj" :to="`/project/${item.locked.project.id}`" @click.stop>{{ item.locked.project.name }}</router-link>
              </template>
              <code v-else class="nid">{{ item.locked.node }}</code>
            </span>
          </template>
        </VibrantDataTable>
      </template>
      <template #footer>
        <LjButton variant="ghost" @click="dialog = false">{{ t('common.close') }}</LjButton>
      </template>
    </LjDialog>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue'
import { useApi, useAppStore, useDataTable, useI18nStore, NodeIcon, LjPageHeader, LjDialog, LjButton, LjSegmented, VibrantDataTable } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const runners = ref([])
const loading = ref(false)
const error = ref(null)

/* --- scheduled tasks (Spring @Scheduled + plugin providers) --- */
const scheduled = ref([])
const scheduledLoading = ref(false)
const scheduledHeaders = computed(() => [
  { key: 'bean', label: t('system.task.colTask'), sortable: true, icon: 'mdi-cube-outline' },
  { key: 'expression', label: t('system.task.colTrigger'), sortable: true, icon: 'mdi-calendar-clock' },
  { key: 'nextExecution', label: t('system.task.colNext'), sortable: true, icon: 'mdi-clock-fast' },
  { key: 'lastExecution', label: t('system.task.colLast'), sortable: true, icon: 'mdi-history' },
  { key: 'status', label: t('system.task.colStatus'), sortable: true, align: 'center', icon: 'mdi-flag-outline' },
])
const SCHEDULE_ICON = { scheduled: 'mdi-calendar-check', disabled: 'mdi-calendar-remove', running: 'mdi-progress-clock' }
function scheduleIcon(status) { return SCHEDULE_ICON[status] || 'mdi-calendar-clock' }
// Instants come as ISO strings (or epoch milliseconds)
function toMs(value) { return typeof value === 'number' ? value : new Date(value).getTime() }
function lastTip(item) {
  if (!item.lastExecution) return t('system.task.never')
  const when = fullDate(toMs(item.lastExecution))
  if (item.lastStatus === 'failed') return `${when} — ${t('system.task.lastFailed', { error: item.lastError || '' })}`
  return `${when} — ${t('system.task.lastSucceeded')}`
}
async function loadScheduled() {
  scheduledLoading.value = true
  try {
    const d = await api.get('rest/system/schedule')
    scheduled.value = Array.isArray(d) ? d : []
  } finally {
    scheduledLoading.value = false
  }
}

/* --- runner cards, grouped by type --- */
const SECTION_ICON = { node: 'mdi-server-network', subscription: 'mdi-connection', other: 'mdi-shape-outline' }
const groups = computed(() => {
  const by = { node: [], subscription: [], other: [] }
  for (const r of runners.value) (by[r.type] || by.other).push(r)
  return ['node', 'subscription', 'other']
    .map((type) => ({ type, icon: SECTION_ICON[type], label: t('system.task.section.' + type), runners: by[type] }))
    .filter((g) => g.runners.length)
})

function pct(stats, key) {
  const total = stats.total || 0
  return total ? (stats[key] || 0) / total * 100 : 0
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const [d] = await Promise.all([api.get('rest/system/task'), loadScheduled()])
    runners.value = Array.isArray(d) ? d : (d?.data || [])
  } catch {
    error.value = t('common.loadError') || 'Load error'
  } finally {
    loading.value = false
  }
}

/* --- tasks dialog (one runner) --- */
const dialog = ref(false)
const current = ref(null)
const statusFilter = ref('')
const dt = shallowRef(null)
let lastOptions = {}

const filterOptions = computed(() => [
  { value: '', label: t('system.task.filter.all') },
  { value: 'running', label: t('system.task.status.running') },
  { value: 'succeeded', label: t('system.task.status.succeeded') },
  { value: 'failed', label: t('system.task.status.failed') },
])

const headers = computed(() => [
  { key: 'status', label: t('system.task.colStatus'), sortable: true, align: 'center', icon: 'mdi-flag-outline' },
  { key: 'author', label: t('system.task.colAuthor'), sortable: true, icon: 'mdi-account-outline' },
  { key: 'start', label: t('system.task.colStart'), sortable: true, icon: 'mdi-clock-start' },
  { key: 'duration', label: t('system.task.colDuration'), sortable: false, icon: 'mdi-timer-outline' },
  { key: 'locked', label: t('system.task.colLocked'), sortable: false, icon: 'mdi-lock-outline' },
])

function openRunner(runner) {
  current.value = runner
  statusFilter.value = ''
  // The endpoint is per-runner: (re)create the data table for the selected key.
  // The status filter rides along as an extra query param, kept live via a getter.
  dt.value = useDataTable('system/task/' + runner.key, {
    defaultSort: 'start',
    defaultOrder: 'desc',
    extraParams: () => (statusFilter.value ? { status: statusFilter.value } : {}),
  })
  dialog.value = true
}

function loadData(options) {
  lastOptions = options
  dt.value?.load(options)
}

function onFilter() {
  dt.value?.load({ page: 1, itemsPerPage: lastOptions.itemsPerPage || 25, sortBy: lastOptions.sortBy })
}

/* --- status presentation --- */
const STATUS_ICON = { running: 'mdi-progress-clock', succeeded: 'mdi-check-circle', failed: 'mdi-close-circle' }
function statusIcon(status) { return STATUS_ICON[status] || 'mdi-help-circle' }

/* --- date / duration helpers --- */
function relTime(ms) {
  if (!ms) return '—'
  const sec = Math.round((ms - Date.now()) / 1000)
  const abs = Math.abs(sec)
  const rtf = new Intl.RelativeTimeFormat(i18n.locale || 'en', { numeric: 'auto' })
  if (abs < 60) return rtf.format(sec, 'second')
  if (abs < 3600) return rtf.format(Math.round(sec / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), 'hour')
  if (abs < 2592000) return rtf.format(Math.round(sec / 86400), 'day')
  return rtf.format(Math.round(sec / 2592000), 'month')
}
function fullDate(ms) { return ms ? new Date(ms).toLocaleString(i18n.locale || 'en') : '—' }

function fmtDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const u = (k) => t('system.task.unit.' + k)
  if (d) return `${d}${u('d')} ${h}${u('h')}`
  if (h) return `${h}${u('h')} ${m}${u('m')}`
  if (m) return `${m}${u('m')} ${sec}${u('s')}`
  return `${sec}${u('s')}`
}
function durationLabel(item) {
  if (!item.start) return '—'
  return fmtDuration((item.end || Date.now()) - item.start)
}
function durationTip(item) {
  return item.end ? fmtDuration(item.end - item.start) : t('system.task.stillRunning')
}

onMounted(() => {
  app.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.task.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* Chrome (header, dialog, table) comes from shared host components + the global
   `.lj-surface` utility (ink/card/pill/radius/mono vars). Only the runner cards,
   progress bar and task-cell bits are bespoke here. */
.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }
.loading { display: grid; place-items: center; padding: 48px 0; color: var(--ink-3); }
.empty { color: var(--ink-3); text-align: center; padding: 40px 0; }

.section { margin-bottom: 22px; }
.section-head { display: flex; align-items: center; gap: 8px; margin: 0 2px 12px; color: var(--ink-2); }
.section-title { font-family: var(--font); font-weight: var(--bold); font-size: 14px; letter-spacing: .02em; }
.section-count { font-family: var(--mono); font-size: 11.5px; font-weight: 700; color: var(--ink-3); background: var(--pill); border-radius: 999px; padding: 1px 9px; }

.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.card { text-align: left; border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); padding: 16px 18px; cursor: pointer; display: flex; flex-direction: column; gap: 12px; transition: transform .16s cubic-bezier(.2, .7, .3, 1), box-shadow .16s, border-color .16s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -22px rgba(0, 0, 0, .35); border-color: var(--border-2); }
.card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.card-label { font-family: var(--mono); font-size: 13.5px; font-weight: 700; color: var(--ink); word-break: break-all; }
.card-type { font-family: var(--font); font-weight: 700; font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; padding: 2px 8px; border-radius: 999px; flex: none; }
.card-type.t-node { color: #2563eb; background: rgba(37, 99, 235, .13); }
.card-type.t-subscription { color: #8b5cf6; background: rgba(139, 92, 246, .13); }
.card-type.t-other { color: var(--ink-3); background: var(--pill); }

/* 3-segment progress bar (succeeded / running / failed), modelled on .nsb-bar. */
.bar { display: flex; width: 100%; height: 7px; border-radius: 4px; overflow: hidden; background: var(--pill); }
.bar .seg { height: 100%; transition: width .4s cubic-bezier(.2, .7, .3, 1); }
.bar .seg.succeeded { background: #1d9d63; }
.bar .seg.running { background: #d9701a; }
.bar .seg.failed { background: #df4d42; }

.counts { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: var(--ink-3); }
.count { display: inline-flex; align-items: center; gap: 4px; }
.count b { font-family: var(--mono); color: var(--ink); }
.count .dot { width: 8px; height: 8px; border-radius: 50%; }
.count.succeeded .dot { background: #1d9d63; }
.count.running .dot { background: #d9701a; }
.count.failed .dot { background: #df4d42; }

/* Dialog. */
.dlg-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }

.schip { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font); font-weight: 700; font-size: 11px; padding: 3px 9px; border-radius: 999px; }
.schip.s-succeeded { color: #1d9d63; background: rgba(29, 157, 99, .13); }
.schip.s-running { color: #d9701a; background: rgba(217, 112, 26, .13); }
.schip.s-failed { color: rgb(var(--v-theme-error)); background: rgba(223, 77, 66, .12); }
.author { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); }
/* Scheduled tasks */
.sbean { display: inline-flex; align-items: baseline; gap: 0; cursor: default; }
.smethod { font-family: var(--mono); font-size: 12px; color: var(--ink-3); }
.lastrun { display: inline-flex; align-items: center; gap: 8px; cursor: default; }
.schip.sch-scheduled { color: #2563eb; background: rgba(37, 99, 235, .13); }
.schip.sch-disabled { color: var(--ink-3); background: var(--pill); }
.schip.sch-running { color: #d9701a; background: rgba(217, 112, 26, .13); }
.rel, .dur { color: var(--ink-2); font-size: 13px; cursor: default; }
.locked { display: inline-flex; align-items: center; gap: 8px; }
.nid { font-family: var(--mono); font-size: 12px; color: var(--ink-2); background: var(--pill); padding: 1px 7px; border-radius: var(--radius-sm); }
.proj { font-weight: 600; color: var(--accent); text-decoration: none; }
.proj:hover { text-decoration: underline; }
</style>
