<template>
  <div>
    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="caches.csv" :headers="headers" :items="items" :loading="loading" :items-per-page="-1" hide-default-footer density="compact">
      <template #item.hitCount="{ item }">
        <div class="d-flex align-center ga-2">
          <span>{{ item.hitCount ?? 0 }}</span>
          <v-chip v-if="item.hitPercentage != null && (item.hitCount ?? 0) > 0" size="x-small" :color="rateColor(item.hitPercentage, true, item.hitCount)">{{ Math.round(item.hitPercentage)
          }}%</v-chip>
        </div>
      </template>
      <template #item.missCount="{ item }">
        <div class="d-flex align-center ga-2">
          <span>{{ item.missCount ?? 0 }}</span>
          <v-chip v-if="item.missPercentage != null && (item.missCount ?? 0) > 1" size="x-small" :color="rateColor(100 - item.missPercentage, false)">{{ Math.round(item.missPercentage) }}%</v-chip>
        </div>
      </template>
      <template #item.averageGetTime="{ item }">
        {{ item.averageGetTime ?? '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" :loading="invalidating === item.id" @click="invalidate(item)" :title="t('system.cache.invalidate')">
          <v-icon size="small">mdi-broom</v-icon>
        </v-btn>
      </template>
    </LigojDataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useI18nStore, LigojDataTable } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const { t } = useI18nStore()

const items = ref([])
const loading = ref(false)
const error = ref(null)
const invalidating = ref(null)

const headers = computed(() => [
  { title: t('system.cache.headerName'),    key: 'id',             sortable: true },
  { title: t('system.cache.headerSize'),    key: 'size',           sortable: true, width: '100px' },
  { title: t('system.cache.headerHits'),    key: 'hitCount',       sortable: true, width: '160px' },
  { title: t('system.cache.headerMisses'),  key: 'missCount',      sortable: true, width: '160px' },
  { title: t('system.cache.headerAvgGet'),  key: 'averageGetTime', sortable: true, width: '140px' },
  { title: '',                              key: 'actions',        sortable: false, width: '60px', align: 'end' },
])

function rateColor(score, hit, hitCount) {
  if (hit && hitCount === 1) return 'success'
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 50) return 'warning'
  return 'error'
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/system/cache')
  if (Array.isArray(data)) items.value = data
  else if (data === null) error.value = t('system.cache.errorLoad')
  loading.value = false
}

async function invalidate(item) {
  invalidating.value = item.id
  await api.post(`rest/system/cache/${encodeURIComponent(item.id)}`)
  invalidating.value = null
  load()
}

onMounted(() => {
  app.setBreadcrumbs(
    [{ title: t('system.breadcrumb'), to: '/system' }, { title: t('system.cache.title') }],
    { refresh: load },
  )
  load()
})
</script>
