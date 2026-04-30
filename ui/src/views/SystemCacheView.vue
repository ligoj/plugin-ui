<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">Caches</h1>
      <v-spacer />
      <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="load">Refresh</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="caches.csv"
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
    >
      <template #item.hitCount="{ item }">
        <div class="d-flex align-center ga-2">
          <span>{{ item.hitCount ?? 0 }}</span>
          <v-chip
            v-if="item.hitPercentage != null && (item.hitCount ?? 0) > 0"
            size="x-small"
            :color="rateColor(item.hitPercentage, true, item.hitCount)"
          >{{ Math.round(item.hitPercentage) }}%</v-chip>
        </div>
      </template>
      <template #item.missCount="{ item }">
        <div class="d-flex align-center ga-2">
          <span>{{ item.missCount ?? 0 }}</span>
          <v-chip
            v-if="item.missPercentage != null && (item.missCount ?? 0) > 1"
            size="x-small"
            :color="rateColor(100 - item.missPercentage, false)"
          >{{ Math.round(item.missPercentage) }}%</v-chip>
        </div>
      </template>
      <template #item.averageGetTime="{ item }">
        {{ item.averageGetTime ?? '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          icon
          size="small"
          variant="text"
          :loading="invalidating === item.id"
          @click="invalidate(item)"
          title="Invalidate cache"
        >
          <v-icon size="small">mdi-broom</v-icon>
        </v-btn>
      </template>
    </LigojDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi, useAppStore, LigojDataTable } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const items = ref([])
const loading = ref(false)
const error = ref(null)
const invalidating = ref(null)

const headers = [
  { title: 'Cache',           key: 'id',             sortable: true },
  { title: 'Size',            key: 'size',           sortable: true, width: '100px' },
  { title: 'Hits',            key: 'hitCount',       sortable: true, width: '160px' },
  { title: 'Misses',          key: 'missCount',      sortable: true, width: '160px' },
  { title: 'Avg get (ms)',    key: 'averageGetTime', sortable: true, width: '140px' },
  { title: '',                key: 'actions',        sortable: false, width: '60px', align: 'end' },
]

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
  else if (data === null) error.value = 'Unable to load caches'
  loading.value = false
}

async function invalidate(item) {
  invalidating.value = item.id
  await api.post(`rest/system/cache/${encodeURIComponent(item.id)}`)
  invalidating.value = null
  load()
}

onMounted(() => {
  app.setTitle('Caches')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Caches' }])
  load()
})
</script>
