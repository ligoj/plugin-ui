<!--
  CredentialExpiryChip — urgency of the credential expiry of a node (NodeVo.credentialExpiryLevel, computed by the
  API with its threshold): "Expires in N days" or "Credentials expired", the day and the source in the tooltip.
  The expiry is a day in UTC: displayed in UTC, so the same day whatever the browser time zone.
-->
<template>
  <v-chip v-if="level" :color="level === 'expired' ? 'error' : 'warning'" size="x-small" variant="tonal" class="cred-expiry" prepend-icon="mdi-key-alert-outline">
    {{ label }}
    <v-tooltip activator="parent" location="top">{{ tip }}</v-tooltip>
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@ligoj/host'

const props = defineProps({
  // A NodeVo: credentialExpiry (epoch ms), credentialExpirySource ('manual'|'detected'), credentialExpiryLevel
  node: { type: Object, required: true },
  // The current instant, epoch ms
  now: { type: Number, default: () => Date.now() },
})

const i18n = useI18nStore()
const level = computed(() => props.node?.credentialExpiryLevel || null)
const days = computed(() => Math.max(0, Math.ceil((props.node.credentialExpiry - props.now) / 86400000)))
const date = computed(() => new Date(props.node.credentialExpiry).toLocaleDateString(i18n.locale, { timeZone: 'UTC' }))
const label = computed(() => {
  if (level.value === 'expired') return i18n.t('system.node.credentialExpired')
  return days.value === 0 ? i18n.t('system.node.credentialExpiringToday') : i18n.t('system.node.credentialExpiring', { days: days.value })
})
const tip = computed(() => i18n.t('system.node.credentialExpiryTip', {
  date: date.value,
  source: i18n.t(`system.node.credentialExpirySource.${props.node.credentialExpirySource}`),
}))
</script>

<style scoped>
.cred-expiry { margin-left: 8px; vertical-align: middle; }
</style>
