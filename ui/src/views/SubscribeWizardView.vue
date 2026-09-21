<!--
  SubscribeWizardDialog — subscription wizard (subscribe mode
  only; edit-node / create-node belong to the Administration views). Same
  `.vmodal` chrome as the other dialogs, but taller and scrollable. Cascading
  pickers: service → tool → existing instance (instances are created from the
  Administration views only), then a segmented mode control, then the node's dynamic parameter
  fields. POSTs rest/subscription on confirm.

  Ported from plugin-ui's SubscribeWizardView. Standalone caveat: plugin
  parameter-field overrides and plugin i18n labels need the plugin bundles
  loaded (install()), which the app doesn't do — so parameters render
  with the default type-based fields and raw ids as labels. The core flow
  (service/tool/instance/mode/params → subscribe) works against the live
  backend nodes.
-->
<template>
  <LjDialog :model-value="modelValue" :title="t('wizard.title')" icon="mdi-cloud-plus-outline" :max-width="1040" @update:model-value="onDialogModel">
        <p v-if="projectName" class="ctx">{{ t('wizard.contextBefore') }} <strong>{{ projectName }}</strong>.</p>
        <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

        <!-- 1. Service -->
        <!-- Steps 1-3 share one row: service, tool, existing instance -->
        <div class="step-row">
        <section class="step">
          <div class="sh"><span class="n">1</span><v-icon size="18">mdi-room-service-outline</v-icon>{{ t('wizard.step.service') }}</div>
          <LigojSelect v-model="selected.service" :items="services" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.service')" :loading="loadingServices"
            variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }">
              <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
              </v-list-item>
            </template>
          </LigojSelect>
        </section>

        <!-- 2. Tool -->
        <section class="step" :class="{ off: !selected.service }">
          <div class="sh"><span class="n">2</span><v-icon size="18">mdi-wrench-outline</v-icon>{{ t('wizard.step.tool') }}</div>
          <LigojSelect v-model="selected.tool" :items="tools" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.tool')" :loading="loadingTools" :disabled="!selected.service"
            variant="outlined" density="comfortable" hide-details>
            <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
            <template #item="{ props: ip, item }">
              <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
              </v-list-item>
            </template>
          </LigojSelect>
        </section>

        <!-- 3. Instance -->
        <section class="step" :class="{ off: !selected.tool }">
          <div class="sh"><span class="n">3</span><v-icon size="18">mdi-server-outline</v-icon>{{ t('wizard.step.instance') }}</div>
            <LigojSelect v-model="selected.node" :items="nodes" item-title="name" item-value="id" return-object :placeholder="t('wizard.label.instance')" :loading="loadingNodes"
              :disabled="!selected.tool" variant="outlined" density="comfortable" hide-details class="flex-grow-1">
              <template #selection="{ item }"><span v-if="item" class="opt"><NodeIcon :node="item" /> {{ item.name || item.id }}</span></template>
              <template #item="{ props: ip, item }">
                <v-list-item v-if="item" v-bind="ip" :title="item.name || item.id" :subtitle="item.id">
                  <template #prepend><NodeIcon :node="item" class="mr-2" /></template>
                </v-list-item>
              </template>
            </LigojSelect>
        </section>
        </div>

        <!-- 4. Mode -->
        <section class="step" :class="{ off: !selected.node }">
          <div class="sh"><span class="n">4</span><v-icon size="18">mdi-link-variant</v-icon>{{ t('wizard.step.mode') }}</div>
          <!-- The mode toggle with its help text on the right (wraps below on a narrow dialog) -->
          <div class="mode-row">
            <LjSegmented v-if="availableModes.length" v-model="selected.mode" :options="availableModes" />
            <p v-if="selected.mode" class="modehint">{{ modeHint }}</p>
            <p v-else-if="noMode" class="modehint">{{ t('wizard.modeNone') }}</p>
          </div>
        </section>

        <!-- 5. Parameters -->
        <section class="step" :class="{ off: !selected.mode }">
          <div class="sh"><span class="n">5</span><v-icon size="18">mdi-tune-variant</v-icon>{{ t('wizard.step.parameters') }}<v-progress-circular v-if="loadingParams" size="13" width="2" indeterminate class="ml-2" /></div>
          <p v-if="!loadingParams && selected.mode && selected.node && !parameters.length" class="muted">{{ t('wizard.params.emptySubscribe') }}</p>
          <!-- Parameters are ordered by display name (ascending) by default; a
               plugin may override the order and/or group them via its
               `parameterLayout` hook (see parameterGroups / resolveParameterLayout). -->
          <ParameterForm :groups="parameterGroups" :values="paramValues" :resolve-field="resolveParameterField"
            :field-context="{ mode: selected.mode, isNode: false, nodeId: selected.tool?.id, instanceNodeId: selected.node?.id }" @update="(id, v) => (paramValues[id] = v)" />
        </section>
      <template #footer>
        <LjButton variant="ghost" @click="$emit('update:modelValue', false)">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-check" :disabled="!ready" :loading="creating" @click="submit">{{ t('wizard.action.createSubscription') }}</LjButton>
      </template>
  </LjDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useApi, useErrorStore, useI18nStore, NodeIcon, LjDialog, LjButton, LjSegmented, LigojSelect } from '@ligoj/host'
import { groupParameters } from '../utils/parameterGroups.js'
import { coerce, buildParamWire, ensureToolPluginLoaded, resolveParameterField as resolveField, resolveParameterLayout as resolveLayout, defaultParamValue, groupNaming } from '../utils/pluginParams.js'
import ParameterForm from '../components/ParameterForm.vue'
import { subscriptionModes } from '../utils/subscriptionModes.js'

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



/* Modes offered by the picked INSTANCE (backend SubscriptionMode: NONE/LINK/CREATE/ALL). The instance decides, not
   its tool: a tool is often 'none' (nothing subscribes to the tool itself) while its instances accept 'link'. */
const availableModes = computed(() => subscriptionModes(selected.node?.mode).map((value) => (
  { value, label: t(value === 'create' ? 'wizard.modeCreate' : 'wizard.modeLink') })))
const noMode = computed(() => !!selected.node && !availableModes.value.length)
const modeHint = computed(() => selected.mode === 'create' ? t('wizard.modeHintCreate') : t('wizard.modeHintLink'))

const ready = computed(() =>
  !!props.projectId && !!selected.service && !!selected.tool && !!selected.node && !!selected.mode)

/* ---- param helpers ---- */
/* typeKind/isTextParam/isPassword/coerce/buildParamWire/ensureToolPluginLoaded
   and the plugin-feature resolution are shared with NodeEditDialog — see
   utils/pluginParams.js. These wrappers bind the i18n store / reactive
   selection, which stay dialog-local. */

/* Subscription context (isNode = false): the parameter form drives a new
   subscription against `selected.node`. */
function subscriptionCtx(parameter) {
  const nodeId = selected.tool?.id
  return { parameter, mode: selected.mode || null, isNode: false, formValues: paramValues, nodeId, instanceNodeId: selected.node?.id || null }
}
function resolveParameterField(p) { return resolveField(selected.tool?.id, subscriptionCtx(p), 'wizard') }

/* Display name of a parameter (translated label, without the mandatory marker),
   used as the default sort key. */

/* Parameters arranged for display: plugin-declared groups first (each with its
   parameters in the declared order), then every remaining parameter ordered by
   display name, ascending, in a trailing unlabeled group. A group's `label` is
   resolved through i18n (falling back to the literal). See groupParameters(). */
const parameterGroups = computed(() =>
  groupParameters(parameters.value, resolveLayout(selected.tool?.id, subscriptionCtx(), 'wizard'), groupNaming(i18n.t)))

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
      else paramValues[p.id] = defaultParamValue(p)
    }
  } finally { loadingParams.value = false }
}

/* ---- cascading invalidation ---- */
watch(() => selected.service, async (svc) => {
  selected.tool = null; selected.node = null; selected.mode = null
  tools.value = []; nodes.value = []; parameters.value = []
  if (svc) {
    await loadTools(svc.id)
    // Pre-select the first tool, unless the service changed while loading
    if (selected.service === svc && !selected.tool) selected.tool = tools.value[0] || null
  }
})
watch(() => selected.tool, async (tool) => {
  selected.node = null; selected.mode = null
  nodes.value = []; parameters.value = []
  if (tool) {
    await loadNodes(tool.id)
    // Pre-select the first instance, unless the tool changed while loading
    if (selected.tool === tool && !selected.node) selected.node = nodes.value[0] || null
  }
})
// The mode follows the instance: the first offered mode is pre-selected, a mode no longer offered is replaced.
watch(() => selected.node, () => {
  const modes = availableModes.value.map((m) => m.value)
  if (!modes.includes(selected.mode)) selected.mode = modes[0] || null
})
watch([() => selected.node, () => selected.mode], async () => {
  parameters.value = []
  if (!selected.mode || !selected.node) return
  await loadParameters(selected.node.id, selected.mode)
})

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
  error.value = null
}
function onDialogModel(v) { if (!v) emit('update:modelValue', false) }

watch(() => props.modelValue, (val) => {
  if (val) {
    reset()
    // Pre-select the first service; the watchers cascade to the first tool, instance and mode
    Promise.resolve(services.value.length ? null : loadServices()).then(() => {
      if (props.modelValue && !selected.service) selected.service = services.value[0] || null
    })
  }
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
/* Steps 1-3 side by side; they stack again on a narrow dialog */
.step-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 18px; }
.step-row .step { border-top: 0; min-width: 0; }
.step-row + .step { border-top: 0; }
@media (max-width: 860px) {
  .step-row { grid-template-columns: 1fr; }
  .step-row .step + .step { border-top: 1px solid var(--border); }
}
.sh { display: flex; align-items: center; gap: 9px; font-family: var(--font); font-weight: var(--bold); font-size: 14.5px; color: var(--ink); margin-bottom: 10px; }
.sh .n { width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: #fff; background: linear-gradient(135deg, #ff9436, #ff5a52); }
.opt { display: inline-flex; align-items: center; gap: 8px; }
.opt :deep(img.tool-icon), .opt :deep(i) { width: 20px; height: 20px; font-size: 18px; }


.mode-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; }
.modehint { font-size: 12.5px; color: var(--ink-3); margin: 0; flex: 1 1 260px; }
.muted { font-size: 13px; color: var(--ink-3); }
</style>
