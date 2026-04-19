<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System — Users</h1>
    <v-alert type="info" variant="tonal" density="compact">
      Legacy <code>webjars/system/user/</code>. TODO: active sessions list
      from <code>rest/system/user</code>, kick session action.
    </v-alert>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'
const app = useAppStore()
onMounted(() => {
  app.setTitle('System users')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Users' }])
})
</script>
