<!--
  ProjectDeleteDialog — the confirmation of a project deletion: `v-model` + `project`, then `deleted`.

  Deleting a project removes its subscriptions, counted there. Like the unsubscribe dialog, the subscriptions
  created by Ligoj (CREATE mode) may also destroy what they created on their tool: opt-in, explained, off by
  default, and offered only when at least one of them has its tool plugin installed, since that plugin deletes
  these data. The API forwards the option to each cascaded subscription deletion and ignores it for the linked
  ones. The modes are unknown in the project list: the project is loaded when the dialog opens.
-->
<template>
  <LjConfirmDialog :model-value="modelValue" :title="t('project.deleteTitle')" icon="mdi-folder-remove" confirm-color="error"
    :confirm-label="t('common.delete')" :loading="busy" @update:model-value="emit('update:modelValue', $event)" @confirm="confirm">
    <p class="pd-text">{{ t('project.deleteConfirm', { name: project?.name }) }}</p>
    <div v-if="counts.subs" class="pd-counts">
      <div class="pd-row"><span class="pd-k">{{ t('project.deleteSubs') }}</span><span class="pd-v pd-subs">{{ counts.subs }}</span></div>
      <div v-if="counts.created" class="pd-row"><span class="pd-k">{{ t('project.deleteCreated') }}</span><span class="pd-v pd-created">{{ counts.created }}</span></div>
    </div>
    <template v-if="counts.deletable">
      <v-checkbox v-model="remote" class="pd-remote" color="error" density="compact" hide-details :label="t('project.deleteData', { count: counts.deletable })" />
      <p class="pd-hint">{{ t('project.deleteDataHint') }}</p>
    </template>
    <p v-if="counts.created > counts.deletable" class="pd-missing">{{ t('project.deletePluginMissing', { count: counts.created - counts.deletable }) }}</p>
  </LjConfirmDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useApi, useAuthStore, useErrorStore, useI18nStore, LjConfirmDialog } from '@ligoj/host'
import { isToolPluginInstalled } from '../utils/subscriptionPlugin.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  project: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'deleted'])
const { t } = useI18nStore()
const api = useApi()
const auth = useAuthStore()
const errorStore = useErrorStore()

const busy = ref(false)
const remote = ref(false)
const subscriptions = ref([])

// The subscriptions removed with the project, the ones Ligoj created, and among them the ones whose tool plugin
// can delete what they created
const counts = computed(() => {
  const created = subscriptions.value.filter((s) => String(s?.mode || '').toUpperCase() === 'CREATE')
  return {
    subs: subscriptions.value.length,
    created: created.length,
    deletable: created.filter((s) => isToolPluginInstalled(s, auth.appSettings?.plugins)).length,
  }
})

// Each opening starts unchecked and reads the subscriptions of the project with their mode
watch(() => props.modelValue, async (open) => {
  if (!open) return
  remote.value = false
  subscriptions.value = []
  const id = props.project?.id
  if (id == null) return
  const data = await api.get(`rest/project/${id}`, { silent: true }).catch(() => null)
  // Ignore an answer for a project the dialog no longer shows
  if (props.modelValue && props.project?.id === id) {
    subscriptions.value = Array.isArray(data?.subscriptions) ? data.subscriptions : []
  }
})

async function confirm() {
  const project = props.project
  if (project?.id == null) return
  const deletable = counts.value.deletable
  const withData = remote.value && deletable > 0
  busy.value = true
  try {
    const res = await api.del(`rest/project/${project.id}${withData ? '?deleteRemoteData=true' : ''}`, { raw: true })
    if (res?.ok) {
      emit('update:modelValue', false)
      errorStore.success(t(withData ? 'project.deletedData' : 'project.deleted', { name: project.name, count: deletable }))
      emit('deleted', project)
    }
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.pd-text { margin: 0 0 12px; color: var(--ink-2); }
.pd-counts { display: grid; gap: 6px; padding: 12px 14px; margin-bottom: 12px; border-radius: var(--radius-sm, 10px); background: var(--pill, rgba(var(--v-theme-on-surface), .04)); }
.pd-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 13px; }
.pd-k { color: var(--ink-3); }
.pd-v { font-family: var(--mono); font-weight: 700; color: var(--ink); }
.pd-remote { margin-top: 4px; }
.pd-hint { margin: 2px 0 0 40px; font-size: 12.5px; color: var(--ink-3); }
.pd-missing { margin: 12px 0 0; font-size: 12.5px; color: rgb(var(--v-theme-warning)); }
</style>
