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
      :items="stepItems"
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
            v-if="step < stepItems.length"
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
import { useApi, useAppStore, APP_BASE } from '@ligoj/host'

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

/** v-stepper items as objects so each step gets a thematic icon (and
 *  an editIcon overriding Vuetify's default pencil while the step is
 *  visited but not active). The Service step uses mdi-room-service-outline
 *  per spec; the rest follow the same convention. */
const stepItems = computed(() => [
  { title: 'Service',    value: 1, icon: 'mdi-room-service-outline', editIcon: 'mdi-room-service-outline' },
  { title: 'Tool',       value: 2, icon: 'mdi-wrench',               editIcon: 'mdi-wrench' },
  { title: 'Node',       value: 3, icon: 'mdi-server',               editIcon: 'mdi-server' },
  { title: 'Mode',       value: 4, icon: 'mdi-link-variant',         editIcon: 'mdi-link-variant' },
  { title: 'Parameters', value: 5, icon: 'mdi-tune',                 editIcon: 'mdi-tune' },
])

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
 * Renders the step's options as a 3-column table (icon / name / id).
 * Clicking a row selects it; the active row is highlighted. Declared
 * inline so the wizard stays in a single file.
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
          : renderChoiceTable(props.choices, props.selectedId, (c) => emit('select', c)),
    ])
  },
}

function renderChoiceTable(choices, selectedId, onSelect) {
  return h('table', { class: 'choice-table' }, [
    h('thead', null,
      h('tr', null, [
        h('th', { class: 'choice-table__icon-col' }, ''),
        h('th', null, 'Name'),
        h('th', null, 'Identifier'),
      ]),
    ),
    h('tbody', null, choices.map((c) =>
      h('tr', {
        key: c.id,
        class: ['choice-row', { 'choice-row--active': c.id === selectedId }],
        title: c.description || undefined,
        onClick: () => onSelect(c),
      }, [
        h('td', { class: 'choice-icon-cell' }, [nodeIcon(c)]),
        h('td', { class: 'choice-name-cell' }, c.name || c.id),
        h('td', { class: 'choice-id-cell text-medium-emphasis text-caption' }, c.id || ''),
      ]),
    )),
  ])
}

/**
 * Render a node's icon following the legacy `toIcon` / `toIconBase`
 * priority chain (see app-ui/main/main.js).
 *
 *   1. node.uiClasses
 *      a. an explicit `mdi-*` or `fa-*` class is rendered as <i> with
 *         the matching font prefix and any other words as extra classes
 *      b. `$Foo` shape becomes a small text badge
 *      c. otherwise the raw classes are spread on a <span> (legacy CSS-
 *         driven badges)
 *   2. id has fewer than 3 fragments (i.e. a service node) → wrench
 *   3. otherwise an <img> at /main/service/{service}/{tool}/img/{tool}.png
 *      with `.broken` set on load failure so the host CSS can render a
 *      placeholder
 */
function nodeIcon(node) {
  const id = (typeof node === 'string' ? node : node?.id) || ''
  const fragments = id.split(':')
  const uiClasses = (typeof node === 'object' && node?.uiClasses) || ''

  if (uiClasses) {
    const parts = uiClasses.split(/\s+/).filter(Boolean)
    const explicit = parts.find((p) => p.startsWith('mdi-') || p.startsWith('fa-'))
    if (explicit) {
      const isMdi = explicit.startsWith('mdi-')
      const rest = parts.filter((p) => p !== explicit).join(' ')
      // Vuetify ships the `mdi` font but plain `mdi-foo` needs the
      // `mdi` prefix class to render. FA needs `fas`/`far`/`fab` —
      // assume the legacy uiClasses string already includes one.
      const cls = (isMdi ? 'mdi ' : '') + explicit + (rest ? ' ' + rest : '') + ' fa-fw'
      return h('i', { class: cls })
    }
    if (uiClasses.startsWith('$')) {
      return h('span', { class: 'icon-text' }, uiClasses.slice(1))
    }
    return h('span', { class: parts.join(' ') })
  }

  if (fragments.length < 3) {
    // Service-level node (e.g. service:scm) — fall back to a generic mark.
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
.choice-table {
  width: 100%;
  border-collapse: collapse;
}
.choice-table th {
  text-align: left;
  font-weight: 500;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  color: rgba(var(--v-theme-on-surface), 0.7);
}
.choice-table__icon-col {
  width: 56px;
}
.choice-row {
  cursor: pointer;
  transition: background 0.12s;
}
.choice-row > td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}
.choice-row:hover {
  background: rgba(var(--v-theme-primary), 0.06);
}
.choice-row--active {
  background: rgba(var(--v-theme-primary), 0.14);
}
.choice-row--active > td:first-child {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: calc(0.75rem - 3px);
}
.choice-icon-cell {
  font-size: 1.4rem;
  line-height: 1;
}
.choice-icon-cell i {
  font-size: 1.4rem;
}
.choice-name-cell {
  font-weight: 500;
}
.choice-id-cell {
  font-family: monospace;
}
.tool-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.tool-icon.broken {
  opacity: 0.3;
}
.icon-text {
  display: inline-block;
  padding: 0.1em 0.4em;
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}
</style>
