<!--
  DemoProjectListAction — demo-mode `actionExtension` contribution to the
  project list toolbar (target 'project'). Mounted by LjPageHeader after the
  built-in actions with the toolbar `context` prop; shows the contract in
  action: a button in the view's chrome, opening a dialog that lists the
  context it received and uses its `reload` callback.
-->
<template>
  <LjButton variant="ghost" icon="mdi-flask-outline" @click="open = true">
    {{ t('demo.listAction') }}
    <v-tooltip activator="parent" location="bottom" :text="t('demo.listActionTooltip')" />
  </LjButton>
  <LjDialog v-model="open" :title="t('demo.listAction')" icon="mdi-flask-outline" :max-width="520">
    <p class="dla-text">{{ t('demo.listActionText') }}</p>
    <pre class="dla-ctx">{{ contextKeys }}</pre>
    <template #footer>
      <LjButton variant="ghost" @click="open = false">{{ t('common.close') }}</LjButton>
      <LjButton icon="mdi-refresh" @click="reload">{{ t('demo.listActionReload') }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18nStore, LjButton, LjDialog } from '@ligoj/host'

const props = defineProps({
  /** Toolbar context: `{ target, reload }` for the project list. */
  context: { type: Object, default: () => ({}) },
})

const { t } = useI18nStore()
const open = ref(false)
const contextKeys = computed(() => JSON.stringify(
  Object.fromEntries(Object.entries(props.context || {}).map(([k, v]) => [k, typeof v === 'function' ? 'ƒ()' : v])), null, 2))

function reload() {
  props.context?.reload?.()
  open.value = false
}
</script>

<style scoped>
.dla-text { margin: 0 0 10px; font-size: 13.5px; }
.dla-ctx { margin: 0; font-size: 12px; opacity: .85; white-space: pre-wrap; }
</style>
