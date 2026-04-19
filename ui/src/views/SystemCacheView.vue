<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Cache</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/cache/</code>. TODO: invalidate caches
      (global + per-name) via <code>rest/system/cache</code>.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Cache')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Cache' }])
})
</script>
