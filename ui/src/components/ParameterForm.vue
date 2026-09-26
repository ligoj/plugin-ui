<!--
  ParameterForm — the auto-rendered form of a node's parameters, shared by the subscription wizard
  (SubscribeWizardView) and the node editor (NodeEditDialog). It renders the groups computed by
  `groupParameters` (plugin `parameterLayout` hook), and for each parameter either the plugin's custom field
  (`parameterField` hook, resolved by the caller through `resolve-field`) or the default input of its type.

  The values stay owned by the caller: this component never mutates `values`, it emits `update`.

    <ParameterForm :groups="parameterGroups" :values="paramValues" :resolve-field="resolveParameterField"
      :field-context="{ mode, isNode, nodeId, instanceNodeId }" @update="(id, v) => (paramValues[id] = v)" />
-->
<template>
  <template v-for="(group, gi) in groups" :key="gi">
    <div v-if="group.label" class="pgroup">{{ group.label }}</div>
    <div v-for="p in group.params" :key="p.id" class="pfield" :class="{ 'pfield--deprecated': isDeprecated(p) }">
      <v-chip v-if="isDeprecated(p)" size="x-small" color="warning" variant="tonal" class="pfield-deprecated" prepend-icon="mdi-alert-outline">{{ t('wizard.params.deprecated') }}</v-chip>
      <component :is="resolveField(p)" v-if="resolveField(p)" :model-value="values[p.id]" :parameter="p" :form-values="values" :mode="fieldContext.mode"
        :is-node="!!fieldContext.isNode" :node-id="fieldContext.nodeId" :instance-node-id="fieldContext.instanceNodeId" :project="fieldContext.project ?? null" @update:model-value="set(p, $event)" />
      <LigojTextField v-else-if="isTextParam(p)" :model-value="values[p.id]" :type="isPassword(p) ? 'password' : 'text'" v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojTextField v-else-if="typeKind(p) === 'integer'" :model-value="values[p.id]" type="number" :min="p.min" :max="p.max" v-bind="common(p)" @update:model-value="set(p, $event === '' || $event == null ? $event : Number($event))" />
      <v-checkbox v-else-if="typeKind(p) === 'bool'" :model-value="values[p.id]" :label="paramLabel(p)" density="comfortable" :hint="paramDescription(p)" persistent-hint hide-details="auto" @update:model-value="set(p, $event)" />
      <LigojSelect v-else-if="typeKind(p) === 'select'" :model-value="values[p.id]" :items="p.values || []" v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojSelect v-else-if="MULTIPLE.includes(typeKind(p))" :model-value="values[p.id]" :items="p.values || []" chips multiple v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojTextField v-else :model-value="values[p.id]" v-bind="common(p)" @update:model-value="set(p, $event)" />
    </div>
  </template>
</template>

<script setup>
import { useI18nStore, LigojSelect, LigojTextField } from '@ligoj/host'
import { typeKind, isTextParam, isPassword, isDeprecated, deprecationNotice } from '../utils/pluginParams.js'

defineProps({
  // [{ label, params }] from groupParameters()
  groups: { type: Array, required: true },
  // Values by parameter id, owned by the caller
  values: { type: Object, required: true },
  // (parameter) => custom field component of the owning plugin, or null for the default input
  resolveField: { type: Function, default: () => null },
  // Context handed to the custom fields: { mode, isNode, nodeId, instanceNodeId }
  fieldContext: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update'])
const i18n = useI18nStore()
const t = i18n.t

const MULTIPLE = ['multiple', 'multiselect', 'tags']
const REQUIRED = [(v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || t('wizard.rule.required')]
const OPTIONAL = []

function set(p, value) { emit('update', p.id, value) }
function tOrNull(key) { const v = i18n.t(key); return v === key ? null : v }
function isMandatory(p) { return !!(p.mandatory || p.required) }
/* Label: the `<id>` i18n key of the owning plugin, else the raw id so a missing key stays visible. */
function paramLabel(p) { return `${tOrNull(p.id) ?? p.id}${isMandatory(p) ? ' *' : ''}` }
/* Helper text: deprecation notice, else the `<id>-description` i18n key, else the parameter's own description. */
function paramDescription(p) { return deprecationNotice(p, tOrNull, t('wizard.params.deprecatedNotice')) ?? tOrNull(`${p.id}-description`) ?? p.description ?? null }
/* Bindings shared by every default input. The rules arrays are constants: an inline array is a new reference
   on each render and makes v-form revalidate in a loop inside expand transitions. */
function common(p) {
  return { label: paramLabel(p), rules: isMandatory(p) ? REQUIRED : OPTIONAL, variant: 'outlined', density: 'comfortable', hint: paramDescription(p), persistentHint: true, hideDetails: 'auto' }
}
</script>

<style scoped>
.pgroup { margin: 4px 0 10px; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-3); }
.pgroup + .pfield { margin-top: 0; }
.pfield { margin-bottom: 12px; }
.pfield--deprecated { border-left: 3px solid rgb(var(--v-theme-warning)); padding-left: 10px; opacity: .88; }
.pfield-deprecated { margin-bottom: 4px; }
</style>
