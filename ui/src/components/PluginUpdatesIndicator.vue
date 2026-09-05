<!--
  PluginUpdatesIndicator — app-bar picto (host `registerNavbarItem`) shown to
  administrators when at least one installed plug-in has a newer version in the
  repository, as recorded by the last scheduled or manual check (session
  application data `plugin-updates`, see app-api `PluginScheduleResource`).
  Click-through to the plug-in manager; the tooltip lists the plug-ins.
-->
<template>
  <button v-if="auth.isAdmin && updates.length" type="button" class="pu-btn" :aria-label="tooltip" @click="router.push('/system/plugin')">
    <v-badge :content="updates.length" color="warning" offset-x="2" offset-y="2"><v-icon size="22">mdi-update</v-icon></v-badge>
    <v-tooltip activator="parent" location="bottom" max-width="360" :text="tooltip" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import { parseUpdates } from '../pluginUpdates.js'

const auth = useAuthStore()
const router = useRouter()
const { t } = useI18nStore()
const updates = computed(() => parseUpdates(auth.appSettings?.data?.['plugin-updates']))
const tooltip = computed(() => t('system.plugin.updatesIndicator', { count: updates.value.length, list: updates.value.map((u) => `${u.artifact} ${u.version}`).join(', ') }))
</script>

<style scoped>
.pu-btn { display: inline-grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 10px; background: transparent; color: inherit; cursor: pointer; margin-right: 4px; }
.pu-btn:hover { background: rgba(var(--v-theme-on-surface), .06); }
</style>
