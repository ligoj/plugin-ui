<!--
  ActSbom — friendly renderer for the Actuator `sbom` endpoint.

  Presentational only: receives the already-fetched, parsed payload as the
  `data` prop. NO API calls, NO @ligoj/host imports, NO router.
  Robust to missing / variant shapes (optional chaining everywhere) with a
  graceful empty state. The shell (ActuatorView) owns title, refresh and raw
  JSON; this draws only the friendly view. See ActHealth.vue for the contract.
-->
<template>
  <div class="act-sbom">
    <v-alert v-if="!ids.length" type="info" variant="tonal" density="compact">No data.</v-alert>
    <div v-else class="sbom-chips">
      <v-chip v-for="id in ids" :key="id" color="primary" variant="tonal" label class="mono">
        <v-icon start>mdi-package-variant-closed</v-icon>{{ id }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ data: { type: [Object, Array, String], default: null } })

const ids = computed(() => {
  const raw = Array.isArray(props.data) ? props.data : props.data?.ids
  if (!Array.isArray(raw)) return []
  return raw.filter((id) => id != null).map((id) => String(id))
})
</script>

<style scoped>
.sbom-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.mono { font-family: var(--mono, ui-monospace, monospace); font-size: 12.5px; }
</style>
