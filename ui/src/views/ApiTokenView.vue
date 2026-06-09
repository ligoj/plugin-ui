<!--
  ApiTokenView — 2026 "Vibrant" API token manager (API → Tokens). Ports
  plugin-ui's ApiTokenView logic (rest/api/token list of names; POST creates and
  returns the secret; GET shows it; PUT regenerates; DELETE revokes) onto the
  Vibrant chrome: breadcrumb-chip header, a usage explainer card, KPI stat, a
  VibrantDataTable with a key glyph and show / regenerate / revoke row actions,
  plus Vibrant modals for create, the freshly-minted value, show/regenerate and
  a confirm dialog for revocation. The secret is shown in a copyable box.
-->
<template>
  <div class="tokens lj-surface">
    <LjPageHeader :title="t('system.apiToken.title')" :crumbs="[{ icon: 'mdi-api', label: t('api.title') }, { label: t('system.apiToken.title'), current: true }]">
      <template #subtitle>
        <b>{{ rows.length }}</b> {{ t('system.apiToken.countLabel') }}
      </template>
      <template #actions>
        <LjSearch v-model="query" :placeholder="t('system.apiToken.searchPlaceholder')" />
        <LjButton icon="mdi-plus" @click="openCreate">{{ t('system.apiToken.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <!-- Usage explainer. -->
    <div class="usage">
      <span class="us-ic"><v-icon size="20">mdi-key-chain-variant</v-icon></span>
      <div class="us-body">
        <p class="us-intro">{{ t('system.apiToken.intro') }}</p>
        <code class="us-ex">GET {{ origin }}{{ base }}rest/project?api-key=&lt;token&gt;&amp;api-user={{ userName }}</code>
      </div>
    </div>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <VibrantDataTable :headers="headers" :items="filtered" :items-length="filtered.length" :loading="loading" item-value="name" default-sort="name"
      :empty-text="t('system.apiToken.empty')" filename="api-tokens.csv" @row-click="(item) => openShow(item.name, 'load')">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span class="kglyph"><v-icon size="18">mdi-key-variant</v-icon></span>
          <code class="kname">{{ item.name }}</code>
        </div>
      </template>
      <template #actions="{ item }">
        <RowActionsCog>
          <button @click="openShow(item.name, 'load')"><v-icon size="18">mdi-eye-outline</v-icon>{{ t('system.apiToken.show') }}</button>
          <button @click="openShow(item.name, 'regen')"><v-icon size="18">mdi-refresh</v-icon>{{ t('system.apiToken.regenerate') }}</button>
          <div class="sep" />
          <button class="danger" @click="startDelete(item.name)"><v-icon size="18">mdi-delete-outline</v-icon>{{ t('system.apiToken.revoke') }}</button>
        </RowActionsCog>
      </template>
    </VibrantDataTable>

    <!-- Create dialog. -->
    <LjDialog v-model="createDialog" :title="t('system.apiToken.newTitle')" icon="mdi-key" :max-width="480">
      <v-form ref="createFormRef" @submit.prevent="doCreate">
        <v-text-field v-model="createName" prepend-inner-icon="mdi-key-outline" :label="t('system.apiToken.fieldName')" :rules="[rules.required]" variant="outlined" autofocus maxlength="250" />
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="createDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-plus" :loading="creating" @click="doCreate">{{ t('system.apiToken.create') }}</LjButton>
      </template>
    </LjDialog>

    <!-- Freshly-created token value. -->
    <LjDialog v-model="createdDialog" :title="`${t('system.apiToken.newTokenLabel')} ${createdName}`" icon="mdi-key-plus" :max-width="540">
      <p class="hint"><v-icon size="16">mdi-information-outline</v-icon>{{ t('system.apiToken.newSaveHint', { showLabel: t('system.apiToken.show') }) }}</p>
      <div class="secret"><code>{{ createdValue }}</code><button class="copy" :title="t('common.copy') || 'Copier'" @click="doCopy(createdValue)"><v-icon size="16">mdi-content-copy</v-icon></button></div>
      <template #footer>
        <LjButton @click="createdDialog = false">{{ t('system.apiToken.done') }}</LjButton>
      </template>
    </LjDialog>

    <!-- Show / regenerate token value. -->
    <LjDialog v-model="tokenDialog" :title="`${t('system.apiToken.tokenLabel')} ${tokenTarget}`" icon="mdi-key" :max-width="540">
      <div class="secret" :class="{ loading: tokenLoading }">
        <span v-if="tokenLoading" class="mspin sm dark" aria-hidden="true" />
        <code v-else>{{ tokenValue }}</code>
        <button v-if="!tokenLoading" class="copy" :title="t('common.copy') || 'Copier'" @click="doCopy(tokenValue, true)"><v-icon size="16">mdi-content-copy</v-icon></button>
      </div>
      <p v-if="copyDone" class="copied"><v-icon size="15">mdi-check-circle</v-icon>{{ t('system.apiToken.copyDone') }}</p>
      <template #footer>
        <LjButton variant="ghost" @click="tokenDialog = false">{{ t('common.close') || 'Fermer' }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.apiToken.deleteTitle')" icon="mdi-key-remove" confirm-color="error" :confirm-label="t('system.apiToken.revoke')" :loading="deleting" @confirm="confirmDelete">
      {{ t('system.apiToken.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget }}</strong>{{ t('system.apiToken.deleteConfirmAfter') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useAuthStore, useI18nStore, useClipboard, APP_BASE } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjSearch, LjDialog } from '@ligoj/host'
import RowActionsCog from '../components/RowActionsCog.vue'

const api = useApi()
const app = useAppStore()
const auth = useAuthStore()
const i18n = useI18nStore()
const t = i18n.t
const { copy } = useClipboard()

const base = APP_BASE
const origin = typeof window !== 'undefined' ? window.location.origin : ''
const userName = computed(() => auth.userName || '<you>')

const rows = ref([])
const loading = ref(false)
const error = ref(null)
const query = ref('')

const headers = computed(() => [
  { key: 'name', label: t('system.apiToken.headerName'), sortable: true, icon: 'mdi-key-outline' },
])
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? rows.value.filter((r) => r.name.toLowerCase().includes(q)) : rows.value
})

const rules = { required: (v) => !!v || (t('common.required') || 'Required') }

const createDialog = ref(false)
const createFormRef = ref(null)
const createName = ref('')
const creating = ref(false)

const createdDialog = ref(false)
const createdName = ref('')
const createdValue = ref('')

const tokenDialog = ref(false)
const tokenTarget = ref('')
const tokenValue = ref('')
const tokenLoading = ref(false)
const copyDone = ref(false)

const deleteDialog = ref(false)
const deleteTarget = ref('')
const deleting = ref(false)

async function load() {
  loading.value = true; error.value = null
  try {
    const data = await api.get('rest/api/token')
    rows.value = Array.isArray(data) ? data.map((name) => ({ name })) : []
  } catch { error.value = t('common.loadError') || 'Load error' }
  loading.value = false
}

function openCreate() { createName.value = ''; createDialog.value = true }
async function doCreate() {
  const { valid } = await createFormRef.value.validate()
  if (!valid) return
  creating.value = true
  try {
    const result = await api.post(`rest/api/token/${encodeURIComponent(createName.value)}`)
    if (result === null) return
    createdName.value = createName.value
    createdValue.value = typeof result === 'string' ? result : result?.id || ''
    createDialog.value = false
    createdDialog.value = true
    load()
  } finally { creating.value = false }
}

async function openShow(name, mode) {
  tokenTarget.value = name
  tokenValue.value = ''
  copyDone.value = false
  tokenDialog.value = true
  tokenLoading.value = true
  try {
    const url = `rest/api/token/${encodeURIComponent(name)}`
    const data = mode === 'regen' ? await api.put(url) : await api.get(url)
    tokenValue.value = typeof data === 'string' ? data : data?.id || ''
  } finally { tokenLoading.value = false }
}

async function doCopy(value, flag) {
  if (!value) return
  copy(value)
  if (flag) { copyDone.value = true; setTimeout(() => { copyDone.value = false }, 2000) }
}

function startDelete(name) { deleteTarget.value = name; deleteDialog.value = true }
async function confirmDelete() {
  deleting.value = true
  try {
    await api.del(`rest/api/token/${encodeURIComponent(deleteTarget.value)}`)
    deleteDialog.value = false
    load()
  } finally { deleting.value = false }
}

onMounted(() => {
  app.setBreadcrumbs([{ title: t('nav.home'), to: '/' }, { title: t('api.title'), to: '/api' }, { title: t('system.apiToken.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, primary button,
   create/show/regenerate dialogs, row icon buttons) comes from the shared
   host components + the global `.lj-surface` / `.lj-iconbtn` classes, which
   supply the ink, pill, radius, mono, surface, card and border vars these
   rules read. The `.usage` explainer and `.secret` token box are bespoke. */
.sub b { color: var(--ink-2); font-family: var(--mono); }

.usage { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); margin-bottom: 18px; }
.us-ic { width: 42px; height: 42px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 8px 18px -8px rgba(139, 92, 246, .55); }
.us-body { min-width: 0; flex: 1; }
.us-intro { margin: 0 0 8px; font-size: 13.5px; color: var(--ink-2); font-weight: 500; line-height: 1.5; }
.us-ex { display: block; font-family: var(--mono); font-size: 12px; color: var(--ink-2); background: var(--pill); padding: 9px 12px; border-radius: 9px; overflow-x: auto; white-space: nowrap; }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

.avatar-cell { display: flex; align-items: center; gap: 12px; }
.kglyph { width: 34px; height: 34px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: rgba(139, 92, 246, .13); color: #8b5cf6; }
.kname { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--ink); }

/* Dialog body bits (slotted into LjDialog; --pill/--mono/--accent come from
   the dialog card's `.lj-surface`). */
.hint { display: flex; align-items: flex-start; gap: 7px; margin: 0 0 12px; font-size: 12.5px; font-weight: 500; color: var(--ink-2); background: rgba(47, 109, 246, .1); padding: 9px 12px; border-radius: 10px; }
.hint :deep(.v-icon) { color: #2f6df6; flex: none; margin-top: 1px; }
.secret { display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 12px 14px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--pill); }
.secret code { flex: 1; font-family: var(--mono); font-size: 13px; color: var(--ink); word-break: break-all; line-height: 1.5; }
.secret .copy { flex: none; }
.copy { border: 0; background: transparent; cursor: pointer; color: var(--ink-3); display: inline-grid; place-items: center; padding: 6px; border-radius: 8px; }
.copy:hover { color: var(--accent); background: var(--hover); }
.copied { display: flex; align-items: center; gap: 6px; margin: 8px 0 0; font-size: 12.5px; font-weight: 600; color: #1d9d63; }
.copied :deep(.v-icon) { color: #1d9d63; }
/* Busy spinner shown while the token value loads in the show dialog. */
.mspin.sm.dark { width: 18px; height: 18px; border: 2px solid var(--border-2); border-top-color: var(--accent); border-radius: 50%; animation: sspin .7s linear infinite; }
@keyframes sspin { to { transform: rotate(360deg); } }
</style>
