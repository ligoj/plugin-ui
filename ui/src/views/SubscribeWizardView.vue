<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">Subscribe</h1>
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

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-form v-if="project" ref="formRef" class="form-stack" @submit.prevent="submit">
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
          <v-select v-model="selected.service" :items="services" item-title="name" item-value="id" return-object label="Service" variant="outlined" density="compact" :loading="loadingServices"
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
      <v-card variant="tonal" class="mb-4" :disabled="!selected.service">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-wrench</v-icon>
            <span>2. Tool</span>
            <v-progress-circular v-if="loadingTools" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p class="text-body-2 text-medium-emphasis mb-3">
            A tool is one implementation of the service; several instances may be deployed.
          </p>
          <v-select v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object label="Tool" variant="outlined" density="compact" :loading="loadingTools"
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
      <v-card variant="tonal" class="mb-4" :disabled="!selected.tool">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-server</v-icon>
            <span>3. Instance</span>
            <v-progress-circular v-if="loadingNodes" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p class="text-body-2 text-medium-emphasis mb-3">
            An instance is a running node of the tool. Pick an existing one or declare a new one.
          </p>

          <div class="d-flex align-start ga-2">
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
      <v-card variant="tonal" class="mb-4" :disabled="!selected.node">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-link-variant</v-icon>
            <span>4. Mode</span>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-3">
            <strong>Link</strong> attaches this project to an existing instance.
            <strong>Create</strong> additionally provisions a new instance inside the tool.
          </p>
          <v-radio-group v-model="selected.mode" inline :rules="selected.node ? [rules.required] : []" hide-details>
            <v-radio v-for="m in availableModes" :key="m.value" :value="m.value" :label="m.label" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- 5. Parameters --------------------------------------------------- -->
      <v-card variant="tonal" class="mb-4" :disabled="!selected.node || !selected.mode">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-tune</v-icon>
            <span>5. Parameters</span>
            <v-progress-circular v-if="loadingParams" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p class="text-body-2 text-medium-emphasis mb-3">
            Values required to link the project to
            <code v-if="selected.node">{{ selected.node.id }}</code>
            <span v-else>the chosen instance</span>.
          </p>

          <v-alert v-if="!loadingParams && selected.node && selected.mode && parameters.length === 0" type="info" variant="tonal" density="compact">
            This subscription requires no additional parameters.
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
        <v-btn variant="text" :to="cancelTo" :disabled="creating">Cancel</v-btn>
        <v-spacer />
        <v-btn type="submit" color="success" prepend-icon="mdi-check" :loading="creating" :disabled="!ready">
          Create subscription
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi, useAppStore, APP_BASE } from '@ligoj/host'

const route = useRoute()
const router = useRouter()
const api = useApi()
const app = useAppStore()

const projectId = computed(() => route.query.project ?? route.params.id ?? null)

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
    result.push({ value: 'create', label: 'Create — provision a new object inside the instance' })
  }
  if (m === 'all' || m === 'link' || !m) {
    result.push({ value: 'link', label: 'Link — attach this project to an existing object' })
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
  parameters.value = []
})

watch(() => selected.mode, async (mode) => {
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

onMounted(async () => {
  app.setTitle('Subscribe')
  app.setBreadcrumbs([
    { title: 'Home', to: '/' },
    { title: 'Projects', to: '/home/project' },
    ...(projectId.value
      ? [{ title: projectId.value, to: `/home/project/${projectId.value}` }, { title: 'Subscribe' }]
      : [{ title: 'Subscribe' }]),
  ])
  await loadProject()
  if (project.value) await loadServices()
})

/* ------------- node icon helper ------------
 * Ports the legacy `toIcon` / `toIconBase` priority chain from
 * app-ui/main/main.js. See the previous wizard implementation for the
 * full breakdown — same algorithm.
 */
const NodeIcon = defineComponent({
  name: 'NodeIcon',
  props: { node: { type: [Object, String], default: null } },
  setup(props) {
    return () => nodeIcon(props.node)
  },
})

function convertFromFontAwesome(uiClasses) {
  if (uiClasses === 'far fa-id-badge') return 'mdi-badge-account-outline'
  if (uiClasses === 'fa fa-suitcase') return 'mdi-briefcase-variant'
  if (uiClasses === 'fa fa-database') return 'mdi-database-outline'
  if (uiClasses === 'fab fa-jenkins') return 'mdi-flask'
  if (uiClasses === 'fa fa-git') return 'mdi-git'
  if (uiClasses === 'fa fa-github') return 'mdi-github'
  if (uiClasses === 'fa fa-gitlab') return 'mdi-gitlab'
  if (uiClasses === 'fa fa-industry') return 'mdi-factory'
  if (uiClasses === 'fab fa-jira') return 'mdi-jira'
  if (uiClasses === 'fab fa-confluence') return 'mdi-gitlab'
  if (uiClasses === 'fa fa-envelope') return 'mdi-email-outline'
  if (uiClasses === 'fab fa-aws') return 'mdi-aws'
  if (uiClasses === 'fab fa-windows') return 'mdi-azure'
  if (uiClasses === 'fas fa-cloud') return 'mdi-cloud-outline'
  return uiClasses
}

function nodeIcon(node) {
  const id = (typeof node === 'string' ? node : node?.id) || ''
  const fragments = id.split(':')
  const uiClasses = convertFromFontAwesome((typeof node === 'object' && node?.uiClasses) || '')

  if (uiClasses) {
    const parts = uiClasses.split(/\s+/).filter(Boolean)
    const explicit = parts.find((p) => p.startsWith('mdi-') || p.startsWith('fa-'))
    if (explicit) {
      const isMdi = explicit.startsWith('mdi-')
      const rest = parts.filter((p) => p !== explicit).join(' ')
      const cls = (isMdi ? 'mdi ' : '') + explicit + (rest ? ' ' + rest : '') + ' fa-fw'
      return h('i', { class: cls })
    }
    if (uiClasses.startsWith('$')) {
      return h('span', { class: 'icon-text' }, uiClasses.slice(1))
    }
    return h('span', { class: parts.join(' ') })
  }

  if (fragments.length < 3) {
    return h('i', { class: 'mdi mdi-wrench fa-fw' })
  }

  const url = `${APP_BASE}main/service/${fragments[1]}/${fragments[2]}/img/${fragments[2]}.png`
  return h('img', {
    src: url,
    alt: '',
    class: 'tool-icon',
    onError: (e) => { e.target.classList.add('broken') },
  })
}
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

.tool-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.tool-icon.broken {
  opacity: 0.3;
}

.icon-text {
  display: inline-block;
  padding: 0.05em 0.4em;
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.new-node-form {
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.18);
  border-radius: 6px;
}
</style>
