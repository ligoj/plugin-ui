<!--
  DemoSavePreviewDialog — demo-mode showcase of the `editExtension.beforeSave`
  interception. When the user saves a project, this dialog opens on top with
  three captioned panes: the fields built by the dialog itself, the keys the
  demo section wrote into the form (they ride along in the payload the hook
  receives), and the request body returned by the hook and sent to the
  plugin's own demo endpoint (`apiPath` override) — more complete than what
  the standard project API accepts (`tags`). That endpoint drops the payload:
  nothing is persisted. "Save" sends it; "Cancel" aborts the save. Mounted
  persistently through `app.registerHeaderItem` (like the bug-report dialog)
  and driven by the `savePreview` module state.
-->
<template>
  <LjDialog v-model="savePreview.open" :title="t('demo.savePreview.title')" icon="mdi-code-json" :max-width="1100" @update:model-value="(v) => !v && closeSavePreview(false)">
    <p class="sp-hint">{{ t('demo.savePreview.hint') }}</p>
    <div class="sp-panes">
      <section v-for="pane in panes" :key="pane.key" class="sp-pane" :class="`sp-${pane.key}`">
        <h4><v-icon size="16">{{ pane.icon }}</v-icon>{{ t(`demo.savePreview.${pane.key}`) }}</h4>
        <p class="sp-caption">{{ t(`demo.savePreview.${pane.key}Caption`) }}</p>
        <pre>{{ pretty(savePreview[pane.key]) }}</pre>
      </section>
    </div>
    <template #footer>
      <LjButton variant="ghost" @click="closeSavePreview(false)">{{ t('common.cancel') }}</LjButton>
      <LjButton icon="mdi-content-save" @click="closeSavePreview(true)">{{ t('common.save') }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { useI18nStore, LjDialog, LjButton } from '@ligoj/host'
import { savePreview, closeSavePreview } from '../demo/savePreview.js'

const { t } = useI18nStore()
const panes = [
  { key: 'dialog', icon: 'mdi-file-document-outline' },
  { key: 'extension', icon: 'mdi-puzzle-outline' },
  { key: 'sent', icon: 'mdi-send-outline' },
]
const pretty = (value) => JSON.stringify(value ?? {}, null, 2)
</script>

<style scoped>
.sp-hint { margin: 0 0 12px; font-size: 13px; opacity: .8; }
.sp-panes { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }
.sp-pane { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; padding: 10px 12px; min-width: 0; display: flex; flex-direction: column; }
.sp-pane h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 4px; font-size: 13px; }
.sp-caption { margin: 0 0 8px; font-size: 12px; opacity: .75; line-height: 1.4; }
.sp-extension { border-color: rgba(var(--v-theme-primary), .45); }
.sp-sent { border-color: rgba(var(--v-theme-success), .5); }
.sp-pane pre { margin: auto 0 0; max-height: 45vh; overflow: auto; font-size: 12px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
</style>
