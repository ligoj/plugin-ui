<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openNew">{{ t('common.new') }}</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="roles.csv" :headers="headers" :items="items" :loading="loading" :items-per-page="-1" hide-default-footer density="compact">
      <template #header.authApi="{ column }"><span class="d-inline-flex align-center"><v-icon size="small" class="mr-1">mdi-api</v-icon>{{ column.title }}<v-tooltip activator="parent" location="top" :text="column.title" /></span></template>
      <template #header.authUi="{ column }"><span class="d-inline-flex align-center"><v-icon size="small" class="mr-1">mdi-monitor</v-icon>{{ column.title }}<v-tooltip activator="parent" location="top" :text="column.title" /></span></template>
      <template #item.authApi="{ item }">
        <code v-for="a in item['authorizations-api']" :key="a.id || a.pattern" class="auth-token">{{ a.pattern }}</code>
      </template>
      <template #item.authUi="{ item }">
        <code v-for="a in item['authorizations-ui']" :key="a.id || a.pattern" class="auth-token">{{ a.pattern }}</code>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" @click="openEdit(item)">
          <v-icon size="small">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </LigojDataTable>

    <v-dialog v-model="editDialog" max-width="640">
      <v-card>
        <v-card-title>{{ editTarget ? t('system.role.editTitle') : t('system.role.newTitle') }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field v-model="editForm.name" :label="t('system.role.fieldName')" prepend-inner-icon="mdi-shield-outline" :rules="[rules.required]" variant="outlined" class="mb-4" autofocus />

            <v-combobox v-model="editForm.apiPatterns" :label="t('system.role.fieldApiPatterns')" prepend-inner-icon="mdi-api" :items="editForm.apiPatterns" chips closable-chips multiple variant="outlined"
              :hint="t('system.role.patternsHint')" persistent-hint class="mb-4" />

            <v-combobox v-model="editForm.uiPatterns" :label="t('system.role.fieldUiPatterns')" prepend-inner-icon="mdi-monitor" :items="editForm.uiPatterns" chips closable-chips multiple variant="outlined"
              :hint="t('system.role.patternsHint')" persistent-hint class="mb-2" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="save">{{ t('common.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>{{ t('system.role.deleteTitle') }}</v-card-title>
        <v-card-text>{{ t('system.role.deleteConfirm', { name: deleteTarget?.name || '' }) }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="confirmDelete">{{ t('common.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ name: '', apiPatterns: [], uiPatterns: [] })
const saving = ref(false)
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const rules = { required: (v) => !!v || 'Required' }

const headers = computed(() => [
  { title: t('system.role.headerName'), key: 'name',    sortable: true,  width: '180px' },
  { title: t('system.role.headerApi'),  key: 'authApi', sortable: false },
  { title: t('system.role.headerUi'),   key: 'authUi',  sortable: false },
  { title: '',                          key: 'actions', sortable: false, width: '120px', align: 'end' },
])

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/system/security/role/withAuth')
  const rows = data?.data || data || []
  // Split authorizations[] into ui / api for easier rendering.
  for (const r of rows) {
    r['authorizations-api'] = (r.authorizations || []).filter((a) => a.type === 'api')
    r['authorizations-ui'] = (r.authorizations || []).filter((a) => a.type === 'ui')
  }
  items.value = rows
  loading.value = false
}

function openNew() {
  editTarget.value = null
  editForm.value = { name: '', apiPatterns: [], uiPatterns: [] }
  editDialog.value = true
}

function openEdit(item) {
  editTarget.value = item
  editForm.value = {
    name: item.name,
    apiPatterns: (item['authorizations-api'] || []).map((a) => a.pattern),
    uiPatterns: (item['authorizations-ui'] || []).map((a) => a.pattern),
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
    id: editTarget.value?.id,
    name: editForm.value.name,
    authorizations: [
      ...editForm.value.apiPatterns.map((p) => ({ pattern: p, type: 'api' })),
      ...editForm.value.uiPatterns.map((p) => ({ pattern: p, type: 'ui' })),
    ],
  }
  const method = editTarget.value ? 'put' : 'post'
  await api[method]('rest/system/security/role', payload)
  saving.value = false
  editDialog.value = false
  load()
}

async function confirmDelete() {
  deleting.value = true
  await api.del(`rest/system/security/role/${deleteTarget.value.id}`)
  deleting.value = false
  deleteDialog.value = false
  load()
}

onMounted(() => {
  app.setBreadcrumbs(
    [{ title: t('system.breadcrumb'), to: '/system' }, { title: t('system.role.title') }],
    { refresh: load },
  )
  load()
})
</script>

<style scoped>
.auth-token {
  display: inline-block;
  padding: 0.15em 0.45em;
  margin: 0.1em 0.2em 0.1em 0;
  font-size: 0.8em;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}
</style>
