<!--
  SystemUserLogView — 2026 "Vibrant" browser-error log viewer
  (Administration → Information → User logs). Read-only port of the
  SystemUserView pattern: useDataTable on 'user-log' for server-side
  fetch / sort / paging, rendered through VibrantDataTable. No edit /
  delete dialogs — these rows are produced by the front-end error
  reporter (POST /rest/user-log) and only consulted here. Adds a
  date-range filter (From / To) wired into the GET's from/to query.
-->
<template>
  <div class="userlogs lj-surface">
    <LjPageHeader :title="t('system.userLog.title')"
      :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.info.title'), to: '/system/information' }, { label: t('system.userLog.title'), current: true }]">
      <template #subtitle>
        <b>{{ dt.totalItems.value }}</b> · {{ t('system.userLog.subtitle') }}
      </template>
      <template #actions>
        <div class="daterange">
          <label class="dr-field">
            <span class="dr-label">{{ t('system.userLog.filterFrom') }}</span>
            <span class="dr-box"><v-icon size="15" class="dr-ic">mdi-calendar-start</v-icon><input v-model="fromDate" type="date" /></span>
          </label>
          <label class="dr-field">
            <span class="dr-label">{{ t('system.userLog.filterTo') }}</span>
            <span class="dr-box"><v-icon size="15" class="dr-ic">mdi-calendar-end</v-icon><input v-model="toDate" type="date" /></span>
          </label>
        </div>
      </template>
    </LjPageHeader>

    <p v-if="dt.error.value" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ dt.error.value }}</p>

    <VibrantDataTable :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value"
      item-value="id" default-sort="date" default-order="desc" :empty-text="t('common.noData')"
      :fetch-all="dt.loadAll" filename="user-logs.csv" @update:options="loadData">
      <!-- date arrives as epoch milliseconds → localized display. -->
      <template #cell.date="{ item }">
        <span class="ul-date">{{ formatDate(item.date) }}</span>
      </template>
      <template #cell.user="{ item }">
        <code class="ul-user">{{ item.user }}</code>
      </template>
      <template #cell.message="{ item }">
        <span class="ul-msg" :title="item.message">{{ item.message }}</span>
      </template>
      <template #cell.url="{ item }">
        <code v-if="item.url" class="ul-url">{{ item.url }}</code>
        <span v-else class="dash">—</span>
      </template>
    </VibrantDataTable>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore, useDataTable, useI18nStore } from '@ligoj/host'
import { VibrantDataTable, LjPageHeader } from '@ligoj/host'

const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

// Date-range filter (inclusive). `to` covers the whole selected day.
const fromDate = ref('')
const toDate = ref('')
const fromMs = computed(() => (fromDate.value ? new Date(fromDate.value).getTime() : null))
const toMs = computed(() => (toDate.value ? new Date(toDate.value + 'T23:59:59').getTime() : null))

// The backend GET /rest/user-log speaks the legacy DataTables dialect
// (rows/page/sidx/sord) and returns { recordsTotal, recordsFiltered, data }.
// `extraParams` pins the live date bounds onto every call (null values are
// dropped by useDataTable, so an empty field adds no filter).
const dt = useDataTable('user-log', {
  defaultSort: 'date',
  defaultOrder: 'desc',
  extraParams: () => ({ from: fromMs.value, to: toMs.value }),
})

let lastOptions = {}

const headers = computed(() => [
  { key: 'date', label: t('system.userLog.headerDate'), sortable: true, icon: 'mdi-clock-outline' },
  { key: 'user', label: t('system.userLog.headerUser'), sortable: true, icon: 'mdi-account' },
  { key: 'message', label: t('system.userLog.headerMessage'), sortable: false, icon: 'mdi-message-alert-outline' },
  { key: 'url', label: t('system.userLog.headerUrl'), sortable: false, icon: 'mdi-link-variant' },
])

function formatDate(v) {
  if (v == null) return '—'
  const d = new Date(typeof v === 'number' ? v : Number(v))
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

function loadData(options) { lastOptions = options; dt.load(options) }

// Re-query from page 1 when the date range changes, keeping the current
// page size and sort.
watch([fromDate, toDate], () => {
  dt.load({ page: 1, itemsPerPage: lastOptions.itemsPerPage || 25, sortBy: lastOptions.sortBy })
})

onMounted(() => {
  app.setBreadcrumbs(
    () => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.info.title'), to: '/system/information' }, { title: t('system.userLog.title') }],
    { refresh: () => dt.load(lastOptions) },
  )
})
</script>

<style scoped>
/* View-specific styling only — the header chrome and table come from the
   shared host components + the global `.lj-surface` class (ink, pill,
   radius, mono, surface, border vars). */
.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

.daterange { display: inline-flex; align-items: flex-end; gap: 12px; }
.dr-field { display: flex; flex-direction: column; gap: 4px; }
.dr-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-3); }
.dr-box { display: flex; align-items: center; gap: 7px; padding: 0 11px; height: 38px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--surface); transition: border-color .15s; }
.dr-box:focus-within { border-color: var(--border-2); }
.dr-ic { color: var(--ink-3); }
.dr-box input { border: 0; outline: 0; background: transparent; color: var(--ink); font-family: var(--mono); font-size: 13px; min-width: 0; }

.ul-date { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); white-space: nowrap; }
.ul-user { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--ink); }
.ul-msg { font-size: 13.5px; color: var(--ink); display: inline-block; max-width: 520px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom; }
.ul-url { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); }
.dash { color: var(--ink-3); font-size: 13px; }
</style>
