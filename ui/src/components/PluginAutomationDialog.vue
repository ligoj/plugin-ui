<!--
  PluginAutomationDialog — the three plug-in automation features of the plug-in
  manager, backed by `rest/system/plugin/schedule` (app-api
  `PluginScheduleResource`, configuration `ligoj.plugin.*`):
  1. scheduled check of new versions (cron, Spring format, edited with
     @vue-js-cron/vuetify),
  2. automatic download of the versions found by the check — only available
     while the check is enabled, guarded by a warning dialog,
  3. maintenance window (cron): the context restarts at that time only when at
     least one plug-in update is staged.
  Nothing is persisted before "Save"; the backend reschedules on save.
-->
<template>
  <LjDialog v-model="open" :title="t('system.plugin.automationTitle')" icon="mdi-calendar-clock" :max-width="780">
    <p class="au-intro">{{ t('system.plugin.automationIntro', { repository: state.repository || '' }) }}</p>

    <!-- 1. Scheduled check -->
    <section class="au-section">
      <header class="au-head">
        <span class="switch" :class="{ on: form.checkEnabled }" role="switch" :aria-checked="form.checkEnabled" @click="form.checkEnabled = !form.checkEnabled">
          <v-tooltip activator="parent" location="top" max-width="360" :text="t('system.plugin.checkSwitchTip')" />
        </span>
        <h4>{{ t('system.plugin.checkTitle') }}</h4>
      </header>
      <p class="au-help">{{ t('system.plugin.checkHelp') }}</p>
      <div v-if="form.checkEnabled" class="au-cron">
        <CronVuetify v-model="form.checkCron" format="spring" :locale="cronLocale" />
        <code class="au-expr">{{ form.checkCron }}<v-tooltip activator="parent" location="top" :text="t('system.plugin.cronTip')" /></code>
      </div>
      <p class="au-meta">
        <span v-if="state.nextCheck && state.checkEnabled">{{ t('system.plugin.nextRun', { date: formatInstant(state.nextCheck, locale) }) }}</span>
        <span>{{ state.lastCheck ? t('system.plugin.lastCheck', { date: formatInstant(state.lastCheck, locale) }) : t('system.plugin.neverChecked') }}</span>
        <span v-if="available.length" class="au-updates">{{ t('system.plugin.updatesFound', { count: available.length, list: available.map((u) => `${u.artifact} ${u.version}`).join(', ') }) }}</span>
        <span v-else-if="state.lastCheck">{{ t('system.plugin.noUpdate') }}</span>
      </p>
    </section>

    <!-- 2. Automatic update: requires the check -->
    <section class="au-section" :class="{ off: !form.checkEnabled }">
      <header class="au-head">
        <span class="switch" :class="{ on: form.updateEnabled, disabled: !form.checkEnabled }" role="switch" :aria-checked="form.updateEnabled" :aria-disabled="!form.checkEnabled" @click="toggleUpdate">
          <v-tooltip activator="parent" location="top" max-width="360" :text="t(form.checkEnabled ? 'system.plugin.updateSwitchTip' : 'system.plugin.updateRequiresCheck')" />
        </span>
        <h4>{{ t('system.plugin.autoUpdate') }}</h4>
      </header>
      <p class="au-help">{{ t('system.plugin.updateHelp') }}</p>
    </section>

    <!-- 3. Maintenance window -->
    <section class="au-section">
      <header class="au-head">
        <span class="switch" :class="{ on: form.maintenanceEnabled }" role="switch" :aria-checked="form.maintenanceEnabled" @click="form.maintenanceEnabled = !form.maintenanceEnabled">
          <v-tooltip activator="parent" location="top" max-width="360" :text="t('system.plugin.maintenanceSwitchTip')" />
        </span>
        <h4>{{ t('system.plugin.maintenanceTitle') }}</h4>
      </header>
      <p class="au-help">{{ t('system.plugin.maintenanceHelp') }}</p>
      <div v-if="form.maintenanceEnabled" class="au-cron">
        <CronVuetify v-model="form.maintenanceCron" format="spring" :locale="cronLocale" />
        <code class="au-expr">{{ form.maintenanceCron }}<v-tooltip activator="parent" location="top" :text="t('system.plugin.cronTip')" /></code>
      </div>
      <p class="au-meta">
        <span v-if="state.nextMaintenance && state.maintenanceEnabled">{{ t('system.plugin.nextRun', { date: formatInstant(state.nextMaintenance, locale) }) }}</span>
        <span>{{ t('system.plugin.stagedUpdates', { count: state.stagedUpdates || 0 }) }}</span>
      </p>
    </section>

    <template #footer>
      <LjButton variant="ghost" @click="open = false">{{ t('common.cancel') }}</LjButton>
      <LjButton icon="mdi-content-save" :disabled="saving || loading" @click="save">{{ t('common.save') }}</LjButton>
    </template>
  </LjDialog>

  <!-- Warning before enabling the automatic update -->
  <LjDialog v-model="warning" :title="t('system.plugin.autoUpdateTitle')" icon="mdi-update" :max-width="560">
    <p class="au-text">{{ t('system.plugin.autoUpdateBehavior', { repository: state.repository || '' }) }}</p>
    <p class="au-risk-title"><v-icon size="16" color="warning">mdi-alert-outline</v-icon>{{ t('system.plugin.autoUpdateRisksTitle') }}</p>
    <ul class="au-risks">
      <li v-for="i in 4" :key="i">{{ t('system.plugin.autoUpdateRisk' + i) }}</li>
    </ul>
    <p class="au-note">{{ t('system.plugin.autoUpdateNote') }}</p>
    <template #footer>
      <LjButton variant="ghost" @click="warning = false">{{ t('common.cancel') }}</LjButton>
      <LjButton variant="danger" icon="mdi-update" @click="form.updateEnabled = true; warning = false">{{ t('system.plugin.autoUpdateEnable') }}</LjButton>
    </template>
  </LjDialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { CronVuetify } from '@vue-js-cron/vuetify'
import '@vue-js-cron/vuetify/dist/vuetify.css'
import { useApi, useI18nStore, LjDialog, LjButton } from '@ligoj/host'
import { parseUpdates, formatInstant } from '../pluginUpdates.js'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'saved'])
const api = useApi()
const { t, locale } = useI18nStore()
// The cron editor ships en, fr, de, es, it, pt
const cronLocale = computed(() => (['en', 'fr', 'de', 'es', 'it', 'pt'].includes(String(locale.value || 'en').slice(0, 2)) ? String(locale.value).slice(0, 2) : 'en'))

const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const state = ref({})
const form = reactive({ checkEnabled: false, checkCron: '0 0 3 * * *', updateEnabled: false, maintenanceEnabled: false, maintenanceCron: '0 0 4 * * 0' })
const loading = ref(false)
const saving = ref(false)
const warning = ref(false)
const available = computed(() => parseUpdates(state.value.availableUpdates))

async function load() {
  loading.value = true
  try {
    const data = await api.get('rest/system/plugin/schedule')
    state.value = data || {}
    if (data) Object.assign(form, { checkEnabled: !!data.checkEnabled, checkCron: data.checkCron || form.checkCron, updateEnabled: !!data.updateEnabled, maintenanceEnabled: !!data.maintenanceEnabled, maintenanceCron: data.maintenanceCron || form.maintenanceCron })
  } finally { loading.value = false }
}
function toggleUpdate() {
  if (!form.checkEnabled) return
  if (form.updateEnabled) form.updateEnabled = false
  else warning.value = true
}
async function save() {
  saving.value = true
  try {
    // The automatic update only makes sense with the check: dropped otherwise (the backend enforces it too)
    const payload = { ...form, updateEnabled: form.checkEnabled && form.updateEnabled }
    const response = await api.put('rest/system/plugin/schedule', payload, { raw: true })
    if (response?.ok) { emit('saved'); open.value = false }
  } finally { saving.value = false }
}
watch(() => props.modelValue, (v) => { if (v) load() })
watch(() => form.checkEnabled, (v) => { if (!v) form.updateEnabled = false })
</script>

<style scoped>
.au-intro { margin: 0 0 14px; font-size: 13.5px; line-height: 1.5; }
.au-section { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
.au-section.off { opacity: .6; }
.au-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.au-head h4 { margin: 0; font-size: 14px; }
.au-help { margin: 0 0 10px; font-size: 13px; line-height: 1.5; opacity: .85; }
.au-cron { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin-bottom: 8px; }
.au-expr { font-size: 12px; padding: 2px 8px; border-radius: 6px; background: rgba(var(--v-theme-on-surface), .06); cursor: help; }
.au-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; margin: 0; font-size: 12.5px; opacity: .8; }
.au-updates { color: rgb(var(--v-theme-warning)); font-weight: 600; opacity: 1; }
.au-text, .au-note { margin: 0 0 12px; font-size: 13.5px; line-height: 1.5; }
.au-risk-title { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; font-size: 13px; font-weight: 700; color: rgb(var(--v-theme-warning)); }
.au-risks { margin: 0 0 12px; padding-left: 20px; font-size: 13px; line-height: 1.5; }
.au-note { opacity: .8; }
/* Same toggle as the plug-in view */
.switch { display: inline-block; width: 44px; height: 25px; border-radius: 20px; background: rgba(var(--v-theme-on-surface), .18); position: relative; cursor: pointer; transition: background .2s; flex: none; }
.switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 19px; height: 19px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .3); transition: left .2s; }
.switch.on { background: #1d9d63; }
.switch.on::after { left: 22px; }
.switch.disabled { opacity: .45; cursor: not-allowed; }
</style>
