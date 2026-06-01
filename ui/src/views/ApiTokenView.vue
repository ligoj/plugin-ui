<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">{{ t('system.apiToken.new') }}</v-btn>
    </div>

    <v-card variant="tonal" class="mb-4">
      <v-card-text>
        <p class="mb-2">{{ t('system.apiToken.intro') }}</p>
        <p class="mb-0 text-body-2">
          {{ t('system.apiToken.example') }}
          <code>
            GET {{ origin }}{{ base }}rest/project?api-key=&lt;token&gt;&amp;api-user={{ userName }}
          </code>
        </p>
      </v-card-text>
    </v-card>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="api-tokens.csv" :headers="headers" :items="rows" :loading="loading" :items-per-page="-1" hide-default-footer density="compact">
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" :title="t('system.apiToken.show')" @click="openShow(item.name, 'load')">
          <v-icon size="small">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top" :text="t('system.apiToken.show')" />
        </v-btn>
        <v-btn icon size="small" variant="text" :title="t('system.apiToken.regenerate')" @click="openShow(item.name, 'regen')">
          <v-icon size="small">mdi-refresh</v-icon>
          <v-tooltip activator="parent" location="top" :text="t('system.apiToken.regenerate')" />
        </v-btn>
        <v-btn icon size="small" variant="text" color="error" :title="t('common.delete')" @click="startDelete(item.name)">
          <v-icon size="small">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top" :text="t('common.delete')" />
        </v-btn>
      </template>
    </LigojDataTable>

    <!-- Create token dialog -->
    <v-dialog v-model="createDialog" max-width="480">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-key</v-icon>
          <span>{{ t('system.apiToken.newTitle') }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="createFormRef" @submit.prevent="doCreate">
            <v-text-field prepend-inner-icon="mdi-key-outline" v-model="createName" :label="t('system.apiToken.fieldName')" :rules="[rules.required]" variant="outlined" autofocus maxlength="250" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="createDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" variant="elevated" :loading="creating" @click="doCreate">{{ t('system.apiToken.create') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Show / regenerate token dialog -->
    <v-dialog v-model="tokenDialog" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-key</v-icon>
          {{ t('system.apiToken.tokenLabel') }}&nbsp;<code>{{ tokenTarget }}</code>
        </v-card-title>
        <v-card-text>
          <v-progress-linear v-if="tokenLoading" indeterminate color="primary" class="mb-3" />
          <v-textarea v-model="tokenValue" readonly rows="3" variant="outlined" hide-details :append-inner-icon="'mdi-content-copy'" @click:append-inner="copy" />
          <v-alert v-if="copyDone" type="success" variant="tonal" density="compact" class="mt-2">
            {{ t('system.apiToken.copyDone') }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="tokenDialog = false">{{ t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Created token dialog (shows the freshly-minted value) -->
    <v-dialog v-model="createdDialog" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-key</v-icon>
          {{ t('system.apiToken.newTokenLabel') }}&nbsp;<code>{{ createdName }}</code>
        </v-card-title>
        <v-card-text>
          <v-alert type="info" variant="tonal" density="compact" class="mb-3">
            {{ t('system.apiToken.newSaveHint', { showLabel: t('system.apiToken.show') }) }}
          </v-alert>
          <v-textarea :model-value="createdValue" readonly rows="3" variant="outlined" hide-details :append-inner-icon="'mdi-content-copy'" @click:append-inner="copyCreated" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="createdDialog = false">{{ t('system.apiToken.done') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-key</v-icon>
          <span>{{ t('system.apiToken.deleteTitle') }}</span>
        </v-card-title>
        <v-card-text>{{ t('system.apiToken.deleteConfirm', { name: deleteTarget }) }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="confirmDelete">{{ t('system.apiToken.revoke') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useAuthStore, useI18nStore, APP_BASE, LigojDataTable } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const auth = useAuthStore()
const { t } = useI18nStore()

const base = APP_BASE
const origin = typeof window !== 'undefined' ? window.location.origin : ''
const userName = computed(() => auth.userName || '<you>')

const rows = ref([])
const loading = ref(false)
const error = ref(null)

const createDialog = ref(false)
const createFormRef = ref(null)
const createName = ref('')
const creating = ref(false)

const createdDialog = ref(false)
const createdName = ref('')
const createdValue = ref('')

const tokenDialog = ref(false)
const tokenTarget = ref('')
const tokenValue = ref('')
const tokenLoading = ref(false)
const copyDone = ref(false)

const deleteDialog = ref(false)
const deleteTarget = ref('')
const deleting = ref(false)

const rules = { required: (v) => !!v || 'Required' }

const headers = computed(() => [
  { title: t('system.apiToken.headerName'), key: 'name', sortable: true },
  { title: '', key: 'actions', sortable: false, width: '160px', align: 'end' },
])

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/api/token')
  // Endpoint returns plain strings; map to rows for v-data-table.
  rows.value = Array.isArray(data) ? data.map((name) => ({ name })) : []
  loading.value = false
}

function openCreate() {
  createName.value = ''
  createDialog.value = true
}

async function doCreate() {
  const { valid } = await createFormRef.value.validate()
  if (!valid) return
  creating.value = true
  const result = await api.post(`rest/api/token/${encodeURIComponent(createName.value)}`)
  creating.value = false
  if (result === null) return
  createdName.value = createName.value
  createdValue.value = typeof result === 'string' ? result : result?.id || ''
  createDialog.value = false
  createdDialog.value = true
  load()
}

async function openShow(name, mode) {
  tokenTarget.value = name
  tokenValue.value = ''
  copyDone.value = false
  tokenDialog.value = true
  tokenLoading.value = true
  const url = `rest/api/token/${encodeURIComponent(name)}`
  const data = mode === 'regen' ? await api.put(url) : await api.get(url)
  tokenValue.value = typeof data === 'string' ? data : data?.id || ''
  tokenLoading.value = false
}

async function copy() {
  try {
    await navigator.clipboard.writeText(tokenValue.value)
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2000)
  } catch {
    /* clipboard denied — user can still select the textarea */
  }
}

async function copyCreated() {
  try {
    await navigator.clipboard.writeText(createdValue.value)
  } catch { /* ignore */ }
}

function startDelete(name) {
  deleteTarget.value = name
  deleteDialog.value = true
}

async function confirmDelete() {
  deleting.value = true
  await api.del(`rest/api/token/${encodeURIComponent(deleteTarget.value)}`)
  deleting.value = false
  deleteDialog.value = false
  load()
}

onMounted(() => {
  app.setBreadcrumbs(
    [{ title: t('api.title'), to: '/api' }, { title: t('system.apiToken.title') }],
    { refresh: load },
  )
  load()
})
</script>
