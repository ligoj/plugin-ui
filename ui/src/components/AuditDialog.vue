<template>
  <LjDialog :model-value="modelValue" :title="t('common.auditTitle') || 'Données d\'audit'" icon="mdi-clock-outline" :max-width="460" @update:model-value="$emit('update:modelValue', $event)">
    <div class="aud-row">
      <span class="aud-k"><v-icon size="16">mdi-calendar-plus</v-icon>{{ t('common.createdDate') || 'Créé le' }}</span>
      <span class="aud-v">{{ fmt(target?.createdDate) || '—' }}</span>
    </div>
    <div class="aud-row">
      <span class="aud-k"><v-icon size="16">mdi-account-plus</v-icon>{{ t('common.createdBy') || 'Créé par' }}</span>
      <span class="aud-v">{{ who(target?.createdBy) || '—' }}</span>
    </div>
    <div class="aud-row">
      <span class="aud-k"><v-icon size="16">mdi-calendar-edit</v-icon>{{ t('common.lastModifiedDate') || 'Modifié le' }}</span>
      <span class="aud-v">{{ fmt(target?.lastModifiedDate) || '—' }}</span>
    </div>
    <div class="aud-row">
      <span class="aud-k"><v-icon size="16">mdi-account-edit</v-icon>{{ t('common.lastModifiedBy') || 'Modifié par' }}</span>
      <span class="aud-v">{{ who(target?.lastModifiedBy) || '—' }}</span>
    </div>
    <template #footer>
      <LjButton variant="ghost" @click="close">{{ t('common.close') || 'Fermer' }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { useI18nStore, LjDialog, LjButton } from '@ligoj/host'

defineProps({
  modelValue: { type: Boolean, default: false },
  // Any object that implements org.ligoj.bootstrap.core.model.Auditable :
  // createdDate, createdBy, lastModifiedDate, lastModifiedBy.
  target: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18nStore()

function close() { emit('update:modelValue', false) }
// createdBy / lastModifiedBy may be a raw login string or a SimpleUser object
// ({ firstName, lastName, id }) depending on the endpoint — normalize both.
function who(v) {
  if (!v) return ''
  if (typeof v === 'string') return v
  const name = [v.firstName, v.lastName].filter(Boolean).join(' ')
  return name || v.id || v.login || ''
}
function fmt(d) {
  if (!d) return ''
  const date = typeof d === 'number' ? new Date(d) : new Date(String(d))
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
}
</script>

<style scoped>
/* Modal chrome (overlay, card, gradient-icon head, close button, footer)
   now comes from <LjDialog> + <LjButton>; only the audit key/value rows
   specific to this dialog remain. The --mono var is supplied by the
   `.lj-surface` on the LjDialog card. */
.aud-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 10px 0; border-bottom: 1px solid rgba(var(--v-theme-on-surface), .07); }
.aud-row:last-child { border-bottom: 0; }
.aud-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 12.5px; color: rgba(var(--v-theme-on-surface), .65); text-transform: uppercase; letter-spacing: .03em; }
.aud-v { font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace); font-size: 13px; color: rgb(var(--v-theme-on-surface)); text-align: right; }
</style>
