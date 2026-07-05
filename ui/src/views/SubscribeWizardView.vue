<!--
  SubscribeWizardDialog — 2026 "Vibrant" subscription wizard (subscribe mode
  only; edit-node / create-node belong to the Administration views). Same
  `.vmodal` chrome as the other dialogs, but taller and scrollable. Cascading
  pickers: service → tool → instance (with an optional inline "new instance"
  form), then a segmented mode control, then the node's dynamic parameter
  fields. POSTs rest/subscription on confirm.

  Ported from plugin-ui's SubscribeWizardView. Standalone caveat: plugin
  parameter-field overrides and plugin i18n labels need the plugin bundles
  loaded (install()), which the 2026 app doesn't do — so parameters render
  with the default type-based fields and raw ids as labels. The core flow
  (service/tool/instance/mode/params → subscribe) works against the live
  backend nodes.
-->
<template>
  <LjDialog :model-value="modelValue" :title="t('wizard.title')" icon="mdi-cloud-plus-outline" :max-width="720" @update:model-value="onDialogModel">
        <p v-if="projectName" class="ctx">{{ t('wizard.contextBefore') }} <strong>{{ projectName }}</strong>.</p>
        <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

        <!-- 1. Service -->
        <section class="step">
          <div class="sh"><span class="n">1</span><v-icon size="18">mdi-room-service-outline</v-icon>{{ t('wizard.step.service') }}</div>
          <v-select v-model="selected.service" :items="services" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.service')" :loading="loadingServices"
            variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }">
              <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
              </v-list-item>
            </template>
          </v-select>
        </section>

        <!-- 2. Tool -->
        <section class="step" :class="{ off: !selected.service }">
          <div class="sh"><span class="n">2</span><v-icon size="18">mdi-wrench-outline</v-icon>{{ t('wizard.step.tool') }}</div>
          <v-select v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.tool')" :loading="loadingTools" :disabled="!selected.service"
            variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }">
              <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
              </v-list-item>
            </template>
          </v-select>
        </section>

        <!-- 3. Instance -->
        <section class="step" :class="{ off: !selected.tool }">
          <div class="sh"><span class="n">3</span><v-icon size="18">mdi-server-outline</v-icon>{{ t('wizard.step.instance') }}</div>
          <div class="inst-row">
            <v-select v-model="selected.node" :items="nodes" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.instance')" :loading="loadingNodes"
              :disabled="!selected.tool || showNewNode" variant="outlined" density="comfortable" hide-details class="flex-grow-1">
              <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
              <template #item="{ props: ip, item }">
                <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                  <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
                </v-list-item>
              </template>
            </v-select>
            <LjButton variant="ghost" :icon="showNewNode ? 'mdi-close' : 'mdi-plus'" :disabled="!selected.tool" @click="toggleNewNode">{{ showNewNode ? t('wizard.pickExisting') : t('wizard.newInstance') }}</LjButton>
          </div>

          <v-expand-transition>
            <div v-if="showNewNode" class="newnode">
              <v-text-field v-model="newNode.id" :label="t('wizard.label.id')" :hint="`${selected.tool?.id || ''}:my-instance`" persistent-hint variant="outlined" density="comfortable" class="mb-2" />
              <v-text-field v-model="newNode.name" :label="t('wizard.label.name')" variant="outlined" density="comfortable" class="mb-2" hide-details />
              <p v-if="newNodeError" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ newNodeError }}</p>
              <LjButton icon="mdi-plus" :icon-size="16" :disabled="!newNode.id || !newNode.name" :loading="creatingNode" @click="createNode">{{ t('wizard.createInstance') }}</LjButton>
            </div>
          </v-expand-transition>
        </section>

        <!-- 4. Mode -->
        <section class="step" :class="{ off: !selected.node }">
          <div class="sh"><span class="n">4</span><v-icon size="18">mdi-link-variant</v-icon>{{ t('wizard.step.mode') }}</div>
          <LjSegmented v-if="availableModes.length" v-model="selected.mode" :options="availableModes" />
          <p v-if="selected.mode" class="modehint">{{ modeHint }}</p>
        </section>

        <!-- 5. Parameters -->
        <section class="step" :class="{ off: !selected.mode }">
          <div class="sh"><span class="n">5</span><v-icon size="18">mdi-tune-variant</v-icon>{{ t('wizard.step.parameters') }}<v-progress-circular v-if="loadingParams" size="13" width="2" indeterminate class="ml-2" /></div>
          <p v-if="!loadingParams && selected.mode && selected.node && !parameters.length" class="muted">{{ t('wizard.params.emptySubscribe') }}</p>
          <!-- Parameters are ordered by display name (ascending) by default; a
               plugin may override the order and/or group them via its
               `parameterLayout` hook (see parameterGroups / resolveParameterLayout). -->
          <template v-for="(group, gi) in parameterGroups" :key="gi">
            <div v-if="group.label" class="pgroup">{{ group.label }}</div>
            <div v-for="p in group.params" :key="p.id" class="pfield">
              <!-- Plugin-supplied field (e.g. id-ldap's live group/OU
                   autocomplete) takes precedence over the default type-based
                   rendering — same hook as plugin-ui's wizard. Only resolves
                   when the owning plugin bundle is loaded. -->
              <component v-if="resolveParameterField(p)" :is="resolveParameterField(p)" v-model="paramValues[p.id]" :parameter="p" :form-values="paramValues" :mode="selected.mode"
                :is-node="false" :node-id="selected.tool?.id" :instance-node-id="selected.node?.id" />
              <v-text-field v-else-if="isTextParam(p)" v-model="paramValues[p.id]" :type="isPassword(p) ? 'password' : 'text'" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
              <v-text-field v-else-if="typeKind(p) === 'integer'" v-model.number="paramValues[p.id]" type="number" :min="p.min" :max="p.max" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
              <v-checkbox v-else-if="typeKind(p) === 'bool'" v-model="paramValues[p.id]" :label="paramLabel(p)" density="comfortable" hide-details />
              <v-select v-else-if="typeKind(p) === 'select'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
              <v-select v-else-if="['multiple','multiselect','tags'].includes(typeKind(p))" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" chips multiple variant="outlined" density="comfortable" hide-details="auto" />
              <v-text-field v-else v-model="paramValues[p.id]" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
            </div>
          </template>
        </section>
      <template #footer>
        <LjButton variant="ghost" @click="$emit('update:modelValue', false)">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-check" :disabled="!ready" :loading="creating" @click="submit">{{ t('wizard.action.createSubscription') }}</LjButton>
      </template>
  </LjDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useApi, useErrorStore, useI18nStore, NodeIcon, LjDialog, LjButton, LjSegmented } from '@ligoj/host'
import { groupParameters } from '../utils/parameterGroups.js'
import { typeKind, isTextParam, isPassword, coerce, buildParamWire, ensureToolPluginLoaded, resolveParameterField as resolveField, resolveParameterLayout as resolveLayout } from '../utils/pluginParams.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  projectId: { type: [String, Number], default: null },
  projectName: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'saved'])

const api = useApi()
const errorStore = useErrorStore()
const i18n = useI18nStore()
const t = (k, p) => i18n.t(k, p)

const selected = reactive({ service: null, tool: null, node: null, mode: null })
const services = ref([])
const tools = ref([])
const nodes = ref([])
const parameters = ref([])
const paramValues = reactive({})

const loadingServices = ref(false)
const loadingTools = ref(false)
const loadingNodes = ref(false)
const loadingParams = ref(false)
const creating = ref(false)
const error = ref(null)

const showNewNode = ref(false)
const newNode = reactive({ id: '', name: '' })
const creatingNode = ref(false)
const newNodeError = ref(null)

const rules = {
  required: (v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || t('wizard.rule.required'),
}

/* Modes offered by the picked tool (backend SubscriptionMode: LINK/CREATE/ALL). */
const availableModes = computed(() => {
  const m = String(selected.tool?.mode || '').toLowerCase()
  const out = []
  if (m === 'all' || m === 'create') out.push({ value: 'create', label: t('wizard.modeCreate') })
  if (m === 'all' || m === 'link' || !m) out.push({ value: 'link', label: t('wizard.modeLink') })
  return out
})
const modeHint = computed(() => selected.mode === 'create' ? t('wizard.modeHintCreate') : t('wizard.modeHintLink'))

const ready = computed(() =>
  !!props.projectId && !!selected.service && !!selected.tool && !!selected.node && !!selected.mode && !showNewNode.value)

/* ---- param helpers ---- */
/* typeKind/isTextParam/isPassword/coerce/buildParamWire/ensureToolPluginLoaded
   and the plugin-feature resolution are shared with NodeEditDialog — see
   utils/pluginParams.js. These wrappers bind the i18n store / reactive
   selection, which stay dialog-local. */
function tOrNull(key) { const v = i18n.t(key); return v === key ? null : v }
function paramLabel(p) { return `${tOrNull(p.id) ?? p.id}${(p.mandatory || p.required) ? ' *' : ''}` }
function ruleFor(p) { return (p.mandatory || p.required) ? [rules.required] : [] }

/* Subscription context (isNode = false): the parameter form drives a new
   subscription against `selected.node`. */
function subscriptionCtx(parameter) {
  const nodeId = selected.tool?.id
  return { parameter, mode: selected.mode || null, isNode: false, formValues: paramValues, nodeId, instanceNodeId: selected.node?.id || null }
}
function resolveParameterField(p) { return resolveField(selected.tool?.id, subscriptionCtx(p), 'wizard') }

/* Display name of a parameter (translated label, without the mandatory marker),
   used as the default sort key. */
function paramName(p) { const id = p?.id; const l = id ? tOrNull(id) : null; return l ?? id ?? '' }

/* Parameters arranged for display: plugin-declared groups first (each with its
   parameters in the declared order), then every remaining parameter ordered by
   display name, ascending, in a trailing unlabeled group. A group's `label` is
   resolved through i18n (falling back to the literal). See groupParameters(). */
const parameterGroups = computed(() =>
  groupParameters(parameters.value, resolveLayout(selected.tool?.id, subscriptionCtx(), 'wizard'), { name: paramName, label: (l) => tOrNull(l) ?? l }))

/* ---- loaders ---- */
async function fetchNodes(url) {
  const data = await api.get(url)
  const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
  return list.filter((n) => n.enabled !== false)
}
async function loadServices() { loadingServices.value = true; try { services.value = await fetchNodes('rest/node?refined=service&rows=1000') } finally { loadingServices.value = false } }
async function loadTools(id) { loadingTools.value = true; try { tools.value = await fetchNodes(`rest/node?refined=${encodeURIComponent(id)}&rows=1000`) } finally { loadingTools.value = false } }
async function loadNodes(id) { loadingNodes.value = true; try { nodes.value = await fetchNodes(`rest/node?refined=${encodeURIComponent(id)}&rows=1000`) } finally { loadingNodes.value = false } }

async function loadParameters(nodeId, mode) {
  loadingParams.value = true
  // AWAIT the tool's plugin bundle BEFORE assigning parameters, so the
  // registry already holds it when the param fields first render — otherwise
  // resolveParameterField() returns null on first paint and the custom field
  // (e.g. id-ldap's IdGroupField) silently falls back to a plain text field.
  await ensureToolPluginLoaded(selected.tool?.id || nodeId)
  try {
    const data = await api.get(`rest/node/${encodeURIComponent(nodeId)}/parameter/${mode.toUpperCase()}`)
    const raw = Array.isArray(data) ? data : (data?.data || [])
    parameters.value = raw.filter((p) => p && p.availableForSubscription !== false)
    for (const k of Object.keys(paramValues)) delete paramValues[k]
    for (const p of parameters.value) {
      if (p.defaultValue != null) paramValues[p.id] = coerce(p)
      else { const k = typeKind(p); paramValues[p.id] = k === 'bool' ? false : (['multiple', 'multiselect', 'tags'].includes(k) ? [] : '') }
    }
  } finally { loadingParams.value = false }
}

/* ---- cascading invalidation ---- */
watch(() => selected.service, async (svc) => {
  selected.tool = null; selected.node = null; selected.mode = null
  tools.value = []; nodes.value = []; parameters.value = []
  newNode.id = ''; newNode.name = ''; newNodeError.value = null; showNewNode.value = false
  if (svc) await loadTools(svc.id)
})
watch(() => selected.tool, async (tool) => {
  selected.node = null; selected.mode = null
  nodes.value = []; parameters.value = []
  newNode.id = ''; newNode.name = ''; newNodeError.value = null; showNewNode.value = false
  if (tool) {
    await loadNodes(tool.id)
    const modes = availableModes.value
    if (modes.length === 1) selected.mode = modes[0].value
  }
})
watch([() => selected.node, () => selected.mode], async () => {
  parameters.value = []
  if (!selected.mode || !selected.node) return
  await loadParameters(selected.node.id, selected.mode)
})

/* ---- new instance ---- */
function toggleNewNode() {
  showNewNode.value = !showNewNode.value
  newNodeError.value = null
  if (showNewNode.value) { selected.node = null; if (!newNode.id && selected.tool?.id) newNode.id = `${selected.tool.id}:` }
  else { newNode.id = ''; newNode.name = '' }
}
async function createNode() {
  newNodeError.value = null; creatingNode.value = true
  try {
    const result = await api.post('rest/node', { id: newNode.id, name: newNode.name, node: selected.tool?.id })
    if (result === null) { newNodeError.value = t('wizard.error.newNodeRejected'); return }
    await loadNodes(selected.tool.id)
    const created = nodes.value.find((n) => n.id === newNode.id)
    if (created) selected.node = created
    showNewNode.value = false; newNode.id = ''; newNode.name = ''
  } finally { creatingNode.value = false }
}

/* ---- submit ---- */
async function submit() {
  if (!ready.value) return
  creating.value = true; error.value = null
  try {
    const payload = {
      node: selected.node.id,
      project: Number(props.projectId),
      mode: String(selected.mode).toUpperCase(),
      parameters: parameters.value.map((p) => buildParamWire(p, paramValues[p.id])).filter(Boolean),
    }
    const id = await api.post('rest/subscription', payload)
    if (id != null) {
      errorStore.success(t('wizard.success.subscriptionCreated'))
      emit('saved', { id })
      emit('update:modelValue', false)
    } else {
      error.value = t('wizard.error.subscriptionFailed')
    }
  } finally { creating.value = false }
}

function reset() {
  selected.service = null; selected.tool = null; selected.node = null; selected.mode = null
  tools.value = []; nodes.value = []; parameters.value = []
  for (const k of Object.keys(paramValues)) delete paramValues[k]
  showNewNode.value = false; newNode.id = ''; newNode.name = ''; newNodeError.value = null; error.value = null
}
function onDialogModel(v) { if (!v) emit('update:modelValue', false) }

watch(() => props.modelValue, (val) => {
  if (val) { reset(); if (!services.value.length) loadServices() }
})
</script>

<style scoped>
/* Dialog chrome (card, header, footer, mode segment, buttons, base field
   rounding) now comes from <LjDialog> / <LjSegmented> / <LjButton> + the
   global `.lj-surface` on the dialog card, which supplies the ink, font,
   radius, hover, surface and border vars these wizard-step rules read. Only
   the step layout specific to this form remains. */
:deep(.v-field) { border-radius: var(--radius-sm); font-family: var(--font); }
:deep(.v-label) { font-weight: 600; }

.ctx { font-size: 13.5px; color: var(--ink-2); margin: 2px 0 14px; }
.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 6px 0; }

.step { padding: 12px 0; border-top: 1px solid var(--border); transition: opacity .2s; }
.step:first-of-type { border-top: 0; }
.step.off { opacity: .45; pointer-events: none; }
.sh { display: flex; align-items: center; gap: 9px; font-family: var(--font); font-weight: var(--bold); font-size: 14.5px; color: var(--ink); margin-bottom: 10px; }
.sh .n { width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: #fff; background: linear-gradient(135deg, #ff9436, #ff5a52); }
.opt { display: inline-flex; align-items: center; gap: 8px; }
.opt :deep(img.tool-icon), .opt :deep(i) { width: 20px; height: 20px; font-size: 18px; }

.inst-row { display: flex; align-items: flex-start; gap: 10px; }
.newnode { margin-top: 12px; padding: 14px; border-radius: var(--radius-sm); background: var(--hover); border: var(--border-w) dashed var(--border-2); }

.modehint { font-size: 12.5px; color: var(--ink-3); margin: 8px 0 0; }
.muted { font-size: 13px; color: var(--ink-3); }
.pgroup { margin: 4px 0 10px; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-3); }
.pgroup + .pfield { margin-top: 0; }
.pfield { margin-bottom: 12px; }
</style>
