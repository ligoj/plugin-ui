<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4 ga-2">
      <h1 class="text-h4">System users</h1>
      <v-spacer />
      <v-text-field v-model="dt.search.value" prepend-inner-icon="mdi-magnify" label="Search" variant="outlined" density="compact" hide-details class="search-field" @update:model-value="onSearch" />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openNew">New</v-btn>
    </div>

    <v-alert v-if="dt.error.value" type="warning" variant="tonal" class="mb-4">{{ dt.error.value }}</v-alert>

    <LigojDataTableServer :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value" v-model:items-per-page="itemsPerPage" item-value="login" hover
      filename="system-users.csv" :fetch-all="fetchAllUsers" @update:options="loadData">
      <template #item.roles="{ item }">
        <v-chip v-for="r in (item.roles || [])" :key="r.id" size="x-small" variant="tonal" class="mr-1">{{ r.name }}</v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" @click="openEdit(item)">
          <v-icon size="small">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </LigojDataTableServer>

    <v-dialog v-model="editDialog" max-width="520" persistent>
      <v-card>
        <v-card-title>{{ editTarget ? 'Edit system user' : 'New system user' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field v-model="editForm.login" label="Login" :rules="[rules.required]" :disabled="!!editTarget" variant="outlined" class="mb-2" autofocus />
            <v-autocomplete v-model="editForm.roles" label="Roles" :items="allRoles" item-value="id" item-title="name" multiple chips closable-chips variant="outlined"
              :rules="[rules.requiredArray]" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Delete system user</v-card-title>
        <v-card-text>Remove <strong>{{ deleteTarget?.login }}</strong> from system accounts?</v-card-text>
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
import { useApi, useAppStore, useDataTable, LigojDataTableServer } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const dt = useDataTable('system/user/roles', { defaultSort: 'login' })
const itemsPerPage = ref(25)
let searchTimeout = null
let lastOptions = {}

const allRoles = ref([])

const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ login: '', roles: [] })
const saving = ref(false)
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const rules = {
  required: (v) => !!v || 'Required',
  requiredArray: (v) => (Array.isArray(v) && v.length > 0) || 'Pick at least one role',
}

const headers = [
  { title: 'Login', key: 'login', sortable: true, width: '300px' },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: '', key: 'actions', sortable: false, width: '120px', align: 'end' },
]

function loadData(options) {
  lastOptions = options
  dt.load(options)
}

/**
 * Server-side pagination only hands us one page of users at a time.
 * When the table's tools menu asks for an export or a clipboard copy we
 * re-issue the same endpoint with a large page size so the whole set
 * ends up in the CSV / TSV. `rest/system/user/roles` tolerates this —
 * the underlying identity backend caps internally.
 */
async function fetchAllUsers() {
  const params = new URLSearchParams({
    rows: '999999',
    page: '1',
    sidx: 'login',
    sord: 'asc',
  })
  if (dt.search.value) params.set('search[value]', dt.search.value)
  const resp = await fetch(`rest/system/user/roles?${params}`, { credentials: 'include' })
  if (!resp.ok) return []
  const data = await resp.json().catch(() => null)
  return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
}

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(
    () => dt.load({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: lastOptions.sortBy }),
    300,
  )
}

async function loadRoles() {
  // rest/system/security/role returns an array of { id, name }; use it for
  // the multiselect. We ignore failures — the input just becomes free-text.
  const data = await api.get('rest/system/security/role')
  if (Array.isArray(data)) allRoles.value = data
  else if (Array.isArray(data?.data)) allRoles.value = data.data
}

function openNew() {
  editTarget.value = null
  editForm.value = { login: '', roles: [] }
  editDialog.value = true
}

function openEdit(item) {
  editTarget.value = item
  editForm.value = {
    login: item.login,
    roles: (item.roles || []).map((r) => r.id),
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
  const payload = { login: editForm.value.login, roles: editForm.value.roles }
  const method = editTarget.value ? 'put' : 'post'
  await api[method]('rest/system/user', payload)
  saving.value = false
  editDialog.value = false
  dt.load(lastOptions)
}

async function confirmDelete() {
  deleting.value = true
  await api.del(`rest/system/user/${encodeURIComponent(deleteTarget.value.login)}`)
  deleting.value = false
  deleteDialog.value = false
  dt.load(lastOptions)
}

onMounted(() => {
  app.setTitle('System users')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Users' }])
  loadRoles()
})
</script>

<style scoped>
.search-field {
  min-width: 200px;
  max-width: 300px;
  flex: 1 1 200px;
}
</style>
