<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="startCreate">{{ t('system.node.new') }}</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <LigojDataTable filename="nodes.csv" :headers="headers" :items="items" :loading="loading" :items-per-page="-1" hide-default-footer density="compact">
      <template #header.id="{ column }"><span class="d-inline-flex align-center"><v-icon size="small" class="mr-1">mdi-identifier</v-icon>{{ column.title }}<v-tooltip activator="parent" location="top" :text="column.title" /></span></template>
      <template #header.mode="{ column }"><span class="d-inline-flex align-center"><v-icon size="small" class="mr-1">mdi-cog-outline</v-icon>{{ column.title }}<v-tooltip activator="parent" location="top" :text="column.title" /></span></template>
      <template #header.enabled="{ column }"><span class="d-inline-flex align-center"><v-icon size="small" class="mr-1">mdi-power</v-icon>{{ column.title }}<v-tooltip activator="parent" location="top" :text="column.title" /></span></template>
      <template #item.icon="{ item }">
        <NodeIcon :node="item" />
      </template>
      <template #item.type="{ item }">
        <v-tooltip :text="typeLabel(item)" location="top">
          <template #activator="{ props: tt }">
            <v-icon v-bind="tt" size="small" :icon="TYPE_ICONS[nodeType(item)] || 'mdi-help-circle-outline'" />
          </template>
        </v-tooltip>
      </template>
      <template #item.id="{ item }">
        <code>{{ item.id }}</code>
      </template>
      <template #item.mode="{ item }">
        <NodeModeChip :mode="item.mode || 'all'" />
      </template>
      <template #item.enabled="{ item }">
        <v-chip size="x-small" :color="item.enabled ? 'success' : 'error'" variant="tonal">
          <v-icon start size="x-small">{{ item.enabled ? 'mdi-check' : 'mdi-close' }}</v-icon>
          {{ item.enabled ? t('system.node.statusEnabled') : t('system.node.statusDisabled') }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <template v-if="isInstance(item)">
          <v-btn icon size="small" variant="text" @click="startEdit(item)" :title="t('common.edit')">
            <v-icon size="small">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top" :text="t('common.edit')" />
          </v-btn>
          <v-btn icon size="small" variant="text" color="error" @click="startDelete(item)" :title="t('common.delete')">
            <v-icon size="small">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top" :text="t('common.delete')" />
          </v-btn>
        </template>
      </template>
    </LigojDataTable>

    <v-dialog v-model="editDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-server-network</v-icon>
          <span>{{ t('system.node.editTitle') }}</span>
          <code v-if="editTarget" class="text-body-2">{{ editTarget.id }}</code>
        </v-card-title>
        <v-card-text class="pa-4">
          <SubscribeWizardView v-if="editDialog && editTarget" :key="editTarget.id" mode="edit-node" :node="editTarget" @saved="onEditSaved" @cancel="editDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-server-network</v-icon>
          <span>{{ t('system.node.createTitle') }}</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <SubscribeWizardView v-if="createDialog" mode="create-node" @saved="onCreateSaved" @cancel="createDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="460">
      <v-card>
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="primary">mdi-server-network</v-icon>
          <span>{{ t('system.node.deleteTitle') }}</span>
        </v-card-title>
        <v-card-text>
          {{ t('system.node.deleteConfirm', { name: deleteTarget?.name || '', id: deleteTarget?.id || '' }) }}
        </v-card-text>
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
import { useApi, useAppStore, useI18nStore, LigojDataTable, NodeIcon, NodeModeChip, isInstance, nodeType } from '@ligoj/host'
import SubscribeWizardView from './SubscribeWizardView.vue'

const api = useApi()
const app = useAppStore()
const { t } = useI18nStore()

// Visual classification of a node by id depth. The NodeIcon column
// shows the tool's branding icon; this column shows what KIND of
// node the row is. Sort is driven by `TYPE_ORDER` (service first,
// instances last) via the header's `value` getter.
const TYPE_ICONS = {
  service:  'mdi-cube-outline',
  feature:  'mdi-puzzle-outline',
  tool:     'mdi-hammer-wrench',
  instance: 'mdi-server-outline',
}
const TYPE_ORDER = { service: 1, feature: 2, tool: 3, instance: 4 }
function typeLabel(item) {
  const k = nodeType(item)
  return t('system.node.type' + k.charAt(0).toUpperCase() + k.slice(1))
}

const items = ref([])
const loading = ref(false)
const error = ref(null)

const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const editDialog = ref(false)
const editTarget = ref(null)

const createDialog = ref(false)

const headers = computed(() => [
  { title: '',                                key: 'icon',    sortable: false, width: '40px', align: 'center' },
  // Synthesised column: `value` returns the sort rank so rows group
  // by kind (service → feature → tool → instance) instead of
  // alphabetical type names.
  { title: t('system.node.headerType'),       key: 'type',    sortable: true,  width: '60px', align: 'center',
    value: (item) => TYPE_ORDER[nodeType(item)] ?? 99, tooltip: t('system.node.headerType') },
  { title: t('system.node.headerIdentifier'), key: 'id',      sortable: true },
  { title: t('system.node.headerName'),       key: 'name',    sortable: true, width: '260px' },
  { title: t('system.node.headerMode'),       key: 'mode',    sortable: true, width: '120px' },
  { title: t('system.node.headerStatus'),     key: 'enabled', sortable: true, width: '120px' },
  { title: '',                                key: 'actions', sortable: false, width: '120px', align: 'end' },
])

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

function startCreate() {
  createDialog.value = true
}

function onCreateSaved() {
  createDialog.value = false
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
    [{ title: t('system.breadcrumb'), to: '/system' }, { title: t('system.node.title') }],
    { refresh: load },
  )
  load()
})
</script>
