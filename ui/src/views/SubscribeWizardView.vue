<template>
  <div>
    <template v-if="!isEdit">
      <div class="d-flex align-center mb-4">
        <v-spacer />
        <v-btn variant="text" :to="cancelTo">Cancel</v-btn>
      </div>

      <v-alert v-if="!projectId" type="info" variant="tonal" density="compact" class="mb-4">
        No project selected. The wizard needs a project —
        <router-link to="/home/project">pick one</router-link>,
        then open this page from the project's "Add subscription" button.
      </v-alert>

      <v-alert v-else-if="loadingProject" type="info" variant="tonal" density="compact" class="mb-4">
        Loading project…
      </v-alert>

      <v-alert v-else-if="project" type="info" variant="tonal" density="compact" class="mb-4">
        Adding a subscription to <strong>{{ project.name }}</strong> ({{ project.pkey }}).
        <br>
        <span class="text-caption text-warning">
          Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.
        </span>
      </v-alert>
    </template>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-form v-if="isEdit || project" ref="formRef" class="form-stack" @submit.prevent="submit">
      <!-- 1. Service ------------------------------------------------------ -->
      <v-card variant="tonal" class="mb-4">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-room-service-outline</v-icon>
            <span>1. Service</span>
            <v-progress-circular v-if="loadingServices" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p class="text-body-2 text-medium-emphasis mb-3">
            A service groups features implemented by one or more tools.
          </p>
          <template v-if="isEdit && selected.service">
            <NodeIcon :node="selected.service" chip text />
            <v-text-field
              v-if="editType === 'service' || editType === 'feature'"
              v-model="editForm.name"
              label="Name"
              maxlength="250"
              variant="outlined"
              density="compact"
              class="mt-3"
              :rules="[rules.required]"
            />
          </template>
          <v-select v-else v-model="selected.service" :items="services" item-title="name" item-value="id" return-object label="Service" variant="outlined" density="compact" :loading="loadingServices"
            :rules="[rules.required]">
            <template #selection="{ item }">
              <span class="d-inline-flex align-center ga-2">
                <NodeIcon :node="item.raw" /> {{ item.raw.name || item.raw.id }}
              </span>
            </template>
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :title="item.raw.name || item.raw.id">
                <template #prepend>
                  <NodeIcon :node="item.raw" class="mr-3" />
                </template>
                <template #subtitle>
                  <code class="text-caption">{{ item.raw.id }}</code>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-card-text>
      </v-card>

      <!-- 2. Tool --------------------------------------------------------- -->
      <v-card v-if="!isEdit || editType === 'tool' || editType === 'instance'" variant="tonal" class="mb-4" :disabled="!isEdit && !selected.service">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-wrench</v-icon>
            <span>2. Tool</span>
            <v-progress-circular v-if="loadingTools" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p v-if="!isEdit" class="text-body-2 text-medium-emphasis mb-3">
            A tool is one implementation of the service; several instances may be deployed.
          </p>
          <template v-if="isEdit && selected.tool">
            <NodeIcon :node="selected.tool" chip text />
            <v-text-field
              v-if="editType === 'tool'"
              v-model="editForm.name"
              label="Name"
              maxlength="250"
              variant="outlined"
              density="compact"
              class="mt-3"
              :rules="[rules.required]"
            />
          </template>
          <v-select v-else v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object label="Tool" variant="outlined" density="compact" :loading="loadingTools"
            :disabled="!selected.service" :rules="selected.service ? [rules.required] : []">
            <template #selection="{ item }">
              <span class="d-inline-flex align-center ga-2">
                <NodeIcon :node="item.raw" /> {{ item.raw.name || item.raw.id }}
              </span>
            </template>
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :title="item.raw.name || item.raw.id">
                <template #prepend>
                  <NodeIcon :node="item.raw" class="mr-3" />
                </template>
                <template #subtitle>
                  <code class="text-caption">{{ item.raw.id }}</code>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-card-text>
      </v-card>

      <!-- 3. Instance (existing or new) ----------------------------------- -->
      <v-card v-if="!isEdit || editType === 'instance'" variant="tonal" class="mb-4" :disabled="!isEdit && !selected.tool">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-server</v-icon>
            <span>3. Instance</span>
            <v-progress-circular v-if="loadingNodes" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p v-if="!isEdit" class="text-body-2 text-medium-emphasis mb-3">
            An instance is a running node of the tool. Pick an existing one or declare a new one.
          </p>

          <template v-if="isEdit && selected.node">
            <div class="d-flex align-center ga-2 mb-1">
              <NodeIcon :node="selected.node" />
              <code>{{ selected.node.id }}</code>
            </div>
            <v-text-field
              v-model="editForm.name"
              label="Name"
              maxlength="250"
              variant="outlined"
              density="compact"
              class="mt-3"
              :rules="[rules.required]"
            />
          </template>

          <div v-else class="d-flex align-start ga-2">
            <v-select v-model="selected.node" :items="nodes" item-title="name" item-value="id" return-object label="Instance" variant="outlined" density="compact" :loading="loadingNodes"
              :disabled="!selected.tool || showNewNode" :rules="!showNewNode && selected.tool ? [rules.required] : []" class="flex-grow-1">
              <template #selection="{ item }">
                <span class="d-inline-flex align-center ga-2">
                  <NodeIcon :node="item.raw" /> {{ item.raw.name || item.raw.id }}
                </span>
              </template>
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :title="item.raw.name || item.raw.id">
                  <template #prepend>
                    <NodeIcon :node="item.raw" class="mr-3" />
                  </template>
                  <template #subtitle>
                    <code class="text-caption">{{ item.raw.id }}</code>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-btn variant="outlined" :prepend-icon="showNewNode ? 'mdi-close' : 'mdi-plus'" :disabled="!selected.tool" @click="toggleNewNode">
              {{ showNewNode ? 'Pick existing' : 'New instance' }}
            </v-btn>
          </div>

          <v-expand-transition>
            <div v-if="showNewNode" class="new-node-form mt-3 pa-3">
              <p class="text-caption text-medium-emphasis mb-2">
                Declares a node under <code>{{ selected.tool?.id }}</code>. Tool-specific
                parameters can be added later via <strong>System → Nodes</strong>.
              </p>
              <v-text-field v-model="newNode.id" label="ID" :hint="`Suggested: ${selected.tool?.id}:my-instance`" persistent-hint variant="outlined" density="compact" class="mb-2"
                :rules="showNewNode ? [rules.required, rules.nodeId] : []" />
              <v-text-field v-model="newNode.name" label="Name" variant="outlined" density="compact" class="mb-2" :rules="showNewNode ? [rules.required] : []" />
              <v-alert v-if="newNodeError" type="warning" variant="tonal" density="compact" class="mb-2">
                {{ newNodeError }}
              </v-alert>
              <v-btn color="primary" :loading="creatingNode" :disabled="!newNode.id || !newNode.name" @click="createNode">
                Create instance
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>

      <!-- 4. Mode --------------------------------------------------------- -->
      <v-card variant="tonal" class="mb-4" :disabled="!isEdit && !selected.node">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-link-variant</v-icon>
            <span>4. Mode</span>
          </div>
          <p v-if="!isEdit" class="text-body-2 text-medium-emphasis mb-3">
            <strong>Link</strong> attaches this project to an existing instance.
            <strong>Create</strong> additionally provisions a new instance inside the tool.
          </p>
          <NodeModeChip v-if="isEdit" :mode="selected.mode" size="small" />
          <v-radio-group v-else v-model="selected.mode" inline :rules="selected.node ? [rules.required] : []" hide-details>
            <v-radio v-for="m in availableModes" :key="m.value" :value="m.value">
              <template #label>
                <span class="d-inline-flex align-center ga-2">
                  <NodeModeChip :mode="m.value" size="small" />
                  <span class="text-body-2 text-medium-emphasis">{{ m.description }}</span>
                </span>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- 5. Parameters --------------------------------------------------- -->
      <v-card variant="tonal" class="mb-4" :disabled="!isEdit && (!selected.node || !selected.mode)">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-tune</v-icon>
            <span>5. Parameters</span>
            <v-progress-circular v-if="loadingParams" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p v-if="!isEdit" class="text-body-2 text-medium-emphasis mb-3">
            Values required to link the project to
            <code v-if="selected.node">{{ selected.node.id }}</code>
            <span v-else>the chosen instance</span>.
          </p>
          <p v-else class="text-body-2 text-medium-emphasis mb-3">
            Configuration values bound to <code>{{ node?.id }}</code>.
          </p>

          <v-alert v-if="!loadingParams && (isEdit || (selected.node && selected.mode)) && parameters.length === 0" type="info" variant="tonal" density="compact">
            {{ isEdit ? 'No parameters configured for this node.' : 'This subscription requires no additional parameters.' }}
          </v-alert>

          <div v-for="p in parameters" :key="p.id" class="mb-3">
            <v-text-field v-if="isTextParam(p)" v-model="paramValues[p.id]" :type="isPassword(p) ? 'password' : 'text'" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="p.description" persistent-hint
              variant="outlined" density="compact" />

            <v-text-field v-else-if="p.type === 'integer'" v-model.number="paramValues[p.id]" type="number" :min="p.min" :max="p.max" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="p.description"
              persistent-hint variant="outlined" density="compact" />

            <v-checkbox v-else-if="p.type === 'bool'" v-model="paramValues[p.id]" :label="paramLabel(p)" :hint="p.description" persistent-hint density="compact" />

            <v-select v-else-if="p.type === 'select'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="p.description" persistent-hint
              variant="outlined" density="compact" />

            <v-select v-else-if="p.type === 'multiselect' || p.type === 'tags'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="p.description"
              persistent-hint chips multiple variant="outlined" density="compact" />

            <v-text-field v-else v-model="paramValues[p.id]" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="`${p.description || ''} [${p.type}]`" persistent-hint variant="outlined"
              density="compact" />
          </div>
        </v-card-text>
      </v-card>

      <!-- Actions --------------------------------------------------------- -->
      <div class="d-flex align-center ga-2">
        <v-btn v-if="isEdit" variant="text" :disabled="creating" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn v-else variant="text" :to="cancelTo" :disabled="creating">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="isEdit" type="submit" color="primary" prepend-icon="mdi-content-save" :loading="creating">
          Save
        </v-btn>
        <v-btn v-else type="submit" color="success" prepend-icon="mdi-check" :loading="creating" :disabled="!ready">
          Create subscription
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi, useAppStore, useErrorStore, NodeIcon, NodeModeChip, nodeType } from '@ligoj/host'

const props = defineProps({
  /** 'subscribe' (default route view) or 'edit-node' (popup over an existing node). */
  mode: { type: String, default: 'subscribe' },
  /** Required when mode === 'edit-node': the node being edited. */
  node: { type: Object, default: null },
})
const emit = defineEmits(['saved', 'cancel'])
const isEdit = computed(() => props.mode === 'edit-node')
/**
 * Type of the node being edited — drives which cards are shown in edit
 * mode and where the editable Name field lives. `nodeType()` derives
 * this from the id structure (`<service|feature>:<service>[:<tool>[:<instance>]]`).
 */
const editType = computed(() => isEdit.value ? nodeType(props.node) : null)

const route = useRoute()
const router = useRouter()
const api = useApi()
const app = useAppStore()
const errorStore = useErrorStore()

const projectId = computed(() => isEdit.value ? null : (route.query.project ?? route.params.id ?? null))

/** In edit mode the dialog edits a node's name + parameters. */
const editForm = reactive({ name: '' })

const project = ref(null)
const loadingProject = ref(false)
const error = ref(null)

/* ------------- selection state ------------- */

const selected = reactive({
  service: null,
  tool: null,
  node: null,
  mode: null,
})

const services = ref([])
const tools = ref([])
const nodes = ref([])
const parameters = ref([])
const paramValues = reactive({})
const formRef = ref(null)

const loadingServices = ref(false)
const loadingTools = ref(false)
const loadingNodes = ref(false)
const loadingParams = ref(false)
const creating = ref(false)

/* ------------- new-instance state ---------- */

const showNewNode = ref(false)
const newNode = reactive({ id: '', name: '' })
const creatingNode = ref(false)
const newNodeError = ref(null)

const cancelTo = computed(() =>
  project.value ? `/home/project/${project.value.id}` : '/home/project',
)

const availableModes = computed(() => {
  const m = selected.tool?.mode
  const result = []
  if (m === 'all' || m === 'create') {
    result.push({ value: 'create', description: 'provision a new object inside the instance' })
  }
  if (m === 'all' || m === 'link' || !m) {
    result.push({ value: 'link', description: 'attach this project to an existing object' })
  }
  return result
})

/** Submit button enabled only when every prerequisite is filled in. */
const ready = computed(() =>
  !!projectId.value
  && !!selected.service
  && !!selected.tool
  && !!selected.node
  && !!selected.mode
  && !showNewNode.value,
)

/* ------------- validation rules ------------ */

const rules = {
  required: (v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || 'Required',
  nodeId: (v) => /^[\w-]+(:[\w-]+)+$/.test(v || '') || 'Use the colon-separated form, e.g. service:scm:git:internal',
}

/* ------------- param helpers --------------- */

function isTextParam(p) {
  return !p.type || p.type === 'text' || p.type === 'password' || p.type === 'node' || p.type === 'project'
}
function isPassword(p) {
  return p.type === 'password' || (p.name || '').toLowerCase().includes('password')
}
function paramLabel(p) {
  const req = p.mandatory || p.required ? ' *' : ''
  return `${p.name || p.id}${req}`
}
function ruleFor(p) {
  return (p.mandatory || p.required) ? [rules.required] : []
}

/* ------------- loaders --------------------- */

async function loadProject() {
  if (!projectId.value) return
  loadingProject.value = true
  const data = await api.get(`rest/project/${projectId.value}`)
  project.value = data || null
  loadingProject.value = false
}

async function loadServices() {
  loadingServices.value = true
  services.value = await fetchNodes('rest/node?refined=service&rows=1000')
  loadingServices.value = false
}

async function loadTools(serviceId) {
  loadingTools.value = true
  tools.value = await fetchNodes(`rest/node?refined=${encodeURIComponent(serviceId)}&rows=1000`)
  loadingTools.value = false
}

async function loadNodes(toolId) {
  loadingNodes.value = true
  nodes.value = await fetchNodes(`rest/node?refined=${encodeURIComponent(toolId)}&rows=1000`)
  loadingNodes.value = false
}

async function loadParameters(nodeId, mode) {
  loadingParams.value = true
  const data = await api.get(`rest/node/${encodeURIComponent(nodeId)}/parameter/${mode.toUpperCase()}`)
  parameters.value = Array.isArray(data) ? data : (data?.data || [])
  for (const key of Object.keys(paramValues)) delete paramValues[key]
  for (const p of parameters.value) {
    if (p.defaultValue != null) {
      paramValues[p.id] = coerceDefault(p)
    } else if (p.type === 'bool') {
      paramValues[p.id] = false
    } else if (p.type === 'multiselect' || p.type === 'tags') {
      paramValues[p.id] = []
    } else {
      paramValues[p.id] = ''
    }
  }
  loadingParams.value = false
}

function coerceDefault(p) {
  if (p.type === 'integer') return Number(p.defaultValue)
  if (p.type === 'bool') return p.defaultValue === true || p.defaultValue === 'true'
  return p.defaultValue
}

async function fetchNodes(url) {
  const data = await api.get(url)
  if (Array.isArray(data)) return filterEnabled(data)
  if (Array.isArray(data?.data)) return filterEnabled(data.data)
  return []
}

function filterEnabled(list) {
  return list.filter((n) => n.enabled !== false)
}

/* ------------- cascading invalidation ------ */

// Selecting a service invalidates everything below.
watch(() => selected.service, async (svc) => {
  if (isEdit.value) return
  selected.tool = null
  selected.node = null
  selected.mode = null
  tools.value = []
  nodes.value = []
  parameters.value = []
  showNewNode.value = false
  if (svc) await loadTools(svc.id)
})

// Selecting a tool invalidates instance + mode and refreshes both.
watch(() => selected.tool, async (tool) => {
  if (isEdit.value) return
  selected.node = null
  selected.mode = null
  nodes.value = []
  parameters.value = []
  showNewNode.value = false
  if (tool) {
    await loadNodes(tool.id)
    // If the tool only allows one mode, preselect it for convenience.
    const modes = availableModes.value
    if (modes.length === 1) selected.mode = modes[0].value
  }
})

// Picking a node clears params; loadParameters is triggered by the
// shared selected.mode watcher below to keep the call site singular.
watch(() => selected.node, () => {
  if (isEdit.value) return
  parameters.value = []
})

watch(() => selected.mode, async (mode) => {
  if (isEdit.value) return
  parameters.value = []
  if (selected.node && mode) {
    await loadParameters(selected.node.id, mode)
  }
})

/* ------------- new-instance flow ----------- */

function toggleNewNode() {
  showNewNode.value = !showNewNode.value
  newNodeError.value = null
  if (showNewNode.value) {
    selected.node = null
    if (!newNode.id && selected.tool?.id) {
      newNode.id = `${selected.tool.id}:`
    }
  } else {
    newNode.id = ''
    newNode.name = ''
  }
}

async function createNode() {
  newNodeError.value = null
  creatingNode.value = true
  try {
    const payload = {
      id: newNode.id,
      name: newNode.name,
      refined: selected.tool?.id,
    }
    const result = await api.post('rest/node', payload)
    if (result === null) {
      newNodeError.value = 'Backend rejected the new node — see the notification for details.'
      return
    }
    // Reload nodes and pick the freshly-created one.
    await loadNodes(selected.tool.id)
    const created = nodes.value.find((n) => n.id === newNode.id)
    if (created) {
      selected.node = created
    }
    showNewNode.value = false
    newNode.id = ''
    newNode.name = ''
  } finally {
    creatingNode.value = false
  }
}

/* ------------- submit ---------------------- */

async function submit() {
  const { valid } = formRef.value ? await formRef.value.validate() : { valid: true }
  if (!valid) return
  creating.value = true
  error.value = null

  if (isEdit.value) {
    const payload = {
      id: props.node.id,
      node: props.node.refined?.id,
      name: editForm.name,
      mode: selected.mode,
      untouchedParameters: false,
      parameters: parameters.value.map(buildParamWire).filter(Boolean),
    }
    const result = await api.put('rest/node', payload)
    creating.value = false
    if (result === false) {
      error.value = 'Save failed — please review the highlighted parameters.'
      return
    }
    errorStore.success(`Node "${payload.name}" updated`)
    emit('saved', { ...props.node, name: payload.name })
    return
  }

  const payload = {
    node: selected.node.id,
    project: Number(projectId.value),
    mode: selected.mode,
    parameters: parameters.value.map(buildParamWire).filter(Boolean),
  }
  const id = await api.post('rest/subscription', payload)
  creating.value = false
  if (id != null) {
    router.push(`/home/project/${projectId.value}`)
  } else {
    error.value = 'Subscription creation failed — please review the highlighted parameters.'
  }
}

function buildParamWire(p) {
  const value = paramValues[p.id]
  if ((value === '' || value == null || (Array.isArray(value) && value.length === 0)) && !p.mandatory && !p.required) {
    return null
  }
  const base = { parameter: p.id }
  if (p.type === 'integer') return { ...base, integer: Number(value) }
  if (p.type === 'bool') return { ...base, bool: !!value }
  if (p.type === 'multiselect' || p.type === 'tags') return { ...base, selections: value || [] }
  if (p.type === 'select') return { ...base, text: value }
  return { ...base, text: value }
}

/* ------------- bootstrap ------------------- */

async function refreshAll() {
  await loadProject()
  if (project.value) await loadServices()
}

/** Populate selectors from an existing node and load its current parameter values. */
async function bootstrapEdit(node) {
  if (!node) return
  const type = nodeType(node)
  if (type === 'instance') {
    selected.service = node.refined?.refined || null
    selected.tool = node.refined || null
    selected.node = node
  } else if (type === 'tool') {
    selected.service = node.refined || null
    selected.tool = node
    selected.node = null
  } else {
    selected.service = node
    selected.tool = null
    selected.node = null
  }
  selected.mode = node.mode || 'all'
  editForm.name = node.name || ''
  loadingParams.value = true
  const data = await api.get(
    `rest/node/${encodeURIComponent(node.id)}/parameter-value/${(selected.mode || 'all').toUpperCase()}`,
  )
  const items = Array.isArray(data) ? data : (data?.data || [])
  parameters.value = items.map((it) => it.parameter).filter(Boolean)
  for (const key of Object.keys(paramValues)) delete paramValues[key]
  for (const it of items) {
    const p = it.parameter
    if (!p) continue
    if (p.type === 'integer') paramValues[p.id] = it.integer ?? ''
    else if (p.type === 'bool') paramValues[p.id] = !!it.bool
    else if (p.type === 'multiselect' || p.type === 'tags') paramValues[p.id] = it.selections || []
    else paramValues[p.id] = it.text ?? ''
  }
  loadingParams.value = false
}

onMounted(async () => {
  if (isEdit.value) {
    await bootstrapEdit(props.node)
    return
  }
  app.setBreadcrumbs(
    [
      { title: 'Home', to: '/' },
      { title: 'Projects', to: '/home/project' },
      ...(projectId.value
        ? [{ title: projectId.value, to: `/home/project/${projectId.value}` }, { title: 'Subscribe' }]
        : [{ title: 'Subscribe' }]),
    ],
    { refresh: refreshAll },
  )
  await refreshAll()
})

/* NodeIcon and the underlying nodeIcon() helper have moved to
 * @ligoj/host (app-ui/src/components/NodeIcon.vue) so every plugin can
 * use them. The FA → MDI translation table travels with them. */
</script>

<style scoped>
.form-stack {
  max-width: 880px;
}

.section-heading {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

/* .tool-icon and .icon-text are shipped by @ligoj/host's NodeIcon.vue. */

.new-node-form {
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.18);
  border-radius: 6px;
}
</style>
