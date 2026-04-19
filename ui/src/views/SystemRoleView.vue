<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Roles</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/role/</code>. TODO: CRUD over
      <code>rest/system/security/role</code>, authorization pattern editor.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('Roles')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Roles' }])
})
</script>
