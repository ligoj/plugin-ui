<!--
  ParameterForm — the auto-rendered form of a node's parameters, shared by the subscription wizard
  (SubscribeWizardView) and the node editor (NodeEditDialog). It renders the groups computed by
  `groupParameters` (plugin `parameterLayout` hook), and for each parameter either the plugin's custom field
  (`parameterField` hook, resolved by the caller through `resolve-field`) or the default input of its type.

  The values stay owned by the caller: this component never mutates `values`, it emits `update`.

  A stored secured value (`stored`, redacted by the API) is shown hidden and kept, its form value being `UNTOUCHED`:
  the pencil replaces it with a new value, the undo keeps it again. An optional one left empty is removed.

    <ParameterForm :groups="parameterGroups" :values="paramValues" :resolve-field="resolveParameterField"
      :field-context="{ mode, isNode, nodeId, instanceNodeId }" @update="(id, v) => (paramValues[id] = v)" />
-->
<template>
  <template v-for="(group, gi) in groups" :key="gi">
    <div v-if="group.label" class="pgroup">{{ group.label }}</div>
    <div v-for="p in group.params" :key="p.id" class="pfield" :class="{ 'pfield--deprecated': isDeprecated(p) }">
      <v-chip v-if="isDeprecated(p)" size="x-small" color="warning" variant="tonal" class="pfield-deprecated" prepend-icon="mdi-alert-outline">{{ t('wizard.params.deprecated') }}</v-chip>
      <LigojTextField v-if="values[p.id] === UNTOUCHED" model-value="" readonly :label="paramLabel(p)" :placeholder="t('wizard.params.securedStored')" persistent-placeholder
        prepend-inner-icon="mdi-lock-outline" :hint="t('wizard.params.securedHint')" persistent-hint variant="outlined" density="comfortable" hide-details="auto" class="psecret">
        <template #append-inner>
          <v-tooltip :text="t('wizard.params.securedReplace')" location="top">
            <template #activator="{ props: tip }">
              <v-btn v-bind="tip" icon="mdi-pencil-outline" size="small" variant="text" density="comfortable" :aria-label="t('wizard.params.securedReplace')" @click="replace(p)" />
            </template>
          </v-tooltip>
        </template>
      </LigojTextField>
      <component :is="resolveField(p)" v-else-if="resolveField(p)" :model-value="values[p.id]" :parameter="p" :form-values="values" :mode="fieldContext.mode"
        :is-node="!!fieldContext.isNode" :node-id="fieldContext.nodeId" :instance-node-id="fieldContext.instanceNodeId" :project="fieldContext.project ?? null" @update:model-value="set(p, $event)" />
      <LigojTextField v-else-if="isTextParam(p)" :model-value="values[p.id]" :type="isPassword(p) ? 'password' : 'text'" :autofocus="focused === p.id" v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojTextField v-else-if="typeKind(p) === 'integer'" :model-value="values[p.id]" type="number" :min="p.min" :max="p.max" v-bind="common(p)" @update:model-value="set(p, $event === '' || $event == null ? $event : Number($event))" />
      <v-checkbox v-else-if="typeKind(p) === 'bool'" :model-value="values[p.id]" :label="paramLabel(p)" density="comfortable" :hint="paramDescription(p)" persistent-hint hide-details="auto" @update:model-value="set(p, $event)" />
      <LigojSelect v-else-if="typeKind(p) === 'select'" :model-value="values[p.id]" :items="p.values || []" v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojSelect v-else-if="MULTIPLE.includes(typeKind(p))" :model-value="values[p.id]" :items="p.values || []" chips multiple v-bind="common(p)" @update:model-value="set(p, $event)" />
      <LigojTextField v-else :model-value="values[p.id]" v-bind="common(p)" @update:model-value="set(p, $event)" />
      <div v-if="stored.includes(p.id) && values[p.id] !== UNTOUCHED" class="pstored">
        <span>{{ isEmptyValue(values[p.id]) && !isMandatory(p) ? t('wizard.params.securedRemoving') : t('wizard.params.securedReplacing') }}</span>
        <button type="button" class="pkeep" @click="set(p, UNTOUCHED)"><v-icon size="15">mdi-undo</v-icon>{{ t('wizard.params.securedKeep') }}</button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { useI18nStore, LigojSelect, LigojTextField } from '@ligoj/host'
import { typeKind, isTextParam, isPassword, isDeprecated, deprecationNotice, isEmptyValue, UNTOUCHED } from '../utils/pluginParams.js'

defineProps({
  // [{ label, params }] from groupParameters()
  groups: { type: Array, required: true },
  // Values by parameter id, owned by the caller
  values: { type: Object, required: true },
  // (parameter) => custom field component of the owning plugin, or null for the default input
  resolveField: { type: Function, default: () => null },
  // Context handed to the custom fields: { mode, isNode, nodeId, instanceNodeId }
  fieldContext: { type: Object, default: () => ({}) },
  // Identifiers of the parameters having a stored secured value, redacted by the API
  stored: { type: Array, default: () => [] },
})
const emit = defineEmits(['update'])
const i18n = useI18nStore()
const t = i18n.t

const MULTIPLE = ['multiple', 'multiselect', 'tags']
const REQUIRED = [(v) => (v != null && v !== '' && (!Array.isArray(v) || v.length > 0)) || t('wizard.rule.required')]
const OPTIONAL = []

function set(p, value) { emit('update', p.id, value) }
// The parameter whose stored value is being replaced: its new input takes the focus
const focused = ref(null)
function replace(p) {
  focused.value = p.id
  set(p, '')
}
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
.psecret :deep(input::placeholder) { font-style: italic; }
.pstored { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 12px; margin-top: 4px; padding: 0 16px; font-size: 12px; color: var(--ink-3); }
.pkeep { display: inline-flex; align-items: center; gap: 4px; font: inherit; font-weight: 600; color: rgb(var(--v-theme-primary)); background: none; border: 0; padding: 0; cursor: pointer; }
.pkeep:hover { text-decoration: underline; }
</style>
