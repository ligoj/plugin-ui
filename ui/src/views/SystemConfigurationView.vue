<template>
  <div class="system-config-page">
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">System configuration</h1>
      <v-spacer />
      <v-btn variant="outlined" prepend-icon="mdi-refresh" :loading="loading" @click="load">
        Refresh
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" class="ml-2" @click="openNew">
        New key
      </v-btn>
    </div>

    <!-- Encrypt helper -->
    <v-card variant="tonal" class="mb-4">
      <v-card-title class="text-subtitle-1 d-flex align-center ga-2">
        <v-icon>mdi-shield-key</v-icon> Encrypt helper
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="5">
            <v-text-field v-model="toEncrypt" label="Text to encrypt" variant="outlined" density="compact" hide-details @keyup.enter="encrypt" />
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" prepend-icon="mdi-lock" :loading="encrypting" :disabled="!toEncrypt" @click="encrypt">Encrypt</v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field :model-value="encrypted" label="Result" variant="outlined" density="compact" readonly hide-details :append-inner-icon="'mdi-content-copy'"
              @click:append-inner="copy(encrypted)" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Configuration table -->
    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable :headers="headers" :items="items" :loading="loading" :items-per-page="-1" hide-default-footer density="compact" filename="configuration.csv" class="configuration-table">
      <template #item.value="{ item }">
        <span v-if="item.secured" class="text-medium-emphasis">•••••</span>
        <code v-else class="config-value" :title="item.value">{{ item.value }}</code>
      </template>
      <template #item.secured="{ item }">
        <v-icon v-if="item.secured" size="small" color="primary" title="Secured">mdi-lock</v-icon>
      </template>
      <template #item.source="{ item }">
        <v-tooltip v-if="item.source" :text="sourceTooltip(item)" location="top">
          <template #activator="{ props: tipProps }">
            <v-icon v-bind="tipProps" size="small" :color="item.overridden ? 'warning' : undefined">{{ sourceIcon(item.source) }}</v-icon>
          </template>
        </v-tooltip>
        <v-icon v-if="item.overridden" size="x-small" color="warning" class="ml-1" title="Overridden">mdi-alert</v-icon>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" @click="openEdit(item)" title="Edit">
          <v-icon size="small">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)" title="Delete">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </LigojDataTable>

    <!-- Create / edit dialog -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ editTarget ? 'Edit configuration' : 'New configuration' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field v-model="editForm.name" label="Name" :rules="[rules.required]" variant="outlined" density="compact" class="mb-2" autofocus />
            <v-textarea v-model="editForm.value" label="Value" :rules="[rules.required]" :counter="1023" maxlength="1023" rows="3" variant="outlined" density="compact" class="mb-2" />
            <v-checkbox v-model="editForm.system" label="Override system environment / properties" density="compact" hide-details />
            <v-checkbox v-model="editForm.secured" label="Secured (value is encrypted at rest)" density="compact" hide-details />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="440">
      <v-card>
        <v-card-title>Delete configuration</v-card-title>
        <v-card-text>
          Remove key <code>{{ deleteTarget?.name }}</code>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi, useAppStore, useClipboard, LigojDataTable, APP_BASE } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const { copy } = useClipboard()

const items = ref([])
const loading = ref(false)
const error = ref(null)

const toEncrypt = ref('')
const encrypted = ref('')
const encrypting = ref(false)

const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ name: '', value: '', system: false, secured: false })
const saving = ref(false)

const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const rules = { required: (v) => (v !== '' && v != null) || 'Required' }

// Column widths sum to ~420 px of fixed cells (plus flexible Value + Name).
// The Source text column is intentionally dropped — the icon tooltip
// (sourceTooltip) already exposes the raw `source` string, so keeping both
// just consumed horizontal room.
const headers = [
  { title: 'Name', key: 'name', sortable: true, width: '220px' },
  { title: 'Value', key: 'value', sortable: false },
  { title: '', key: 'secured', sortable: true, width: '32px', align: 'center' },
  { title: 'Source', key: 'source', sortable: true, width: '80px', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, width: '128px', align: 'end' },
]

const SOURCE_ICONS = {
  systemEnvironment: 'mdi-desktop-classic',
  systemProperties: 'mdi-language-java',
  applicationConfig: 'mdi-file-code',
  database: 'mdi-database',
  classpath: 'mdi-file-code-outline',
}

function sourceIcon(source) {
  if (!source) return 'mdi-help-circle-outline'
  const key = source.split(':')[0]
  return SOURCE_ICONS[source.includes('classpath') ? 'classpath' : key] || 'mdi-help-circle-outline'
}

function sourceTooltip(item) {
  if (!item.source) return ''
  const base = `Source: ${item.source}`
  return item.overridden ? `${base} — overridden` : base
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/system/configuration')
  items.value = Array.isArray(data) ? data : (data?.data || [])
  items.value.sort((a, b) => String(a.name).localeCompare(String(b.name)))
  loading.value = false
}

async function encrypt() {
  if (!toEncrypt.value) return
  encrypting.value = true
  // Endpoint expects text/plain body; useApi always sets application/json when
  // body is a string, so fetch directly here.
  try {
    const resp = await fetch(`${APP_BASE}rest/system/security/crypto`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: toEncrypt.value,
    })
    encrypted.value = resp.ok ? await resp.text() : ''
  } catch {
    encrypted.value = ''
  } finally {
    encrypting.value = false
  }
}

function openNew() {
  editTarget.value = null
  editForm.value = { name: '', value: '', system: false, secured: false }
  editDialog.value = true
}

function openEdit(item) {
  editTarget.value = item
  editForm.value = {
    name: item.name,
    value: item.secured ? '' : (item.value ?? ''),
    system: false,
    secured: !!item.secured,
  }
  editDialog.value = true
}

function startDelete(item) {
  deleteTarget.value = item
  deleteDialog.value = true
}

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  const payload = {
    name: editForm.value.name,
    oldName: editTarget.value?.name || '',
    system: !!editForm.value.system,
    secured: !!editForm.value.secured,
    value: editForm.value.value,
  }
  await api.post('rest/system/configuration', payload)
  saving.value = false
  editDialog.value = false
  load()
}

async function confirmDelete() {
  deleting.value = true
  await api.del(`rest/system/configuration/${encodeURIComponent(deleteTarget.value.name)}/true`)
  deleting.value = false
  deleteDialog.value = false
  load()
}

onMounted(() => {
  app.setTitle('System configuration')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Configuration' }])
  load()
})
</script>

<style scoped>
/* Belt-and-braces: clip at the page root so nothing inside this view
 * (the table or the encrypt-helper v-row) can force the app layout to
 * scroll horizontally. min-width: 0 lets this div shrink below the
 * intrinsic width of its flex/grid children. */
.system-config-page {
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

.config-value {
  display: block;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85em;
}
</style>

<!--
  Unscoped: Vuetify's inner table markup (.v-table__wrapper, <table>, <td>)
  sits behind multiple template boundaries that Vue's scoped-CSS :deep()
  does not reach consistently once this SFC is shipped through the
  plugin-ui library bundle. Target the class directly so these rules
  always win; scope stays confined via the unique `.configuration-table`
  root class.
-->
<style>
.configuration-table {
  width: 100%;
  max-width: 100%;
}

.configuration-table .v-table__wrapper {
  overflow-x: hidden !important;
}

.configuration-table table {
  table-layout: fixed !important;
  width: 100% !important;
  max-width: 100% !important;
}

.configuration-table td,
.configuration-table th {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
