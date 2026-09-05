<!--
  DemoSavePreviewDialog — demo-mode showcase of the `editExtension.beforeSave`
  interception: when the user saves a project, this dialog opens on top and
  shows the JSON the dialog built ("original") next to the JSON completed by
  the demo extension (the tags typed in its section, normalized and counted),
  and, when it differs, the JSON actually sent: the demo has no API of its own
  and the standard project API rejects unknown properties, so the demo-only
  keys are dropped from the request. "Save" sends it; "Cancel" aborts the save.
  Mounted persistently through `app.registerHeaderItem` (like the bug-report
  dialog) and driven by the `savePreview` module state.
-->
<template>
  <LjDialog v-model="savePreview.open" :title="t('demo.savePreview.title')" icon="mdi-code-json" :max-width="960" @update:model-value="(v) => !v && closeSavePreview(false)">
    <p class="sp-hint">{{ t('demo.savePreview.hint') }}</p>
    <div class="sp-panes">
      <section class="sp-pane">
        <h4><v-icon size="16">mdi-file-document-outline</v-icon>{{ t('demo.savePreview.original') }}</h4>
        <pre>{{ pretty(savePreview.original) }}</pre>
      </section>
      <section class="sp-pane sp-completed">
        <h4><v-icon size="16">mdi-auto-fix</v-icon>{{ t('demo.savePreview.completed') }}</h4>
        <pre>{{ pretty(savePreview.completed) }}</pre>
      </section>
      <section v-if="sentDiffers" class="sp-pane sp-sent">
        <h4><v-icon size="16">mdi-send-outline</v-icon>{{ t('demo.savePreview.sent') }}</h4>
        <pre>{{ pretty(savePreview.sent) }}</pre>
      </section>
    </div>
    <template #footer>
      <LjButton variant="ghost" @click="closeSavePreview(false)">{{ t('common.cancel') }}</LjButton>
      <LjButton icon="mdi-content-save" @click="closeSavePreview(true)">{{ t('common.save') }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore, LjDialog, LjButton } from '@ligoj/host'
import { savePreview, closeSavePreview } from '../demo/savePreview.js'

const { t } = useI18nStore()
const pretty = (value) => JSON.stringify(value ?? {}, null, 2)
const sentDiffers = computed(() => pretty(savePreview.sent) !== pretty(savePreview.completed))
</script>

<style scoped>
.sp-hint { margin: 0 0 12px; font-size: 13px; opacity: .8; }
.sp-panes { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
.sp-pane { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; padding: 10px 12px; min-width: 0; }
.sp-pane h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 13px; }
.sp-completed { border-color: rgba(var(--v-theme-primary), .45); }
.sp-sent { border-color: rgba(var(--v-theme-success), .5); }
.sp-pane pre { margin: 0; max-height: 50vh; overflow: auto; font-size: 12px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
</style>
