<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">Subscribe wizard</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/subscribe-wizard/</code>. TODO: multi-step flow
      (select project → pick service → pick tool → configure parameters)
      backing <code>rest/subscription</code>.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Subscribe')
  app.setBreadcrumbs([{ title: 'Subscribe' }])
})
</script>
