<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Nodes</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/node/</code>. TODO: hierarchical node tree
      (service → tool → instance), parameter editor, tool-icon rendering
      via <code>useUiHelpers</code>.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Nodes')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Nodes' }])
})
</script>
