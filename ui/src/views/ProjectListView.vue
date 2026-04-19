<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4 ga-2">
      <h1 class="text-h4">Projects</h1>
      <v-spacer />
      <v-text-field
        v-model="dt.search.value"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        variant="outlined"
        density="compact"
        hide-details
        class="search-field"
        @update:model-value="onSearch"
      />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openNew">
        New
      </v-btn>
    </div>

    <v-alert v-if="dt.error.value" type="warning" variant="tonal" class="mb-4">
      {{ dt.error.value }}
    </v-alert>

    <v-alert v-if="dt.demoMode.value" type="info" variant="tonal" density="compact" class="mb-4">
      Running without a live backend — results below are sample data.
    </v-alert>

    <v-skeleton-loader
      v-if="dt.loading.value && dt.items.value.length === 0"
      type="table-heading, table-row@5"
      class="mb-4"
    />

    <v-data-table-server
      v-if="!dt.error.value"
      v-show="dt.items.value.length > 0 || !dt.loading.value"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="dt.items.value"
      :items-length="dt.totalItems.value"
      :loading="dt.loading.value"
      item-value="id"
      hover
      @update:options="loadData"
      @click:row="(_, { item }) => router.push(`/home/project/${item.id}`)"
    >
      <template #item.teamLeader="{ item }">
        <template v-if="item.teamLeader?.id">
          <v-avatar size="24" color="primary" class="mr-2">
            <span class="text-caption">{{ toUser2Letters(item.teamLeader) }}</span>
          </v-avatar>
          {{ getFullName(item.teamLeader) }}
        </template>
        <span v-else class="text-disabled">—</span>
      </template>
      <template #item.createdDate="{ item }">
        {{ formatDate(item.createdDate) }}
      </template>
      <template #item.nbSubscriptions="{ item }">
        <v-chip size="small" variant="tonal">{{ item.nbSubscriptions || 0 }}</v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" @click.stop="openEdit(item)">
          <v-icon size="small">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" color="error" @click.stop="startDelete(item)">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>

    <!-- Create / edit dialog -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ editTarget?.id ? 'Edit project' : 'New project' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field
              v-model="editForm.name"
              label="Name"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
              autofocus
              @update:model-value="onNameChanged"
            />
            <v-text-field
              v-model="editForm.pkey"
              label="Project key (pkey)"
              :rules="[rules.required, rules.pkey]"
              :disabled="editTarget?.nbSubscriptions > 0"
              :hint="editTarget?.nbSubscriptions > 0 ? 'Locked — project has subscriptions' : 'lowercase, digits, dash'"
              persistent-hint
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="editForm.teamLeader"
              label="Team leader (user id)"
              :rules="[rules.required]"
              :hint="'Identifier of the user managing this project'"
              persistent-hint
              variant="outlined"
              class="mb-2"
            />
            <v-textarea
              v-model="editForm.description"
              label="Description"
              rows="3"
              variant="outlined"
              class="mb-2"
            />
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
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>Delete project</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?
          </p>
          <v-checkbox
            v-model="deleteWithData"
            label="Also remove remote data associated with this project's subscriptions"
            density="compact"
            hide-details
          />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi, useAppStore, useDataTable, useI18nStore } from '@ligoj/host'
import { toUser2Letters, getFullName, normalize } from '../useUiHelpers.js'

const router = useRouter()
const api = useApi()
const app = useAppStore()
const { t } = useI18nStore()

const dt = useDataTable('project', { defaultSort: 'name' })
const itemsPerPage = ref(25)
let searchTimeout = null
let lastOptions = {}

const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ name: '', pkey: '', teamLeader: '', description: '' })
const saving = ref(false)
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)
const deleteWithData = ref(false)
let lastPkeyAuto = ''

const headers = computed(() => [
  { title: 'Name', key: 'name', sortable: true, width: '220px' },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Manager', key: 'teamLeader', sortable: false, width: '220px' },
  { title: 'Created', key: 'createdDate', sortable: true, width: '140px' },
  { title: 'Subs', key: 'nbSubscriptions', sortable: false, width: '80px', align: 'center' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
])

const rules = {
  required: (v) => !!v || 'Required',
  pkey: (v) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(v || '') || 'Use lowercase letters, digits, dash',
}

function formatDate(iso) {
  if (!iso) return ''
  const d = typeof iso === 'number' ? new Date(iso) : new Date(iso)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

function loadData(options) {
  lastOptions = options
  dt.load(options)
}

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(
    () => dt.load({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: lastOptions.sortBy }),
    300,
  )
}

function generatePkey(name) {
  const words = normalize(name || '').split(' ').filter(Boolean)
  return words.length ? words.join('-') : ''
}

function onNameChanged() {
  if (editTarget.value?.nbSubscriptions > 0) return
  const pk = generatePkey(editForm.value.name)
  // Only auto-fill if the user hasn't hand-edited the pkey since we last wrote it
  if (!editForm.value.pkey || editForm.value.pkey === lastPkeyAuto) {
    editForm.value.pkey = pk
    lastPkeyAuto = pk
  }
}

function openNew() {
  editTarget.value = null
  editForm.value = { name: '', pkey: '', teamLeader: '', description: '' }
  lastPkeyAuto = ''
  editDialog.value = true
}

function openEdit(item) {
  editTarget.value = item
  editForm.value = {
    name: item.name || '',
    pkey: item.pkey || '',
    teamLeader: item.teamLeader?.id || '',
    description: item.description || '',
  }
  lastPkeyAuto = item.pkey || ''
  editDialog.value = true
}

function startDelete(item) {
  deleteTarget.value = item
  deleteWithData.value = false
  deleteDialog.value = true
}

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (dt.demoMode.value) {
    editDialog.value = false
    return
  }
  saving.value = true
  const payload = {
    id: editTarget.value?.id,
    name: editForm.value.name,
    pkey: editForm.value.pkey,
    teamLeader: editForm.value.teamLeader,
    description: editForm.value.description,
  }
  const method = editTarget.value?.id ? 'put' : 'post'
  const id = await api[method]('rest/project', payload)
  saving.value = false
  if (id !== null) {
    editDialog.value = false
    if (!editTarget.value?.id && typeof id !== 'object') {
      // Creation returned a numeric id — navigate to the detail view
      router.push(`/home/project/${id}`)
    } else {
      dt.load(lastOptions)
    }
  }
}

async function confirmDelete() {
  if (dt.demoMode.value) {
    deleteDialog.value = false
    return
  }
  deleting.value = true
  const qs = deleteWithData.value ? '?deleteRemoteData=true' : ''
  await api.del(`rest/project/${deleteTarget.value.id}${qs}`)
  deleting.value = false
  deleteDialog.value = false
  dt.load(lastOptions)
}

onMounted(() => {
  app.setTitle('Projects')
  app.setBreadcrumbs([{ title: 'Home', to: '/' }, { title: 'Projects' }])
})
</script>

<style scoped>
.search-field {
  min-width: 200px;
  max-width: 300px;
  flex: 1 1 200px;
}
</style>
