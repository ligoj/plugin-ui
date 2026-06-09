<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">{{ t('system.title') }}</h1>
    <v-list>
      <v-list-item v-for="item in items" :key="item.to" :to="item.to" :prepend-icon="item.icon" :title="item.title" :subtitle="item.subtitle" />
    </v-list>
  </div>
</template>

<script setup>
import { useAppStore, useI18nStore } from '@ligoj/host'
import { computed, onMounted } from 'vue'

const app = useAppStore()
const { t } = useI18nStore()

const items = computed(() => [
  { to: '/system/information',   icon: 'mdi-information-outline', title: t('nav.information'),   subtitle: t('system.menuInfoSubtitle') },
  { to: '/system/configuration', icon: 'mdi-tune',                title: t('nav.configuration'), subtitle: t('system.menuConfigurationSubtitle') },
  { to: '/system/user',          icon: 'mdi-account-multiple',    title: t('nav.users'),         subtitle: t('system.menuUsersSubtitle') },
  { to: '/system/role',          icon: 'mdi-shield-account',      title: t('nav.roles'),         subtitle: t('system.menuRolesSubtitle') },
  { to: '/system/plugin',        icon: 'mdi-puzzle',              title: t('nav.plugins'),       subtitle: t('system.menuPluginsSubtitle') },
  { to: '/system/node',          icon: 'mdi-server',              title: t('nav.nodes'),         subtitle: t('system.menuNodesSubtitle') },
  { to: '/system/cache',         icon: 'mdi-database-refresh',    title: t('nav.cache'),         subtitle: t('system.menuCacheSubtitle') },
  { to: '/system/bench',         icon: 'mdi-speedometer',         title: t('nav.bench'),         subtitle: t('system.menuBenchSubtitle') },
])

onMounted(() => {
  app.setBreadcrumbs(() => [{ title: t('system.breadcrumb') }])
})
</script>
