<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Plugins</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/plugin/</code>. TODO: installed-plugin
      grid, install/uninstall/restart actions against
      <code>rest/system/plugin</code>.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Plugins')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Plugins' }])
})
</script>
