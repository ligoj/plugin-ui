<template>
  <div>
    <v-skeleton-loader v-if="loading && !project" type="card, list-item-two-line@3" />

    <template v-if="project">
      <!-- Header -->
      <div class="d-flex align-start flex-wrap ga-2 mb-4">
        <div>
          <h1 class="text-h4">
            {{ project.name }}
            <span class="text-h6 text-medium-emphasis">({{ project.pkey }})</span>
          </h1>
          <p v-if="project.description" class="text-body-2 text-medium-emphasis mt-1">
            {{ project.description }}
          </p>
        </div>
        <v-spacer />
        <v-btn
          v-if="project.manageSubscriptions"
          color="primary"
          prepend-icon="mdi-plus"
          :to="`/home/project/${project.id}/subscription`"
        >
          Add subscription
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-pencil" @click="editDialog = true">
          Edit
        </v-btn>
      </div>

      <!-- Audit metadata -->
      <v-card variant="tonal" class="mb-4">
        <v-card-text class="py-2">
          <div class="d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis">
            <span v-if="project.teamLeader">
              <v-icon size="small" class="mr-1">mdi-account-star</v-icon>
              <strong>Manager:</strong>
              {{ getFullName(project.teamLeader) }}
              <span v-if="project.teamLeader.id" class="ml-1">({{ project.teamLeader.id }})</span>
            </span>
            <span v-if="project.createdDate">
              <v-icon size="small" class="mr-1">mdi-calendar-plus</v-icon>
              <strong>Created:</strong> {{ formatDate(project.createdDate) }}
              <span v-if="project.createdBy" class="ml-1">
                by {{ project.createdBy.id || project.createdBy }}
              </span>
            </span>
            <span v-if="project.lastModifiedDate">
              <v-icon size="small" class="mr-1">mdi-calendar-edit</v-icon>
              <strong>Updated:</strong> {{ formatDate(project.lastModifiedDate) }}
              <span v-if="project.lastModifiedBy" class="ml-1">
                by {{ project.lastModifiedBy.id || project.lastModifiedBy }}
              </span>
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Subscriptions -->
      <div class="d-flex align-center mb-2">
        <h2 class="text-h6">Subscriptions</h2>
        <v-chip class="ml-2" size="small" variant="tonal">{{ subscriptions.length }}</v-chip>
      </div>

      <v-alert
        v-if="subscriptions.length === 0"
        type="info"
        variant="tonal"
        density="compact"
      >
        No subscriptions attached to this project.
      </v-alert>

      <v-data-table
        v-else
        :headers="subHeaders"
        :items="subscriptions"
        item-value="id"
        :items-per-page="-1"
        hide-default-footer
        density="compact"
      >
        <template #item.service="{ item }">
          <v-chip size="small" variant="tonal" :color="serviceColor(item)">
            <v-icon start size="small">{{ serviceIcon(item) }}</v-icon>
            {{ item.node?.refined?.refined?.name || '—' }}
          </v-chip>
        </template>
        <template #item.tool="{ item }">
          {{ item.node?.refined?.name || '—' }}
        </template>
        <template #item.node="{ item }">
          <code>{{ item.node?.id }}</code>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="project.manageSubscriptions"
            icon
            size="small"
            variant="text"
            color="error"
            @click="startUnsubscribe(item)"
            :title="'Unsubscribe'"
          >
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </template>

    <!-- Edit dialog (same shape as ProjectListView) -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Edit project</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field
              v-model="editForm.name"
              label="Name"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="editForm.pkey"
              label="Project key (pkey)"
              :rules="[rules.required]"
              :disabled="(project?.nbSubscriptions || subscriptions.length) > 0"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="editForm.teamLeader"
              label="Team leader (user id)"
              :rules="[rules.required]"
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

    <!-- Unsubscribe confirmation -->
    <v-dialog v-model="unsubDialog" max-width="480">
      <v-card>
        <v-card-title>Unsubscribe</v-card-title>
        <v-card-text>
          <p class="mb-3">
            Remove subscription to <strong>{{ unsubTarget?.node?.name }}</strong>?
          </p>
          <v-checkbox
            v-model="unsubWithData"
            label="Also delete remote data on the target service"
            density="compact"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="unsubDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" :loading="unsubLoading" @click="confirmUnsubscribe">
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi, useAppStore, useErrorStore } from '@ligoj/host'
import { getFullName } from '../useUiHelpers.js'

const route = useRoute()
const router = useRouter()
const api = useApi()
const app = useAppStore()
const errorStore = useErrorStore()

const loading = ref(false)
const project = ref(null)
const subscriptions = computed(() => project.value?.subscriptions || [])

const formRef = ref(null)
const editDialog = ref(false)
const editForm = ref({ name: '', pkey: '', teamLeader: '', description: '' })
const saving = ref(false)

const unsubDialog = ref(false)
const unsubTarget = ref(null)
const unsubWithData = ref(false)
const unsubLoading = ref(false)

const rules = {
  required: (v) => !!v || 'Required',
}

const subHeaders = [
  { title: 'Service', key: 'service', sortable: false, width: '180px' },
  { title: 'Tool',    key: 'tool',    sortable: false, width: '180px' },
  { title: 'Node',    key: 'node',    sortable: false },
  { title: '',        key: 'actions', sortable: false, width: '60px', align: 'end' },
]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16).replace('T', ' ')
}

/** Stable per-service colour for the service chip. */
function serviceColor(sub) {
  const service = sub.node?.refined?.refined?.id || ''
  const palette = ['primary', 'teal', 'indigo', 'purple', 'orange', 'blue-grey']
  // Simple deterministic bucket based on name length + char code sum
  let n = 0
  for (const ch of service) n += ch.charCodeAt(0)
  return palette[n % palette.length]
}

function serviceIcon(sub) {
  const service = sub.node?.refined?.refined?.id || ''
  // Heuristic mapping for common built-in services.
  if (service.includes(':scm:')) return 'mdi-source-branch'
  if (service.includes(':build:')) return 'mdi-hammer-wrench'
  if (service.includes(':bt')) return 'mdi-bug'
  if (service.includes(':km:')) return 'mdi-book-open-variant'
  if (service.includes(':vm')) return 'mdi-server'
  if (service.includes(':prov')) return 'mdi-cloud'
  if (service.includes(':id')) return 'mdi-account-group'
  if (service.includes(':inbox:')) return 'mdi-email'
  return 'mdi-puzzle'
}

async function loadProject() {
  loading.value = true
  const id = route.params.id
  const data = await api.get(`rest/project/${id}`)
  project.value = data || null
  loading.value = false

  if (data) {
    editForm.value = {
      name: data.name || '',
      pkey: data.pkey || '',
      teamLeader: data.teamLeader?.id || '',
      description: data.description || '',
    }
    app.setTitle(data.name)
    app.setBreadcrumbs([
      { title: 'Home', to: '/' },
      { title: 'Projects', to: '/home/project' },
      { title: data.name },
    ])
  }
}

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  const payload = {
    id: project.value.id,
    name: editForm.value.name,
    pkey: editForm.value.pkey,
    teamLeader: editForm.value.teamLeader,
    description: editForm.value.description,
  }
  await api.put('rest/project', payload)
  saving.value = false
  editDialog.value = false
  await loadProject()
}

function startUnsubscribe(sub) {
  unsubTarget.value = sub
  unsubWithData.value = false
  unsubDialog.value = true
}

async function confirmUnsubscribe() {
  unsubLoading.value = true
  await api.del(`rest/subscription/${unsubTarget.value.id}/${unsubWithData.value ? 'true' : 'false'}`)
  unsubLoading.value = false
  unsubDialog.value = false
  await loadProject()
}

// Reload when the :id changes (e.g. navigating from one project to another).
watch(() => route.params.id, (id) => {
  if (id) loadProject()
})

onMounted(loadProject)
</script>
