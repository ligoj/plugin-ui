<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">Dashboard</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Dashboard view — port from legacy <code>webjars/home/home.js</code>
      (projects grid, quick actions). TODO.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore, useI18nStore } from '@ligoj/host'
import { onMounted } from 'vue'

const app = useAppStore()
const { t } = useI18nStore()

onMounted(() => {
  app.setTitle(t('nav.home') || 'Home')
  app.setBreadcrumbs([{ title: t('nav.home') || 'Home' }])
})
</script>
