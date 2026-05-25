<template>
  <div>
    <template v-if="!isEdit && !isCreateNode">
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

    <v-form v-if="isEdit || isCreateNode || project" ref="formRef" class="form-stack" @submit.prevent="submit">
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
            <v-text-field v-if="editType === 'service' || editType === 'feature'" v-model="editForm.name" label="Name" maxlength="250" variant="outlined" density="compact" class="mt-3"
              :rules="[rules.required]" />
          </template>
          <v-select v-else v-model="selected.service" :items="services" item-title="name" item-value="id" return-object label="Service" variant="outlined" density="compact" :loading="loadingServices"
            :rules="[rules.required]">
            <template #selection="{ item }">
              <span v-if="item" class="d-inline-flex align-center ga-2">
                <NodeIcon :node="item" /> {{ item.name || item.id }}
              </span>
            </template>
            <template #item="{ props: itemProps, item }">
              <v-list-item v-if="item" v-bind="itemProps" :title="item.name || item.id">
                <template #prepend>
                  <NodeIcon :node="item" class="mr-3" />
                </template>
                <template #subtitle>
                  <code class="text-caption">{{ item.id }}</code>
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
            <v-text-field v-if="editType === 'tool'" v-model="editForm.name" label="Name" maxlength="250" variant="outlined" density="compact" class="mt-3" :rules="[rules.required]" />
          </template>
          <v-select v-else v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object label="Tool" variant="outlined" density="compact" :loading="loadingTools"
            :disabled="!selected.service" :rules="selected.service ? [rules.required] : []">
            <template #selection="{ item }">
              <span v-if="item" class="d-inline-flex align-center ga-2">
                <NodeIcon :node="item" /> {{ item.name || item.id }}
              </span>
            </template>
            <template #item="{ props: itemProps, item }">
              <v-list-item v-if="item" v-bind="itemProps" :title="item.name || item.id">
                <template #prepend>
                  <NodeIcon :node="item" class="mr-3" />
                </template>
                <template #subtitle>
                  <code class="text-caption">{{ item.id }}</code>
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
            <v-text-field v-model="editForm.name" label="Name" maxlength="250" variant="outlined" density="compact" class="mt-3" :rules="[rules.required]" />
          </template>

          <!-- Subscribe flow: instance picker + "New instance" toggle. Hidden
               in create-node mode since there's no existing instance to pick. -->
          <div v-else-if="!isCreateNode" class="d-flex align-start ga-2">
            <v-select v-model="selected.node" :items="nodes" item-title="name" item-value="id" return-object label="Instance" variant="outlined" density="compact" :loading="loadingNodes"
              :disabled="!selected.tool || showNewNode" :rules="!showNewNode && selected.tool ? [rules.required] : []" class="flex-grow-1">
              <template #selection="{ item }">
                <span v-if="item" class="d-inline-flex align-center ga-2">
                  <NodeIcon :node="item" /> {{ item.name || item.id }}
                </span>
              </template>
              <template #item="{ props: itemProps, item }">
                <v-list-item v-if="item" v-bind="itemProps" :title="item.name || item.id">
                  <template #prepend>
                    <NodeIcon :node="item" class="mr-3" />
                  </template>
                  <template #subtitle>
                    <code class="text-caption">{{ item.id }}</code>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-btn variant="outlined" :prepend-icon="showNewNode ? 'mdi-close' : 'mdi-plus'" :disabled="!selected.tool" @click="toggleNewNode">
              {{ showNewNode ? 'Pick existing' : 'New instance' }}
            </v-btn>
          </div>

          <v-expand-transition>
            <div v-if="showNewNode || isCreateNode" class="new-node-form mt-3 pa-3">
              <p class="text-caption text-medium-emphasis mb-2">
                Declares a node under <code>{{ selected.tool?.id }}</code>. Tool-specific
                parameters can be added later by editing the new instance.
              </p>
              <v-text-field v-model="newNode.id" label="ID" :hint="`Suggested: ${selected.tool?.id}:my-instance`" persistent-hint variant="outlined" density="compact" class="mb-2"
                :rules="(showNewNode || isCreateNode) ? [rules.required, rules.nodeId] : []" />
              <v-text-field v-model="newNode.name" label="Name" variant="outlined" density="compact" class="mb-2" :rules="(showNewNode || isCreateNode) ? [rules.required] : []" />
              <v-alert v-if="newNodeError" type="warning" variant="tonal" density="compact" class="mb-2">
                {{ newNodeError }}
              </v-alert>
              <!-- In subscribe mode an explicit "Create instance" button lets
                   the user materialise the node and then continue with mode +
                   parameters. In create-node mode the wizard's bottom submit
                   button is the trigger, so this inline button is omitted. -->
              <v-btn v-if="!isCreateNode" color="primary" :loading="creatingNode" :disabled="!newNode.id || !newNode.name" @click="createNode">
                Create instance
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>

      <!-- 4. Mode --------------------------------------------------------- -->
      <!-- Mode is needed in every wizard variant:
           • subscribe   — gates parameter loading + the subscription payload
           • edit-node   — read-only display of the node's current mode
           • create-node — sets the node's initial subscription mode
           The disable gate differs: subscribe waits for an instance pick,
           create-node only needs a tool (no instance exists yet). -->
      <v-card variant="tonal" class="mb-4" :disabled="!isEdit && !(isCreateNode ? selected.tool : selected.node)">
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
      <v-card variant="tonal" class="mb-4" :disabled="!isEdit && (!selected.mode || !(isCreateNode ? selected.tool : selected.node))">
        <v-card-text>
          <div class="section-heading">
            <v-icon class="mr-2">mdi-tune</v-icon>
            <span>5. Parameters</span>
            <v-progress-circular v-if="loadingParams" size="14" width="2" indeterminate class="ml-2" />
          </div>
          <p v-if="isCreateNode" class="text-body-2 text-medium-emphasis mb-3">
            Initial values for <code>{{ newNode.id || 'the new node' }}</code>. You can edit them later from System → Nodes.
          </p>
          <p v-else-if="!isEdit" class="text-body-2 text-medium-emphasis mb-3">
            Values required to link the project to
            <code v-if="selected.node">{{ selected.node.id }}</code>
            <span v-else>the chosen instance</span>.
          </p>
          <p v-else class="text-body-2 text-medium-emphasis mb-3">
            Configuration values bound to <code>{{ node?.id }}</code>.
          </p>

          <v-alert v-if="!loadingParams && (isEdit || (selected.mode && (isCreateNode ? selected.tool : selected.node))) && parameters.length === 0" type="info" variant="tonal" density="compact">
            {{ isEdit ? 'No parameters configured for this node.' : (isCreateNode ? 'This node has no additional parameters.' : 'This subscription requires no additional parameters.') }}
          </v-alert>

          <div v-for="p in parameters" :key="p.id" class="mb-3">
            <!-- Plugin-supplied component (see `resolveParameterField`). Takes
                 precedence over the default type-based rendering so a tool
                 like plugin-id-ldap can wire live-validated autocompletes
                 against a REST endpoint while the rest of the form uses
                 the auto-rendered inputs. `node-id` is passed for plugins
                 that need to build node-scoped REST URLs (e.g. LDAP's
                 customer lookup `service/id/ldap/customer/{node}/{q}`). -->
            <component v-if="resolveParameterField(p)" :is="resolveParameterField(p)" v-model="paramValues[p.id]" :parameter="p" :form-values="paramValues" :mode="selected.mode"
              :is-node="isEdit || isCreateNode" :project="project" :node-id="currentNodeId" :instance-node-id="currentInstanceNodeId" />

            <v-text-field v-else-if="isTextParam(p)" v-model="paramValues[p.id]" :type="isPassword(p) ? 'password' : 'text'" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="paramHint(p) ?? ''"
              :persistent-hint="!!paramHint(p)" variant="outlined" density="compact" />

            <v-text-field v-else-if="typeKind(p) === 'integer'" v-model.number="paramValues[p.id]" type="number" :min="p.min" :max="p.max" :label="paramLabel(p)" :rules="ruleFor(p)"
              :hint="paramHint(p) ?? ''" :persistent-hint="!!paramHint(p)" variant="outlined" density="compact" />

            <v-checkbox v-else-if="typeKind(p) === 'bool'" v-model="paramValues[p.id]" :label="paramLabel(p)" :hint="paramHint(p) ?? ''" :persistent-hint="!!paramHint(p)" density="compact" />

            <v-select v-else-if="typeKind(p) === 'select'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="paramHint(p) ?? ''"
              :persistent-hint="!!paramHint(p)" variant="outlined" density="compact" />

            <v-select v-else-if="typeKind(p) === 'multiple' || typeKind(p) === 'multiselect' || typeKind(p) === 'tags'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)"
              :rules="ruleFor(p)" :hint="paramHint(p) ?? ''" :persistent-hint="!!paramHint(p)" chips multiple variant="outlined" density="compact" />

            <!-- Catch-all: only fires for an unrecognized type the backend
                 added without an explicit branch above. Showing `[${type}]`
                 in the hint makes the gap visible during development. -->
            <v-text-field v-else v-model="paramValues[p.id]" :label="paramLabel(p)" :rules="ruleFor(p)" :hint="`${paramHint(p) ?? ''} [${p.type}]`" persistent-hint variant="outlined"
              density="compact" />
          </div>
        </v-card-text>
      </v-card>

      <!-- Actions --------------------------------------------------------- -->
      <div class="d-flex align-center ga-2">
        <v-btn v-if="isEdit || isCreateNode" variant="text" :disabled="creating" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn v-else variant="text" :to="cancelTo" :disabled="creating">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="isEdit" type="submit" color="primary" prepend-icon="mdi-content-save" :loading="creating">
          Save
        </v-btn>
        <v-btn v-else-if="isCreateNode" type="submit" color="success" prepend-icon="mdi-plus" :loading="creating" :disabled="!ready">
          Create node
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
import { useApi, useAppStore, useErrorStore, useI18nStore, loadPlugin, pluginIdFromKey, pluginRegistry, NodeIcon, NodeModeChip, nodeType } from '@ligoj/host'

const props = defineProps({
  /**
   * 'subscribe'    — default route view: pick service/tool/instance + mode + parameters
   *                  and attach the project to it.
   * 'edit-node'    — popup over an existing node: edit name + parameters.
   * 'create-node'  — popup launched from System → Nodes: declare a new instance
   *                  under a tool. No project, no mode, no parameters; the user
   *                  edits the freshly-created node to fill them in.
   */
  mode: { type: String, default: 'subscribe' },
  /** Required when mode === 'edit-node': the node being edited. */
  node: { type: Object, default: null },
})
const emit = defineEmits(['saved', 'cancel'])
const isEdit = computed(() => props.mode === 'edit-node')
const isCreateNode = computed(() => props.mode === 'create-node')
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
const ready = computed(() => {
  if (isCreateNode.value) {
    // Same prerequisites as the subscribe path, minus the instance pick
    // (we're declaring a fresh one) and the project.
    return !!selected.service && !!selected.tool && !!selected.mode && !!newNode.id && !!newNode.name
  }
  return !!projectId.value
    && !!selected.service
    && !!selected.tool
    && !!selected.node
    && !!selected.mode
    && !showNewNode.value
})

/* ------------- validation rules ------------ */

const rules = {
  required: (v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || 'Required',
  nodeId: (v) => /^[\w-]+(:[\w-]+)+$/.test(v || '') || 'Use the colon-separated form, e.g. service:scm:git:internal',
}

/* ------------- param helpers --------------- */

const i18nStore = useI18nStore()

/**
 * Normalised parameter type for comparison. The backend serialises
 * `ParameterType` enums by name (TEXT, BOOL, SELECT, MULTIPLE, INTEGER,
 * DATE, TAGS). Some legacy/test payloads come in lowercase — accept both.
 */
function typeKind(p) {
  return String(p?.type || '').toLowerCase()
}
function isTextParam(p) {
  const k = typeKind(p)
  return !k || k === 'text' || k === 'password' || k === 'node' || k === 'project'
}
/** Password inputs are driven by `secured` (CSV column → backend flag). */
function isPassword(p) {
  return !!p.secured || typeKind(p) === 'password'
}
/**
 * Resolves a translation key, returning the requested fallback when the
 * key is missing. vue-i18n's default behaviour is to echo the key back
 * when there's no match — useless for labels (a raw `service:id:ldap:...`
 * shows in the UI) and worse for hints (we'd persist a meaningless line
 * of "service:id:ldap:base-dn-description").
 */
function tOrNull(key) {
  const value = i18nStore.t(key)
  return value === key ? null : value
}
/**
 * Label for a parameter form field. Plugins ship their parameter labels
 * via their i18n bundle keyed on the parameter id (e.g. `service:id:ldap:base-dn`
 * → "Base DN"). Falls back to the raw id so missing keys are obvious in
 * the UI rather than failing silently.
 */
function paramLabel(p) {
  const req = p.mandatory || p.required ? ' *' : ''
  return `${tOrNull(p.id) ?? p.id}${req}`
}
/**
 * Optional hint / tooltip for a parameter field. Sourced from the
 * i18n key `<id>-description` so plugins can describe a parameter
 * separately from its label. Returns null when no description is
 * registered — the wizard suppresses the hint slot in that case.
 */
function paramHint(p) {
  return tOrNull(`${p.id}-description`)
}
function ruleFor(p) {
  return (p.mandatory || p.required) ? [rules.required] : []
}

/**
 * Node id whose plugin owns parameter-field overrides for the current
 * wizard step. Subscribe / create-node take it from the picked tool;
 * edit-node uses the node being edited.
 */
const currentNodeId = computed(() => {
  if (isEdit.value) return props.node?.id || null
  return selected.tool?.id || null
})

/**
 * Instance-level node id — the actual node the subscription will attach
 * to (e.g. `service:id:ldap:local`), as opposed to the tool node id
 * (`service:id:ldap`). Plugins that issue REST calls scoped to a
 * specific instance (LDAP customer lookup, …) need this rather than
 * the tool id. In edit-node mode the edited node IS the instance.
 */
const currentInstanceNodeId = computed(() => {
  if (isEdit.value) return props.node?.id || null
  return selected.node?.id || null
})

/**
 * Plugins can replace the wizard's default `<v-text-field>` / `<v-select>`
 * for a specific parameter id by exposing a `parameterField` feature that
 * returns a Vue component class. Used for live-validated autocompletes
 * (LDAP OU / parent-group) and composite inputs (LDAP group simple-name
 * → computed full name).
 *
 * The hook is consulted on the sub-plugin first (`prov-aws`, `id-ldap`,
 * …) then on the parent service plugin (`prov`, `id`) — both layers
 * may contribute, but the more specific tool-level override wins.
 *
 * Returns null when no plugin contributes a custom component — the
 * default field-type branch then renders.
 */
function resolveParameterField(p) {
  const nodeId = currentNodeId.value
  if (!nodeId) return null
  const ctx = {
    parameter: p,
    mode: selected.mode || null,
    isNode: isEdit.value || isCreateNode.value,
    formValues: paramValues,
    nodeId,
    instanceNodeId: currentInstanceNodeId.value,
  }
  const subPluginId = pluginIdFromKey(nodeId)
  const candidates = []
  if (subPluginId) candidates.push(subPluginId)
  // Parent service plugin id is the 2nd colon segment of the node id.
  const parts = String(nodeId).split(':').filter(Boolean)
  if (parts.length >= 2 && parts[1] && parts[1] !== subPluginId) {
    candidates.push(parts[1])
  }
  for (const id of candidates) {
    const plugin = pluginRegistry.get(id)
    if (typeof plugin?.feature !== 'function') continue
    try {
      const comp = plugin.feature('parameterField', ctx)
      if (comp) return comp
    } catch (err) {
      // A plugin that does not declare the feature throws from its
      // dispatcher — swallow that quietly. Anything else is worth a
      // log but should not break parameter rendering.
      if (!/no feature ["']parameterField["']/.test(err?.message || '')) {
        console.warn(`[wizard] parameterField from ${id} threw`, err)
      }
    }
  }
  return null
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

/**
 * Best-effort lazy-load of the sub-plugin that owns a node's i18n
 * bundle. For `service:id:ldap` this resolves to `id-ldap`, for
 * `service:prov:aws:foo` to `prov-aws`, and so on. Errors (missing
 * bundle, network failure, no default export) are swallowed — the
 * wizard still renders, just with raw parameter ids in place of
 * translated labels.
 */
function ensureToolPluginLoaded(nodeId) {
  // Plugin bundles map to `<plugin>` or `<plugin>-<tool>` (e.g. `id`,
  // `id-ldap`) — never down to an instance. Truncate any 4-segment
  // instance id to its tool prefix so `service:id:ldap:server1` and
  // `service:id:ldap` both resolve to the `id-ldap` bundle.
  if (typeof nodeId !== 'string') return
  const parts = nodeId.split(':').filter(Boolean).slice(0, 3)
  const pluginId = pluginIdFromKey(parts.join(':'))
  if (!pluginId) return
  loadPlugin(pluginId).catch(() => { /* no bundle — keep rendering */ })
}

async function loadParameters(nodeId, mode) {
  loadingParams.value = true
  const data = await api.get(`rest/node/${encodeURIComponent(nodeId)}/parameter/${mode.toUpperCase()}`)
  const raw = Array.isArray(data) ? data : (data?.data || [])
  // Apply the parameter's mode-availability flag. The backend defaults
  // null to true in the VO (legacy rows that pre-date the flags), so
  // only explicit `false` is filtered out. The subscribe path keys off
  // `availableForSubscription`; create-node / edit-node off
  // `availableForNode`. Backend `ParameterValueResource` enforces the
  // same contract on write — this filter is the matching read-side
  // gate so the wizard never shows a field the backend will reject.
  parameters.value = raw.filter((p) => isParameterAvailable(p))
  for (const key of Object.keys(paramValues)) delete paramValues[key]
  for (const p of parameters.value) {
    if (p.defaultValue != null) {
      paramValues[p.id] = coerceDefault(p)
    } else {
      const k = typeKind(p)
      if (k === 'bool') paramValues[p.id] = false
      else if (k === 'multiple' || k === 'multiselect' || k === 'tags') paramValues[p.id] = []
      else paramValues[p.id] = ''
    }
  }
  loadingParams.value = false
}

/** Mode-aware availability check. Returns false only when the owning
 *  plugin explicitly opted out for the current context. */
function isParameterAvailable(p) {
  if (!p) return false
  // Subscribe mode is the only path where the parameter is bound to a
  // subscription; everything else (create-node, edit-node) configures
  // the node itself.
  const forSubscription = !isEdit.value && !isCreateNode.value
  const flag = forSubscription ? p.availableForSubscription : p.availableForNode
  return flag !== false
}

function coerceDefault(p) {
  const k = typeKind(p)
  if (k === 'integer') return Number(p.defaultValue)
  if (k === 'bool') return p.defaultValue === true || p.defaultValue === 'true'
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
  // Reset the new-node form so it doesn't leak the previous tool's prefix.
  // In create-node mode we keep the form visible (it's the whole UI);
  // elsewhere we collapse it back to the picker.
  newNode.id = ''
  newNode.name = ''
  newNodeError.value = null
  showNewNode.value = isCreateNode.value
  if (svc) await loadTools(svc.id)
})

// Selecting a tool invalidates instance + mode and refreshes both.
watch(() => selected.tool, async (tool) => {
  if (isEdit.value) return
  selected.node = null
  selected.mode = null
  nodes.value = []
  parameters.value = []
  newNode.id = isCreateNode.value && tool ? `${tool.id}:` : ''
  newNode.name = ''
  newNodeError.value = null
  showNewNode.value = isCreateNode.value
  if (tool) {
    await loadNodes(tool.id)
    // If the tool only allows one mode, preselect it for convenience.
    const modes = availableModes.value
    if (modes.length === 1) selected.mode = modes[0].value
  }
})

// Whenever the targeted node (instance in subscribe, tool in create-node)
// or the chosen mode change, refresh the parameter list. One watcher,
// one fetch — keeps the rules for "which id is queried" in a single
// place instead of split across two reactive callbacks.
watch([() => selected.node, () => selected.mode, () => selected.tool], refetchParameters)

async function refetchParameters() {
  if (isEdit.value) return
  parameters.value = []
  const mode = selected.mode
  if (!mode) return
  // Subscribe mode: parameter values are bound to the picked INSTANCE,
  // so query its node id. The backend resolves the chain (instance
  // overrides tool defaults), and the URL is now safe because the
  // backend's UriColonDecodingFilter unescapes `%3A` → `:` before CXF
  // matches the JAX-RS regex.
  // Create-node mode: no instance exists yet — query the tool itself
  // so the form shows the right slots before the user fills them in.
  const targetId = isCreateNode.value ? selected.tool?.id : selected.node?.id
  if (!targetId) return
  // Tool-level sub-plugin owns the i18n bundle. Use the tool id (or the
  // truncated form of the instance id) — ensureToolPluginLoaded already
  // strips any instance segment.
  ensureToolPluginLoaded(selected.tool?.id || targetId)
  await loadParameters(targetId, mode)
}

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
    // NodeEditionVo's parent field is `node` (Refining<String>.getRefined()
    // is read-only — there's no setRefined, so sending `refined:` is dropped
    // by Jackson and the @NotBlank `node` check rejects the payload).
    const payload = {
      id: newNode.id,
      name: newNode.name,
      node: selected.tool?.id,
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

  if (isCreateNode.value) {
    // POST the full node payload (id + name + parent + mode + parameters).
    // NodeEditionVo wires `node` (not `refined`) to the parent; the only
    // `setRefined` setter doesn't exist, so sending `refined:` is silently
    // dropped by Jackson and the @NotBlank `node` validation fails.
    const payload = {
      id: newNode.id,
      name: newNode.name,
      node: selected.tool?.id,
      mode: selected.mode,
      untouchedParameters: false,
      parameters: parameters.value.map(buildParamWire).filter(Boolean),
    }
    const result = await api.post('rest/node', payload)
    creating.value = false
    if (result === null) {
      error.value = 'Node creation failed — please review the highlighted fields.'
      return
    }
    errorStore.success(`Node "${payload.name}" created`)
    emit('saved', payload)
    return
  }

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
  const k = typeKind(p)
  if (k === 'integer') return { ...base, integer: Number(value) }
  if (k === 'bool') return { ...base, bool: !!value }
  if (k === 'multiple' || k === 'multiselect' || k === 'tags') return { ...base, selections: value || [] }
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
  // Edit mode uses /parameter-value/ rather than loadParameters(), so it
  // bypasses the lazy-load there. Pull the sub-plugin in here too so the
  // labels resolve for an LDAP node, etc.
  ensureToolPluginLoaded(node.id)
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
  // Belt-and-suspenders: the backend already drops `availableForNode=false`
  // entries from this endpoint, but we re-apply the filter so a stale or
  // hand-rolled response can't slip a forbidden parameter into the form.
  const visible = items.filter((it) => isParameterAvailable(it?.parameter))
  parameters.value = visible.map((it) => it.parameter).filter(Boolean)
  for (const key of Object.keys(paramValues)) delete paramValues[key]
  for (const it of visible) {
    const p = it.parameter
    if (!p) continue
    const k = typeKind(p)
    if (k === 'integer') paramValues[p.id] = it.integer ?? ''
    else if (k === 'bool') paramValues[p.id] = !!it.bool
    else if (k === 'multiple' || k === 'multiselect' || k === 'tags') paramValues[p.id] = it.selections || []
    else paramValues[p.id] = it.text ?? ''
  }
  loadingParams.value = false
}

onMounted(async () => {
  if (isEdit.value) {
    await bootstrapEdit(props.node)
    return
  }
  if (isCreateNode.value) {
    // No project, no breadcrumbs — the host hosts us in a dialog. Just
    // populate the service dropdown so the wizard is interactive.
    showNewNode.value = true
    await loadServices()
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
