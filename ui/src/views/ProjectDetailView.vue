<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">Project #{{ id }}</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Project detail — legacy <code>webjars/home/project/project.js</code>.
      TODO: subscriptions panel, parameters, audit metadata.
    </v-alert>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@ligoj/host'

const route = useRoute()
const app = useAppStore()
const id = computed(() => route.params.id)

onMounted(() => {
  app.setTitle(`Project ${id.value}`)
  app.setBreadcrumbs([
    { title: 'Home', to: '/' },
    { title: 'Projects', to: '/home/project' },
    { title: id.value },
  ])
})
</script>
