<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">System administration</h1>
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
      />
    </v-list>
  </div>
</template>

<script setup>
import { useAppStore } from '@ligoj/host'
import { onMounted } from 'vue'

const app = useAppStore()

const items = [
  { to: '/system/user',   icon: 'mdi-account-multiple', title: 'Users',         subtitle: 'Active sessions and accounts' },
  { to: '/system/role',   icon: 'mdi-shield-account',   title: 'Roles',         subtitle: 'Authorization rules' },
  { to: '/system/plugin', icon: 'mdi-puzzle',           title: 'Plugins',       subtitle: 'Installed feature plugins' },
  { to: '/system/node',   icon: 'mdi-server',           title: 'Nodes',         subtitle: 'Service & tool registrations' },
  { to: '/system/cache',  icon: 'mdi-database-refresh', title: 'Cache',         subtitle: 'Invalidate application caches' },
  { to: '/system/bench',  icon: 'mdi-speedometer',      title: 'Bench',         subtitle: 'Diagnostics' },
]

onMounted(() => {
  app.setTitle('System')
  app.setBreadcrumbs([{ title: 'System' }])
})
</script>
