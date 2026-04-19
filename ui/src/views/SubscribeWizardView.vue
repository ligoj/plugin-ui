<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">Subscribe</h1>
      <v-spacer />
      <v-btn variant="text" :to="cancelTo">Cancel</v-btn>
    </div>

    <v-alert
      v-if="!projectId"
      type="info"
      variant="tonal"
      density="compact"
      class="mb-4"
    >
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
      <span class="text-caption text-warning">Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.</span>
    </v-alert>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-stepper
      v-if="project"
      v-model="step"
      :items="stepLabels"
      alt-labels
      :editable="stepEditable"
      class="mb-4"
    >
      <template #item.1>
        <StepChoice
          heading="Select a service"
          sub="A service groups features implemented by one or more tools."
          :choices="services"
          :loading="loadingServices"
          :selected-id="selected.service?.id"
          @select="pickService"
        />
      </template>

      <template #item.2>
        <StepChoice
          :heading="`Select a tool providing ${selected.service?.name ?? '…'}`"
          sub="A tool is one implementation of the service; several instances may be deployed."
          :choices="tools"
          :loading="loadingTools"
          :selected-id="selected.tool?.id"
          @select="pickTool"
        />
      </template>

      <template #item.3>
        <StepChoice
          :heading="`Pick a node running ${selected.tool?.name ?? '…'}`"
          sub="A node is a running instance of the tool."
          :choices="nodes"
          :loading="loadingNodes"
          :selected-id="selected.node?.id"
          @select="pickNode"
        />
      </template>

      <template #item.4>
        <div class="pa-4">
          <h3 class="text-h6 mb-2">Subscription mode</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            <strong>Link</strong> attaches this project to an existing
            instance in the tool. <strong>Create</strong> additionally
            provisions a new instance inside the tool.
          </p>
          <v-radio-group v-model="selected.mode" inline>
            <v-radio
              v-for="m in availableModes"
              :key="m.value"
              :value="m.value"
              :label="m.label"
            />
          </v-radio-group>
        </div>
      </template>

      <template #item.5>
        <div class="pa-4">
          <h3 class="text-h6 mb-1">Parameters</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Values required to link the project to
            <code>{{ selected.node?.id }}</code>.
          </p>

          <v-progress-linear v-if="loadingParams" indeterminate color="primary" class="mb-3" />

          <v-alert
            v-if="!loadingParams && parameters.length === 0"
            type="info"
            variant="tonal"
            density="compact"
          >
            This subscription requires no additional parameters — just click Create.
          </v-alert>

          <v-form ref="paramFormRef">
            <div
              v-for="p in parameters"
              :key="p.id"
              class="mb-3"
            >
              <v-text-field
                v-if="isTextParam(p)"
                v-model="paramValues[p.id]"
                :type="isPassword(p) ? 'password' : 'text'"
                :label="paramLabel(p)"
                :rules="ruleFor(p)"
                :hint="p.description"
                persistent-hint
                variant="outlined"
                density="compact"
              />

              <v-text-field
                v-else-if="p.type === 'integer'"
                v-model.number="paramValues[p.id]"
                type="number"
                :min="p.min"
                :max="p.max"
                :label="paramLabel(p)"
                :rules="ruleFor(p)"
                :hint="p.description"
                persistent-hint
                variant="outlined"
                density="compact"
              />

              <v-checkbox
                v-else-if="p.type === 'bool'"
                v-model="paramValues[p.id]"
                :label="paramLabel(p)"
                :hint="p.description"
                persistent-hint
                density="compact"
              />

              <v-select
                v-else-if="p.type === 'select'"
                v-model="paramValues[p.id]"
                :items="p.values || []"
                :label="paramLabel(p)"
                :rules="ruleFor(p)"
                :hint="p.description"
                persistent-hint
                variant="outlined"
                density="compact"
              />

              <v-select
                v-else-if="p.type === 'multiselect' || p.type === 'tags'"
                v-model="paramValues[p.id]"
                :items="p.values || []"
                :label="paramLabel(p)"
                :rules="ruleFor(p)"
                :hint="p.description"
                persistent-hint
                chips
                multiple
                variant="outlined"
                density="compact"
              />

              <v-text-field
                v-else
                v-model="paramValues[p.id]"
                :label="paramLabel(p)"
                :rules="ruleFor(p)"
                :hint="`${p.description || ''} [${p.type}]`"
                persistent-hint
                variant="outlined"
                density="compact"
              />
            </div>
          </v-form>
        </div>
      </template>

      <template #actions="{ prev, next }">
        <div class="d-flex align-center pa-2">
          <v-btn
            v-if="step > 1"
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="prev"
          >Previous</v-btn>
          <v-spacer />
          <v-btn
            v-if="step < stepLabels.length"
            color="primary"
            :disabled="!canAdvance"
            append-icon="mdi-arrow-right"
            @click="next"
          >Next</v-btn>
          <v-btn
            v-else
            color="success"
            prepend-icon="mdi-check"
            :loading="creating"
            :disabled="!selected.node"
            @click="submit"
          >Create subscription</v-btn>
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi, useAppStore } from '@ligoj/host'

const route = useRoute()
const router = useRouter()
const api = useApi()
const app = useAppStore()

const projectId = computed(() => route.query.project ?? route.params.id ?? null)

const project = ref(null)
const loadingProject = ref(false)
const error = ref(null)

const step = ref(1)

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
const paramFormRef = ref(null)

const loadingServices = ref(false)
const loadingTools = ref(false)
const loadingNodes = ref(false)
const loadingParams = ref(false)
const creating = ref(false)

const stepLabels = computed(() => ['Service', 'Tool', 'Node', 'Mode', 'Parameters'])

const stepEditable = computed(() => (n) => {
  // Allow returning to any earlier step if its selection still exists.
  if (n === 1) return true
  if (n === 2) return !!selected.service
  if (n === 3) return !!selected.tool
  if (n === 4) return !!selected.node
  if (n === 5) return !!selected.node && !!selected.mode
  return false
})

const canAdvance = computed(() => {
  if (step.value === 1) return !!selected.service
  if (step.value === 2) return !!selected.tool
  if (step.value === 3) return !!selected.node
  if (step.value === 4) return !!selected.mode
  return false
})

const availableModes = computed(() => {
  const m = selected.tool?.mode
  const result = []
  if (m === 'all' || m === 'create') {
    result.push({ value: 'create', label: 'Create — provision a new instance inside the tool' })
  }
  if (m === 'all' || m === 'link' || !m) {
    result.push({ value: 'link', label: 'Link — attach this project to an existing instance' })
  }
  return result
})

const cancelTo = computed(() =>
  project.value ? `/home/project/${project.value.id}` : '/home/project',
)

/* -------------- param type helpers -------------- */

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
  const rules = []
  if (p.mandatory || p.required) {
    rules.push((v) => (v !== '' && v != null) || 'Required')
  }
  return rules
}

/* -------------- loaders -------------- */

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
  // Seed default values
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

/* -------------- step transitions -------------- */

function pickService(svc) {
  if (selected.service?.id === svc.id) return
  selected.service = svc
  selected.tool = null
  selected.node = null
  selected.mode = null
  tools.value = []
  nodes.value = []
}

function pickTool(tool) {
  if (selected.tool?.id === tool.id) return
  selected.tool = tool
  selected.node = null
  selected.mode = null
  nodes.value = []
}

function pickNode(node) {
  if (selected.node?.id === node.id) return
  selected.node = node
  selected.mode = null
}

// Populate each step's data when the user arrives on it.
watch(step, async (n) => {
  if (n === 1 && services.value.length === 0) await loadServices()
  if (n === 2 && selected.service && tools.value.length === 0) await loadTools(selected.service.id)
  if (n === 3 && selected.tool && nodes.value.length === 0) await loadNodes(selected.tool.id)
  if (n === 4 && !selected.mode && availableModes.value.length > 0) {
    selected.mode = availableModes.value[0].value
  }
  if (n === 5 && selected.node && selected.mode) {
    await loadParameters(selected.node.id, selected.mode)
  }
})

/* -------------- submit -------------- */

async function submit() {
  const { valid } = paramFormRef.value ? await paramFormRef.value.validate() : { valid: true }
  if (!valid) return
  creating.value = true
  error.value = null

  const payload = {
    node: selected.node.id,
    project: Number(projectId.value),
    mode: selected.mode,
    parameters: parameters.value.map((p) => buildParamWire(p)).filter(Boolean),
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

/* -------------- bootstrap -------------- */

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

/* -------------- inline step-choice component --------------
 * A small grid of radio-style cards. Declared inline to keep the wizard in
 * one file; it has no state of its own beyond what the parent passes.
 */
const StepChoice = {
  name: 'StepChoice',
  props: {
    heading: String,
    sub: String,
    choices: { type: Array, default: () => [] },
    loading: Boolean,
    selectedId: String,
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () => h('div', { class: 'pa-4' }, [
      h('h3', { class: 'text-h6 mb-1' }, props.heading),
      props.sub && h('p', { class: 'text-body-2 text-medium-emphasis mb-4' }, props.sub),
      props.loading
        ? h('div', { class: 'text-body-2 text-medium-emphasis pa-4' }, 'Loading…')
        : !props.choices.length
          ? h('div', { class: 'text-body-2 text-medium-emphasis' }, 'No entries available.')
          : h(
              'div',
              { class: 'choice-grid' },
              props.choices.map((c) =>
                h(
                  'button',
                  {
                    key: c.id,
                    type: 'button',
                    class: [
                      'choice-card',
                      { 'choice-card--active': c.id === props.selectedId },
                    ],
                    onClick: () => emit('select', c),
                    title: c.description || undefined,
                  },
                  [
                    h('div', { class: 'choice-icon' }, uiClassIcon(c)),
                    h('div', { class: 'choice-name' }, c.name || c.id),
                  ],
                ),
              ),
            ),
    ])
  },
}

function uiClassIcon(node) {
  const ui = node?.uiClasses || node?.refined?.uiClasses
  if (ui && ui.startsWith('$')) return ui.slice(1)
  if (ui) return h('i', { class: ui })
  return h('i', { class: 'mdi mdi-puzzle' })
}
</script>

<style scoped>
.choice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}
.choice-card {
  background: rgba(var(--v-theme-surface-variant), 0.06);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  padding: 1rem 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  font: inherit;
}
.choice-card:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  border-color: rgba(var(--v-theme-primary), 0.4);
}
.choice-card--active {
  background: rgba(var(--v-theme-primary), 0.14);
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.3);
}
.choice-icon {
  font-size: 2rem;
  margin-bottom: 0.35rem;
  line-height: 1;
  min-height: 2.2rem;
}
.choice-icon i {
  font-size: 2rem;
}
.choice-name {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
