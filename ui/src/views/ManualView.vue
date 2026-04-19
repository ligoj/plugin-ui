<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">User manual</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Embedded user manual — legacy <code>webjars/home/manual/</code>. TODO.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'

const app = useAppStore()

onMounted(() => {
  app.setTitle('Manual')
  app.setBreadcrumbs([{ title: 'Home', to: '/' }, { title: 'Manual' }])
})
</script>
