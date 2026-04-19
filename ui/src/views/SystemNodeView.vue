<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">Nodes</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" to="/subscribe">New subscription</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
    >
      <template #item.id="{ item }">
        <code>{{ item.id }}</code>
      </template>
      <template #item.status="{ item }">
        <v-chip
          v-if="item.status"
          size="x-small"
          :color="statusColor(item.status)"
          variant="tonal"
        >{{ item.status }}</v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)">
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="deleteDialog" max-width="460">
      <v-card>
        <v-card-title>Delete node</v-card-title>
        <v-card-text>
          Delete <strong>{{ deleteTarget?.name }}</strong>
          (<code>{{ deleteTarget?.id }}</code>)?
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
import { useApi, useAppStore } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const items = ref([])
const loading = ref(false)
const error = ref(null)

const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const headers = [
  { title: 'Identifier', key: 'id',      sortable: true },
  { title: 'Name',       key: 'name',    sortable: true,  width: '260px' },
  { title: 'Status',     key: 'status',  sortable: true,  width: '120px' },
  { title: '',           key: 'actions', sortable: false, width: '60px', align: 'end' },
]

function statusColor(status) {
  const s = status?.toLowerCase?.()
  if (s === 'up') return 'success'
  if (s === 'down') return 'error'
  if (s === 'unknown') return 'warning'
  return 'grey'
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/node')
  items.value = Array.isArray(data) ? data : (data?.data || [])
  loading.value = false
}

function startDelete(item) {
  deleteTarget.value = item
  deleteDialog.value = true
}

async function confirmDelete() {
  deleting.value = true
  await api.del(`rest/node/${encodeURIComponent(deleteTarget.value.id)}`)
  deleting.value = false
  deleteDialog.value = false
  load()
}

onMounted(() => {
  app.setTitle('Nodes')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Nodes' }])
  load()
})
</script>
