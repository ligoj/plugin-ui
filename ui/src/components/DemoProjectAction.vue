<!--
  Demo action-bar contribution to ProjectEditDialog (`editExtension.footer`,
  target 'project'), shown while the admin-level demo mode is enabled.
  Demonstrates a plugin-contributed button living next to the built-in
  Cancel/Save actions, aware of the edition mode.
-->
<template>
  <LjButton variant="ghost" icon="mdi-flask-outline" @click="onDemoAction">
    {{ t(mode === 'edit' ? 'demo.actionEdit' : 'demo.actionCreate') }}
    <v-tooltip activator="parent" location="top" :text="t('demo.actionTooltip')" />
  </LjButton>
</template>

<script setup>
import { useErrorStore, useI18nStore, LjButton } from '@ligoj/host'

const props = defineProps({
  mode: { type: String, required: true },
  form: { type: Object, required: true },
  context: { type: Object, default: null },
})

const t = useI18nStore().t
const errorStore = useErrorStore()

function onDemoAction() {
  errorStore.info(t('demo.actionDone', { name: props.form?.name || '—' }))
}
</script>
