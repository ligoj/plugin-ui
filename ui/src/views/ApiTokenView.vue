<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">API — Tokens</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/api/token/</code>. TODO: personal API token
      management (create / revoke) via <code>rest/security/api-token</code>.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('API tokens')
  app.setBreadcrumbs([{ title: 'API', to: '/api' }, { title: 'Tokens' }])
})
</script>
