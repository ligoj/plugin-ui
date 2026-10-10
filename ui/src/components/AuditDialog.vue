<template>
  <LjDialog :model-value="modelValue" :title="t('common.auditTitle')" icon="mdi-clock-outline" :max-width="460" @update:model-value="$emit('update:modelValue', $event)">
    <AuditRows :target="target" />
    <template #footer>
      <LjButton variant="ghost" @click="close">{{ t('common.close') }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { useI18nStore, LjDialog, LjButton } from '@ligoj/host'
import AuditRows from './AuditRows.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  // Any object implementing org.ligoj.bootstrap.core.model.Auditable
  target: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18nStore()

function close() { emit('update:modelValue', false) }
</script>
