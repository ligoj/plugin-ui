<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">Projects</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Project list — legacy <code>webjars/home/project/</code>. TODO: wire
      <code>rest/project</code>, DataTable with search, links to detail view.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'

const app = useAppStore()

onMounted(() => {
  app.setTitle('Projects')
  app.setBreadcrumbs([
    { title: 'Home', to: '/' },
    { title: 'Projects' },
  ])
})
</script>
