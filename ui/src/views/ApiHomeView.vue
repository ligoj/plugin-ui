<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">API</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/api/</code>. TODO: OpenAPI/Swagger rendering or
      static docs panel.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('API')
  app.setBreadcrumbs([{ title: 'API' }])
})
</script>
