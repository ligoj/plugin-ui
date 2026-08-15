<!--
  Demo contribution to ProjectEditDialog, mounted through the generic
  `editExtension` plugin hook (target 'project') when the admin-level demo
  mode (host `useDemoMode`) is enabled. Demonstrates the two extension
  capabilities: a body component aware of the edition mode, and (not used
  here) a replacement save resource. Content is display-only.
-->
<template>
  <div class="demo-ext">
    <v-alert type="info" variant="tonal" density="compact" rounded="lg" icon="mdi-flask-outline" class="mb-3">
      {{ t(mode === 'edit' ? 'demo.projectAlertEdit' : 'demo.projectAlertCreate') }}
    </v-alert>
    <v-tabs v-model="tab" density="compact" color="primary">
      <v-tab value="overview">{{ t('demo.tabOverview') }}</v-tab>
      <v-tab value="quota">{{ t('demo.tabQuota') }}</v-tab>
      <v-tab value="tags">{{ t('demo.tabTags') }}</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="pt-3">
      <v-tabs-window-item value="overview">
        <p class="demo-text">{{ t('demo.tabOverviewText') }}</p>
      </v-tabs-window-item>
      <v-tabs-window-item value="quota">
        <p class="demo-text">{{ t('demo.tabQuotaText') }}</p>
      </v-tabs-window-item>
      <v-tabs-window-item value="tags">
        <!-- Writing into `form` is the editExtension contract: extra keys ride
             along in the save payload. -->
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <v-text-field v-model="form.demoTags" :label="t('demo.tagsLabel')" :hint="t('demo.tagsHint')" persistent-hint
          prepend-inner-icon="mdi-tag-multiple-outline" variant="outlined" density="compact" />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18nStore } from '@ligoj/host'

defineProps({
  // Contract of the `editExtension` body components (see REWRITE_VUEJS.md):
  // edition mode, live form model (extra keys ride along in the payload) and
  // the full feature context.
  mode: { type: String, required: true },
  form: { type: Object, required: true },
  context: { type: Object, default: null },
})

const t = useI18nStore().t
const tab = ref('overview')
</script>

<style scoped>
.demo-ext {
  margin-top: 4px;
}

.demo-text {
  font-size: 13px;
  color: var(--ink-2, rgba(var(--v-theme-on-surface), .7));
  margin: 0 0 4px;
}
</style>
