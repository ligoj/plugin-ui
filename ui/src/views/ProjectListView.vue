<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4 ga-2">
      <v-spacer />
      <v-text-field v-model="dt.search.value" prepend-inner-icon="mdi-magnify" label="Search" variant="outlined" density="compact" hide-details class="search-field" @update:model-value="onSearch" />
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

    <v-skeleton-loader v-if="dt.loading.value && dt.items.value.length === 0" type="table-heading, table-row@5" class="mb-4" />

    <LigojDataTableServer filename="projects.csv" :fetch-all="dt.loadAll" v-if="!dt.error.value" v-show="dt.items.value.length > 0 || !dt.loading.value" v-model:items-per-page="itemsPerPage"
      :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value" item-value="id" hover @update:options="loadData"
      @click:row="(_, { item }) => router.push(`/home/project/${item.id}`)">
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
    </LigojDataTableServer>

    <!-- Create / edit dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>{{ editTarget?.id ? 'Edit project' : 'New project' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field v-model="editForm.name" label="Name" :rules="[rules.required]" variant="outlined" class="mb-2" autofocus @update:model-value="onNameChanged" />
            <v-text-field v-model="editForm.pkey" label="Project key (pkey)" :rules="[rules.required, rules.pkey]" :disabled="editTarget?.nbSubscriptions > 0"
              :hint="editTarget?.nbSubscriptions > 0 ? 'Locked — project has subscriptions' : 'lowercase, digits, dash'" persistent-hint variant="outlined" class="mb-2" />
            <!-- Auto-suggest for the team leader.
                 Queries rest/system/user/roles as the user types (debounced).
                 The v-model stores the user's login as a string, matching
                 what the rest/project endpoint expects in the payload. -->
            <v-autocomplete
              v-model="editForm.teamLeader"
              :items="userSearchResults"
              :loading="userSearchLoading"
              :search="userSearchQuery"
              item-title="login"
              item-value="login"
              label="Team leader"
              :rules="[rules.required]"
              hint="Tape quelques lettres pour chercher un utilisateur"
              persistent-hint
              variant="outlined"
              class="mb-2"
              no-filter
              clearable
              @update:search="onUserSearch"
            >
              <template #item="{ props: itemProps, item }">
                <!-- Vuetify v4: the `item` slot scope is the RAW object directly
                     (the normalized wrapper is exposed as `internalItem`).
                     So we read `item.login` / `item.roles`, not `item.raw.…`. -->
                <v-list-item v-bind="itemProps">
                  <template #title>
                    <span style="color: rgb(var(--v-theme-on-surface));">
                      {{ item?.login || '(no login)' }}
                    </span>
                  </template>
                  <template #subtitle>
                    <v-chip
                      v-for="r in (item?.roles || [])"
                      :key="r.id"
                      size="x-small"
                      variant="tonal"
                      class="mr-1"
                    >
                      {{ r.name }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ userSearchQuery ? 'Aucun utilisateur trouvé' : 'Tape des lettres pour chercher' }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-textarea v-model="editForm.description" label="Description" rows="3" variant="outlined" class="mb-2" />
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
          <v-checkbox v-model="deleteWithData" label="Also remove remote data associated with this project's subscriptions" density="compact" hide-details />
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
import { useApi, useAppStore, useDataTable, useI18nStore, LigojDataTableServer } from '@ligoj/host'
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

// --- Team leader auto-suggest state ---
const userSearchQuery = ref('')
const userSearchResults = ref([])
const userSearchLoading = ref(false)
let userSearchDebounce = null

const headers = computed(() => [
  { title: t('project.name'),          key: 'name',            sortable: true,  width: '220px' },
  { title: t('project.description'),   key: 'description',     sortable: false },
  { title: t('project.teamLeader'),    key: 'teamLeader',      sortable: false, width: '220px' },
  { title: t('project.created'),       key: 'createdDate',     sortable: true,  width: '140px' },
  { title: t('project.subscriptions'), key: 'nbSubscriptions', sortable: false, width: '80px', align: 'center', tooltip: t('project.subscriptionsTooltip') },
  { title: '',                         key: 'actions',         sortable: false, width: '120px', align: 'end' },
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

// --- Team leader auto-suggest logic ---

/**
 * Called on every keystroke in the autocomplete. We debounce so the
 * backend doesn't get spammed: one request per 300 ms of idle typing.
 */
function onUserSearch(query) {
  userSearchQuery.value = query || ''
  clearTimeout(userSearchDebounce)
  userSearchDebounce = setTimeout(() => searchUsers(query), 300)
}

async function searchUsers(query) {
  if (!query || query.length < 1) {
    userSearchResults.value = []
    return
  }
  userSearchLoading.value = true
  try {
    // Direct URL with un-encoded brackets — the legacy DataTables backend
    // expects `search[value]=...` literally, URLSearchParams would percent-
    // encode the brackets and break the matching.
    const url = `rest/system/user/roles?search[value]=${encodeURIComponent(query)}&rows=20&page=1&sidx=login&sord=asc`
    const resp = await api.get(url)
    // Defensive : api.get may return the wrapper { data: [...] } or the
    // array directly depending on the endpoint's content-type handling.
    const arr = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : [])
    userSearchResults.value = arr
  } catch (err) {
    console.error('Team leader search failed:', err)
    userSearchResults.value = []
  } finally {
    userSearchLoading.value = false
  }
}

/**
 * When editing an existing project, the teamLeader is already set but the
 * autocomplete's item list is empty — so the chip wouldn't display a label.
 * This seeds the list with the current user so the UI is coherent on open.
 */
async function ensureCurrentUserInResults(login) {
  if (!login) return
  try {
    const url = `rest/system/user/roles?search[value]=${encodeURIComponent(login)}&rows=5&page=1&sidx=login&sord=asc`
    const resp = await api.get(url)
    const users = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : [])
    userSearchResults.value = users.length ? users : [{ login, roles: [] }]
  } catch {
    userSearchResults.value = [{ login, roles: [] }]
  }
}

function openNew() {
  editTarget.value = null
  editForm.value = { name: '', pkey: '', teamLeader: '', description: '' }
  lastPkeyAuto = ''
  userSearchResults.value = []
  userSearchQuery.value = ''
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
  userSearchQuery.value = ''
  userSearchResults.value = []
  ensureCurrentUserInResults(item.teamLeader?.id)
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
  app.setBreadcrumbs(
    [{ title: 'Home', to: '/' }, { title: 'Projects' }],
    { refresh: () => dt.load(lastOptions) },
  )
})
</script>

<style scoped>
.search-field {
  min-width: 200px;
  max-width: 300px;
  flex: 1 1 200px;
}
</style>

<style>
/*
 * Safety net for the ligojLight custom theme: --v-theme-on-surface-variant
 * is set to a near-white grey, making v-list-item titles/subtitles
 * invisible inside autocomplete dropdowns. We force a readable colour
 * on the standard Vuetify class that wraps every autocomplete content
 * (`v-autocomplete__content`). `!important` wins over @layer-scoped
 * Vuetify defaults. Non-scoped intentionally — the v-menu content is
 * teleported to <body>, so scoped CSS never reaches it.
 */
.v-autocomplete__content .v-list-item-title {
  color: rgb(var(--v-theme-on-surface)) !important;
}
.v-autocomplete__content .v-list-item-subtitle {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.7;
}
</style>
