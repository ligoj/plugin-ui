<template>
  <div>
    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-row>
      <!-- System -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-server-outline</v-icon> {{ t('system.info.system') }}
          </v-card-title>
          <v-card-text>
            <div class="mb-3">
              <div class="d-flex align-center mb-1">
                <span class="text-body-2 text-medium-emphasis flex-grow-1">{{ t('system.info.memory') }}</span>
                <span class="text-caption">
                  {{ formatSize(memory.used) }} / {{ formatSize(memory.max) }}
                </span>
              </div>
              <v-tooltip :text="memoryTooltip" location="top">
                <template #activator="{ props: tipProps }">
                  <div v-bind="tipProps">
                    <v-progress-linear :model-value="memory.pctUsed" :buffer-value="memory.pctUsed + memory.pctCommittedFree" color="error" buffer-color="warning" buffer-opacity="0.8"
                      bg-color="success" bg-opacity="0.35" height="14" rounded />
                  </div>
                </template>
              </v-tooltip>
              <div class="d-flex mt-1 text-caption text-medium-emphasis ga-3">
                <span><v-icon size="x-small" color="error">mdi-circle</v-icon> {{ t('system.info.memoryUsed') }} {{ memory.pctUsed }}%</span>
                <span><v-icon size="x-small" color="warning">mdi-circle</v-icon> {{ t('system.info.memoryCommittedFree') }} {{ memory.pctCommittedFree }}%</span>
                <span><v-icon size="x-small" color="success">mdi-circle</v-icon> {{ t('system.info.memoryFree') }} {{ memory.pctFree }}%</span>
              </div>
            </div>

            <v-text-field :model-value="cpu" :label="t('system.info.cpu')" readonly density="compact" variant="outlined" class="mb-2" />

            <v-row density="comfortable">
              <v-col cols="12" md="6">
                <v-text-field :model-value="dateIso" :label="t('system.info.localDate')" readonly density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :model-value="dateTimestamp" :label="t('system.info.timestamp')" readonly density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Time zone -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-map-clock</v-icon> {{ t('system.info.timezone') }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="tz.application" :label="t('system.info.timezoneApplication')" density="compact" variant="outlined" class="mb-2" :loading="updatingTz === 'application'"
              @blur="saveTimeZone('application', tz.application)" @keyup.enter="saveTimeZone('application', tz.application)" />
            <v-text-field v-model="tz.default" :label="t('system.info.timezoneSystem')" density="compact" variant="outlined" class="mb-2" :loading="updatingTz === 'default'" @blur="saveTimeZone('default', tz.default)"
              @keyup.enter="saveTimeZone('default', tz.default)" />
            <v-text-field :model-value="tz.original" :label="t('system.info.timezoneOriginal')" readonly density="compact" variant="outlined" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Session -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-account-key</v-icon> {{ t('system.info.session') }}
          </v-card-title>
          <v-card-text>
            <v-text-field :model-value="sessionId" :label="t('system.info.sessionId')" readonly density="compact" variant="outlined" class="mb-2" :append-inner-icon="'mdi-content-copy'"
              @click:append-inner="copy(sessionId)" />
            <v-text-field :model-value="auth.userName" :label="t('system.info.sessionUser')" readonly density="compact" variant="outlined" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Build -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-source-commit</v-icon> {{ t('system.info.build') }}
          </v-card-title>
          <v-card-text>
            <v-text-field :model-value="build.number" :label="t('system.info.buildNumber')" readonly density="compact" variant="outlined" class="mb-2" />
            <v-row density="comfortable">
              <v-col cols="12" md="6">
                <v-text-field :model-value="build.timestamp" :label="t('system.info.buildTimestamp')" readonly density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :model-value="build.date" :label="t('system.info.buildDate')" readonly density="compact" variant="outlined" />
              </v-col>
            </v-row>
            <v-text-field :model-value="build.version" :label="t('system.info.buildVersion')" readonly density="compact" variant="outlined" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi, useAppStore, useAuthStore, useClipboard, useI18nStore, APP_BASE } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const auth = useAuthStore()
const { t } = useI18nStore()

const loading = ref(false)
const error = ref(null)
const updatingTz = ref(null)

const cpu = ref('')
const dateIso = ref('')
const dateTimestamp = ref('')

const memory = reactive({
  used: 0, committedFree: 0, free: 0, max: 0,
  pctUsed: 0, pctCommittedFree: 0, pctFree: 0,
})

const tz = reactive({ application: '', default: '', original: '' })

const sessionId = computed(() => getCookie('JSESSIONID') || '')

const build = computed(() => {
  const s = auth.appSettings || {}
  const ts = parseInt(s.buildTimestamp, 10)
  return {
    number: s.buildNumber ?? '',
    timestamp: Number.isNaN(ts) ? (s.buildTimestamp ?? '') : ts,
    date: Number.isNaN(ts) ? '' : new Date(ts).toISOString().slice(0, 19).replace('T', ' '),
    version: s.buildVersion ?? '',
  }
})

const memoryTooltip = computed(() =>
  t('system.info.memoryTooltip', {
    used: formatSize(memory.used),
    committedFree: formatSize(memory.committedFree),
    free: formatSize(memory.free),
    max: formatSize(memory.max),
  }),
)

function formatSize(bytes) {
  if (bytes == null || isNaN(bytes)) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`
}

function getCookie(name) {
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/system')
  if (data) {
    cpu.value = data.cpu?.total ?? ''
    dateIso.value = data.date?.date ? new Date(data.date.date).toISOString() : ''
    dateTimestamp.value = data.date?.date ?? ''
    tz.application = data.date?.timeZone ?? ''
    tz.default = data.date?.defaultTimeZone ?? ''
    tz.original = data.date?.originalDefaultTimeZone ?? ''

    const max = data.memory?.maxMemory || (data.memory?.totalMemory || 0) + 1_000_000
    const committedUsed = (data.memory?.totalMemory ?? 0) - (data.memory?.freeMemory ?? 0)
    const committedFree = data.memory?.freeMemory ?? 0
    const free = Math.max(0, max - (data.memory?.totalMemory ?? 0))
    memory.used = committedUsed
    memory.committedFree = committedFree
    memory.free = free
    memory.max = max
    memory.pctUsed = round1((committedUsed / max) * 100)
    memory.pctCommittedFree = round1((committedFree / max) * 100)
    memory.pctFree = round1(100 - memory.pctUsed - memory.pctCommittedFree)
  }
  loading.value = false
}

function round1(n) {
  return Math.round(n * 10) / 10
}

async function saveTimeZone(type, value) {
  if (!value) return
  updatingTz.value = type
  // useApi stringifies JSON bodies; this endpoint wants a text/plain body
  // (the raw TZ name), so call fetch directly.
  try {
    await fetch(`${APP_BASE}rest/system/timezone/${type}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: value,
    })
  } catch {
    /* silent — field shows the user's edit regardless */
  }
  updatingTz.value = null
}

const { copy } = useClipboard()

onMounted(() => {
  app.setBreadcrumbs(
    [{ title: t('system.breadcrumb'), to: '/system' }, { title: t('system.info.title') }],
    { refresh: load },
  )
  load()
})
</script>
