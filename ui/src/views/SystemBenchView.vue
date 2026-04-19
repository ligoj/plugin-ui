<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Bench</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/bench/</code>. TODO: diagnostics endpoint
      panel.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Bench')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Bench' }])
})
</script>
