<!--
  NodeEditDialog — 2026 "Vibrant" create/edit dialog for a Ligoj node
  (Administration → Nodes). Ports plugin-ui's SubscribeWizardView create-node
  / edit-node modes onto the .vmodal chrome, reusing the same cascading
  service/tool pickers, segmented mode control and dynamic parameter fields
  (incl. plugin-supplied fields via resolveParameterField).

  - create-node: pick service → tool, set id + name, mode, parameters →
    POST rest/node.
  - edit-node:   edit the given node's name + parameters → PUT rest/node.
-->
<template>
  <LjDialog :model-value="modelValue" :title="dialogTitle" icon="mdi-server-network" :max-width="720" @update:model-value="onDialogModel">
        <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

        <!-- 1. Service -->
        <section class="step">
          <div class="sh"><span class="n">1</span><v-icon size="18">mdi-room-service-outline</v-icon>{{ t('wizard.step.service') }}</div>
          <div v-if="isEdit" class="ro"><NodeIcon :node="selected.service" /> {{ selected.service?.name || selected.service?.id || '—' }}</div>
          <v-select v-else v-model="selected.service" :items="services" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.service')" :loading="loadingServices" variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }"><v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id"><template #prepend><NodeIcon :node="item" class="mr-2" /></template></v-list-item></template>
          </v-select>
        </section>

        <!-- 2. Tool -->
        <section class="step" :class="{ off: !isEdit && !selected.service }">
          <div class="sh"><span class="n">2</span><v-icon size="18">mdi-wrench-outline</v-icon>{{ t('wizard.step.tool') }}</div>
          <div v-if="isEdit" class="ro"><NodeIcon :node="selected.tool" /> {{ selected.tool?.name || selected.tool?.id || '—' }}</div>
          <v-select v-else v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.tool')" :loading="loadingTools" :disabled="!selected.service" variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }"><v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id"><template #prepend><NodeIcon :node="item" class="mr-2" /></template></v-list-item></template>
          </v-select>
        </section>

        <!-- 3. Identity (id + name) -->
        <section class="step" :class="{ off: !isEdit && !selected.tool }">
          <div class="sh"><span class="n">3</span><v-icon size="18">mdi-server-outline</v-icon>{{ t('system.node.instanceStep') }}</div>
          <v-text-field v-if="!isEdit" v-model="form.id" :label="t('wizard.label.id')" :hint="`${selected.tool?.id || ''}:my-instance`" persistent-hint variant="outlined" density="comfortable" class="mb-2" :rules="[rules.required, rules.nodeId]" />
          <v-text-field v-model="form.name" :label="t('wizard.label.name')" variant="outlined" density="comfortable" hide-details="auto" :rules="[rules.required]" />
        </section>

        <!-- 4. Mode -->
        <section class="step" :class="{ off: !isEdit && !selected.tool }">
          <div class="sh"><span class="n">4</span><v-icon size="18">mdi-link-variant</v-icon>{{ t('wizard.step.mode') }}</div>
          <NodeModeChip v-if="isEdit" :mode="selected.mode || 'all'" />
          <LjSegmented v-else v-model="selected.mode" :options="availableModes" />
        </section>

        <!-- 5. Parameters -->
        <section class="step" :class="{ off: !isEdit && (!selected.mode || !selected.tool) }">
          <div class="sh"><span class="n">5</span><v-icon size="18">mdi-tune-variant</v-icon>{{ t('wizard.step.parameters') }}<v-progress-circular v-if="loadingParams" size="13" width="2" indeterminate class="ml-2" /></div>
          <p v-if="!loadingParams && !parameters.length && (isEdit || selected.mode)" class="muted">{{ t('wizard.params.emptyEdit') }}</p>
          <div v-for="p in parameters" :key="p.id" class="pfield">
            <component v-if="resolveParameterField(p)" :is="resolveParameterField(p)" v-model="paramValues[p.id]" :parameter="p" :form-values="paramValues" :mode="selected.mode" :is-node="true" :node-id="currentNodeId" :instance-node-id="currentNodeId" />
            <v-text-field v-else-if="isTextParam(p)" v-model="paramValues[p.id]" :type="isPassword(p) ? 'password' : 'text'" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
            <v-text-field v-else-if="typeKind(p) === 'integer'" v-model.number="paramValues[p.id]" type="number" :min="p.min" :max="p.max" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
            <v-checkbox v-else-if="typeKind(p) === 'bool'" v-model="paramValues[p.id]" :label="paramLabel(p)" density="comfortable" hide-details />
            <v-select v-else-if="typeKind(p) === 'select'" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
            <v-select v-else-if="['multiple','multiselect','tags'].includes(typeKind(p))" v-model="paramValues[p.id]" :items="p.values || []" :label="paramLabel(p)" :rules="ruleFor(p)" chips multiple variant="outlined" density="comfortable" hide-details="auto" />
            <v-text-field v-else v-model="paramValues[p.id]" :label="paramLabel(p)" :rules="ruleFor(p)" variant="outlined" density="comfortable" hide-details="auto" />
          </div>
        </section>
      <template #footer>
        <LjButton variant="ghost" @click="$emit('update:modelValue', false)">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :disabled="!ready" :loading="saving" @click="submit">{{ isEdit ? t('common.save') : t('wizard.action.createNode') }}</LjButton>
      </template>
  </LjDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useApi, useErrorStore, useI18nStore, NodeIcon, NodeModeChip, nodeType, pluginRegistry, pluginIdFromKey, loadPlugin, LjDialog, LjButton, LjSegmented } from '@ligoj/host'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  node: { type: Object, default: null }, // present → edit-node
})
const emit = defineEmits(['update:modelValue', 'saved'])

const api = useApi()
const errorStore = useErrorStore()
const i18n = useI18nStore()
const t = (k, p) => i18n.t(k, p)
const isEdit = computed(() => !!props.node)
// LjDialog takes a plain string title; fold the edited node id into it (the
// former separate `.hcode` chip in the header). Cosmetic-only change.
const dialogTitle = computed(() => isEdit.value
  ? `${t('system.node.editTitle')}${props.node?.id ? ` · ${props.node.id}` : ''}`
  : t('system.node.createTitle'))

const selected = reactive({ service: null, tool: null, node: null, mode: null })
const form = reactive({ id: '', name: '' })
const services = ref([])
const tools = ref([])
const parameters = ref([])
const paramValues = reactive({})
const loadingServices = ref(false)
const loadingTools = ref(false)
const loadingParams = ref(false)
const saving = ref(false)
const error = ref(null)

const rules = {
  required: (v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || t('wizard.rule.required'),
  nodeId: (v) => /^[\w-]+(:[\w-]+)+$/.test(v || '') || t('wizard.rule.nodeId'),
}

const availableModes = computed(() => {
  const m = String(selected.tool?.mode || '').toLowerCase()
  const out = []
  if (m === 'all' || m === 'create') out.push({ value: 'create', label: t('wizard.modeCreate') })
  if (m === 'all' || m === 'link' || !m) out.push({ value: 'link', label: t('wizard.modeLink') })
  return out
})
const currentNodeId = computed(() => isEdit.value ? props.node?.id : selected.tool?.id)
const ready = computed(() => isEdit.value
  ? !!form.name
  : !!selected.service && !!selected.tool && !!selected.mode && !!form.id && !!form.name)

/* ---- param helpers (shared with the subscribe wizard) ---- */
function typeKind(p) { return String(p?.type || '').toLowerCase() }
function isTextParam(p) { const k = typeKind(p); return !k || ['text', 'password', 'node', 'project'].includes(k) }
function isPassword(p) { return !!p.secured || typeKind(p) === 'password' }
function tOrNull(key) { const v = i18n.t(key); return v === key ? null : v }
function paramLabel(p) { return `${tOrNull(p.id) ?? p.id}${(p.mandatory || p.required) ? ' *' : ''}` }
function ruleFor(p) { return (p.mandatory || p.required) ? [rules.required] : [] }
function coerce(p) { const k = typeKind(p); if (k === 'integer') return Number(p.defaultValue); if (k === 'bool') return p.defaultValue === true || p.defaultValue === 'true'; return p.defaultValue }
function buildParamWire(p) {
  const value = paramValues[p.id]
  if ((value === '' || value == null || (Array.isArray(value) && !value.length)) && !p.mandatory && !p.required) return null
  const base = { parameter: p.id }; const k = typeKind(p)
  if (k === 'integer') return { ...base, integer: Number(value) }
  if (k === 'bool') return { ...base, bool: !!value }
  if (['multiple', 'multiselect', 'tags'].includes(k)) return { ...base, selections: value || [] }
  return { ...base, text: value }
}
async function ensureToolPluginLoaded(nodeId) {
  if (typeof nodeId !== 'string') return
  const pluginId = pluginIdFromKey(nodeId.split(':').filter(Boolean).slice(0, 3).join(':'))
  if (!pluginId || pluginRegistry.has(pluginId)) return
  try { await loadPlugin(pluginId) } catch {
    if (pluginRegistry.has(pluginId)) return
    try {
      const def = (await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}main/${pluginId}/vue/index.js?cb=${Date.now()}`))?.default
      if (def && typeof def === 'object') { if (!def.id) def.id = pluginId; pluginRegistry.register(def.id, def); if (typeof def.install === 'function') await def.install({ pluginId }) }
    } catch { /* default fields */ }
  }
}
function resolveParameterField(p) {
  const nodeId = currentNodeId.value
  if (!nodeId) return null
  const ctx = { parameter: p, mode: selected.mode || null, isNode: true, formValues: paramValues, nodeId, instanceNodeId: nodeId }
  const candidates = []
  const sub = pluginIdFromKey(nodeId)
  if (sub) candidates.push(sub)
  const parts = String(nodeId).split(':').filter(Boolean)
  if (parts.length >= 2 && parts[1] && parts[1] !== sub) candidates.push(parts[1])
  for (const id of candidates) {
    const plugin = pluginRegistry.get(id)
    if (typeof plugin?.feature !== 'function') continue
    try { const c = plugin.feature('parameterField', ctx); if (c) return c } catch { /* ignore */ }
  }
  return null
}

/* ---- loaders ---- */
async function fetchNodes(url) { const d = await api.get(url); const l = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []); return l.filter((n) => n.enabled !== false) }
async function loadServices() { loadingServices.value = true; try { services.value = await fetchNodes('rest/node?refined=service&rows=1000') } finally { loadingServices.value = false } }
async function loadTools(id) { loadingTools.value = true; try { tools.value = await fetchNodes(`rest/node?refined=${encodeURIComponent(id)}&rows=1000`) } finally { loadingTools.value = false } }

async function loadParameters(nodeId, mode) {
  loadingParams.value = true
  await ensureToolPluginLoaded(selected.tool?.id || nodeId)
  try {
    const data = await api.get(`rest/node/${encodeURIComponent(nodeId)}/parameter/${mode.toUpperCase()}`)
    const raw = Array.isArray(data) ? data : (data?.data || [])
    parameters.value = raw.filter((p) => p && p.availableForNode !== false)
    for (const k of Object.keys(paramValues)) delete paramValues[k]
    for (const p of parameters.value) {
      if (p.defaultValue != null) paramValues[p.id] = coerce(p)
      else { const k = typeKind(p); paramValues[p.id] = k === 'bool' ? false : (['multiple', 'multiselect', 'tags'].includes(k) ? [] : '') }
    }
  } finally { loadingParams.value = false }
}

/* ---- cascade (create-node) ---- */
watch(() => selected.service, async (svc) => {
  if (isEdit.value) return
  selected.tool = null; selected.mode = null; tools.value = []; parameters.value = []; form.id = ''
  if (svc) await loadTools(svc.id)
})
watch(() => selected.tool, async (tool) => {
  if (isEdit.value) return
  selected.mode = null; parameters.value = []
  form.id = tool ? `${tool.id}:` : ''
  if (tool) { const modes = availableModes.value; if (modes.length === 1) selected.mode = modes[0].value }
})
watch(() => selected.mode, async (mode) => {
  if (isEdit.value || !mode || !selected.tool) return
  await loadParameters(selected.tool.id, mode)
})

/* ---- edit bootstrap ---- */
async function bootstrapEdit(node) {
  const type = nodeType(node)
  if (type === 'instance') { selected.service = node.refined?.refined || null; selected.tool = node.refined || null; selected.node = node }
  else if (type === 'tool') { selected.service = node.refined || null; selected.tool = node; selected.node = null }
  else { selected.service = node; selected.tool = null; selected.node = null }
  selected.mode = node.mode || 'all'
  form.id = node.id; form.name = node.name || ''
  await ensureToolPluginLoaded(node.id)
  loadingParams.value = true
  try {
    const data = await api.get(`rest/node/${encodeURIComponent(node.id)}/parameter-value/${(selected.mode || 'all').toUpperCase()}`)
    const list = Array.isArray(data) ? data : (data?.data || [])
    const visible = list.filter((it) => it?.parameter && it.parameter.availableForNode !== false)
    parameters.value = visible.map((it) => it.parameter)
    for (const k of Object.keys(paramValues)) delete paramValues[k]
    for (const it of visible) {
      const p = it.parameter; const k = typeKind(p)
      if (k === 'integer') paramValues[p.id] = it.integer ?? ''
      else if (k === 'bool') paramValues[p.id] = !!it.bool
      else if (['multiple', 'multiselect', 'tags'].includes(k)) paramValues[p.id] = it.selections || []
      else paramValues[p.id] = it.text ?? ''
    }
  } finally { loadingParams.value = false }
}

function reset() {
  selected.service = null; selected.tool = null; selected.node = null; selected.mode = null
  tools.value = []; parameters.value = []; form.id = ''; form.name = ''; error.value = null
  for (const k of Object.keys(paramValues)) delete paramValues[k]
}
function onDialogModel(v) { if (!v) emit('update:modelValue', false) }

watch(() => props.modelValue, (val) => {
  if (!val) return
  reset()
  if (isEdit.value) bootstrapEdit(props.node)
  else if (!services.value.length) loadServices()
})

/* ---- submit ---- */
function wireMode(m) { return m ? String(m).toUpperCase() : m }
async function submit() {
  if (!ready.value) return
  saving.value = true; error.value = null
  try {
    const parametersWire = parameters.value.map(buildParamWire).filter(Boolean)
    // Use `{ raw: true }` so we branch on the real HTTP status: a successful
    // save returns 204 No Content, which `useApi` otherwise reports as the
    // same `null` it returns on failure — that ambiguity left the dialog
    // open with no feedback. `handleResponse` (still invoked) toasts any
    // error (incl. the data-integrity case), so here we only act on success.
    const res = isEdit.value
      ? await api.put('rest/node', { id: props.node.id, node: props.node.refined?.id, name: form.name, mode: wireMode(selected.mode), untouchedParameters: false, parameters: parametersWire }, { raw: true })
      : await api.post('rest/node', { id: form.id, name: form.name, node: selected.tool?.id, mode: wireMode(selected.mode), untouchedParameters: false, parameters: parametersWire }, { raw: true })
    if (!res || !res.ok) {
      error.value = t(isEdit.value ? 'wizard.error.saveFailed' : 'wizard.error.nodeCreationFailed')
      return
    }
    // Confirmation toast branded with the saved node's icon. For a new node
    // the instance doesn't exist yet, so synthesise a node-like object from
    // its id + the chosen tool's icon classes.
    const savedNode = isEdit.value
      ? props.node
      : { id: form.id, name: form.name, uiClasses: selected.tool?.uiClasses }
    errorStore.success(t(isEdit.value ? 'wizard.success.nodeUpdated' : 'wizard.success.nodeCreated', { name: form.name }), { node: savedNode })
    emit('saved'); emit('update:modelValue', false)
  } finally { saving.value = false }
}
</script>

<style scoped>
/* Dialog chrome (card, header, footer, mode segment, buttons, base field
   rounding) now comes from <LjDialog> / <LjSegmented> / <LjButton> + the
   global `.lj-surface` on the dialog card, which supplies the ink, font,
   mono, radius and hover vars these step rules read. Only the wizard-step
   layout specific to this form remains; it scopes onto the slotted dialog
   content via :deep() where it targets Vuetify internals. */
:deep(.v-label) { font-weight: 600; }
.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 6px 0; }
.step { padding: 12px 0; border-top: 1px solid var(--border); transition: opacity .2s; }
.step:first-of-type { border-top: 0; }
.step.off { opacity: .45; pointer-events: none; }
.sh { display: flex; align-items: center; gap: 9px; font-family: var(--font); font-weight: var(--bold); font-size: 14.5px; color: var(--ink); margin-bottom: 10px; }
.sh .n { width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: #fff; background: linear-gradient(135deg, #ff9436, #ff5a52); }
.opt { display: inline-flex; align-items: center; gap: 8px; }
.opt :deep(img.tool-icon), .opt :deep(i) { width: 20px; height: 20px; font-size: 18px; }
.ro { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font); font-weight: 700; font-size: 14px; color: var(--ink); padding: 8px 12px; border-radius: var(--radius-sm); background: var(--hover); }
.ro :deep(img.tool-icon), .ro :deep(i) { width: 20px; height: 20px; font-size: 18px; }
.muted { font-size: 13px; color: var(--ink-3); }
.pfield { margin-bottom: 12px; }
</style>
