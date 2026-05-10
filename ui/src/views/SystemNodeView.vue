<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" to="/subscribe">New subscription</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="nodes.csv" :headers="headers" :items="items" :loading="loading" :items-per-page="-1" hide-default-footer density="compact">
      <template #item.icon="{ item }">
        <NodeIcon :node="item" />
      </template>
      <template #item.id="{ item }">
        <code>{{ item.id }}</code>
      </template>
      <template #item.status="{ item }">
        <v-chip v-if="item.status" size="x-small" :color="statusColor(item.status)" variant="tonal">{{ item.status }}</v-chip>
      </template>
      <template #item.actions="{ item }">
        <template v-if="isTool(item)">
          <v-btn icon size="small" variant="text" @click="startEdit(item)" title="Edit">
            <v-icon size="small">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)" title="Delete">
            <v-icon size="small">mdi-delete</v-icon>
          </v-btn>
        </template>
      </template>
    </LigojDataTable>

    <v-dialog v-model="editDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <span>Edit node</span>
          <code v-if="editTarget" class="text-body-2">{{ editTarget.id }}</code>
        </v-card-title>
        <v-card-text class="pa-4">
          <SubscribeWizardView
            v-if="editDialog && editTarget"
            :key="editTarget.id"
            mode="edit-node"
            :node="editTarget"
            @saved="onEditSaved"
            @cancel="editDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

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
import { useApi, useAppStore, LigojDataTable, NodeIcon } from '@ligoj/host'
import SubscribeWizardView from './SubscribeWizardView.vue'

const api = useApi()
const app = useAppStore()

const items = ref([])
const loading = ref(false)
const error = ref(null)

const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const editDialog = ref(false)
const editTarget = ref(null)

const headers = [
  { title: '', key: 'icon', sortable: false, width: '40px', align: 'center' },
  { title: 'Identifier', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true, width: '260px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: '', key: 'actions', sortable: false, width: '60px', align: 'end' },
]

/**
 * Tool-level nodes have a 3-segment id (`<service|feature>:<service>:<tool>`).
 * Service-level (2 segments) and instance-level (4 segments) nodes are
 * either plugin-shipped roots or subscription-owned and shouldn't be
 * edited/deleted from this list.
 */
function isTool(item) {
  return (item?.id?.split(':').length || 0) === 3
}

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

function startEdit(item) {
  editTarget.value = item
  editDialog.value = true
}

function onEditSaved() {
  editDialog.value = false
  load()
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
  app.setBreadcrumbs(
    [{ title: 'System', to: '/system' }, { title: 'Nodes' }],
    { refresh: load },
  )
  load()
})
</script>
