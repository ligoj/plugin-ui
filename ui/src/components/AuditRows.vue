<!--
  AuditRows: the audit data of an auditable entity (created on / by, modified on / by), the dates in the active
  locale, "—" when absent. Shared by the project audit dialog and the configuration view (edit dialog, and `dense`
  in the tooltip of the "Modified" column). The colors are inherited, so the rows read on a dialog and a tooltip.
-->
<template>
  <div class="aud-rows" :class="{ dense }">
    <div v-for="row in rows" :key="row.key" class="aud-row">
      <span class="aud-k"><v-icon size="16">{{ row.icon }}</v-icon>{{ t(row.label) }}</span>
      <span class="aud-v">{{ row.value || '—' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@ligoj/host'
import { formatAuditDate, auditUser } from '../utils/auditFormat.js'

const props = defineProps({
  // Any object implementing org.ligoj.bootstrap.core.model.Auditable
  target: { type: Object, default: null },
  // Compact rows, for a tooltip
  dense: { type: Boolean, default: false },
})
const i18n = useI18nStore()
const t = i18n.t

const rows = computed(() => [
  { key: 'createdDate', icon: 'mdi-calendar-plus', label: 'common.createdDate', value: formatAuditDate(props.target?.createdDate, i18n.locale) },
  { key: 'createdBy', icon: 'mdi-account-plus', label: 'common.createdBy', value: auditUser(props.target?.createdBy, t) },
  { key: 'lastModifiedDate', icon: 'mdi-calendar-edit', label: 'common.lastModifiedDate', value: formatAuditDate(props.target?.lastModifiedDate, i18n.locale) },
  { key: 'lastModifiedBy', icon: 'mdi-account-edit', label: 'common.lastModifiedBy', value: auditUser(props.target?.lastModifiedBy, t) },
])
</script>

<style scoped>
.aud-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 10px 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); }
.aud-row:last-child { border-bottom: 0; }
.aud-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 12.5px; opacity: .65; text-transform: uppercase; letter-spacing: .03em; }
.aud-v { font-family: var(--mono, "JetBrains Mono", ui-monospace, monospace); font-size: 13px; text-align: right; }
.dense .aud-row { gap: 12px; padding: 4px 0; }
.dense .aud-k { gap: 5px; font-size: 10.5px; }
.dense .aud-v { font-size: 12px; }
</style>
