<!--
  SystemPluginsView — 2026 "Vibrant" plugin manager. Ports plugin-ui's
  SystemPluginView logic (rest/system/plugin: list / search / install /
  upgrade / delete / check-versions / restart) onto a richer Vibrant chrome:
  KPI stat cards, a custom repository picker (same language-picker pattern as
  the login/profile), VibrantDataTable rows with a coloured type pill, a
  two-line name/artifact cell, a glowing status dot and count chips, plus a
  .vmodal install dialog and VibrantConfirmDialog. Mockup ref: viewPlugins.
-->
<template>
  <div class="plugins lj-surface">
    <LjPageHeader :title="t('system.plugin.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.plugin.title'), current: true }]">
      <template #subtitle>
        <b>{{ rows.length }}</b> {{ t('system.plugin.countLabel') }}
      </template>
      <template #actions>
        <!-- Custom repository picker (mirrors the login/profile locale picker). -->
        <div class="vsel" :class="{ open: repoOpen }" ref="repoSel">
          <button type="button" class="vsel-btn" @click="repoOpen = !repoOpen">
            <v-icon size="16">mdi-source-repository</v-icon>
            <span class="vlabel">{{ currentRepo.label }}</span>
            <span class="vcaret">▾</span>
          </button>
          <div v-if="repoOpen" class="vsel-menu">
            <button v-for="r in REPOSITORIES" :key="r.id" type="button" class="vsel-opt" :class="{ sel: r.id === repository }" @click="pickRepo(r.id)">
              <v-icon size="16">{{ r.icon }}</v-icon><span class="vlabel">{{ r.label }}</span>
              <span v-if="r.id === repository" class="vok">✓</span>
            </button>
          </div>
        </div>
        <LjButton variant="ghost" icon="mdi-magnify-plus-outline" :disabled="checking" @click="askCheckVersions">{{ t('system.plugin.checkVersions') }}</LjButton>
        <LjButton variant="danger" icon="mdi-restart" :disabled="restarting" @click="askRestart">{{ t('system.plugin.restart') }}</LjButton>
        <LjButton variant="ghost" icon="mdi-upload" @click="openUpload">{{ t('system.plugin.upload') }}</LjButton>
        <LjButton icon="mdi-plus" @click="openInstall">{{ t('system.plugin.install') }}</LjButton>
      </template>
    </LjPageHeader>

    <!-- KPI stat cards -->
    <div class="stats">
      <div v-for="(s, i) in stats" :key="s.key" class="stat" :style="{ '--c': s.color, 'animation-delay': (i * 50) + 'ms' }">
        <div class="stop">
          <span class="sicon"><v-icon size="22">{{ s.icon }}</v-icon></span>
          <div class="sbody">
            <div class="snum">{{ s.value }}<span v-if="s.key !== 'total' && rows.length" class="spct">{{ Math.round(s.pct) }}%</span></div>
            <div class="slabel">{{ s.label }}</div>
          </div>
        </div>
        <div class="sbar"><i :style="{ width: s.pct + '%' }" /></div>
      </div>
    </div>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <VibrantDataTable :headers="headers" :items="rows" :items-length="rows.length" :loading="loading" item-value="id" default-sort="name" :empty-text="t('common.noData')" filename="system-plugins.csv">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span v-if="item.node" class="logo-tile"><NodeIcon :node="item.node" /></span>
          <span v-else class="tglyph" :class="item.type"><v-icon size="18">{{ typeIcon(item.type) }}</v-icon></span>
          <div class="ac-txt">
            <div class="ac-name">{{ item.name || '—' }}</div>
            <code class="ac-sub">{{ item.artifact }}</code>
          </div>
        </div>
      </template>
      <template #cell.key="{ item }"><code class="mono">{{ item.key || '—' }}</code></template>
      <template #cell.version="{ item }">
        <span class="mono ver">{{ item.version || '—' }}</span>
        <span v-if="item.latestLocalVersion" class="vchip local" :title="t('system.plugin.cancelLocal')" @click.stop="cancelLocal(item)">{{ item.latestLocalVersion }}<v-icon size="13">mdi-close</v-icon></span>
        <span v-if="item.newVersion && item.newVersion !== item.latestLocalVersion" class="vchip up" :title="t('system.plugin.upgradeAvailable')" @click.stop="installOne(item.artifact)"><v-icon size="13">mdi-arrow-up</v-icon>{{ item.newVersion }}</span>
      </template>
      <!-- Verified vendor: the code-signature state of the installed JAR, computed
           at startup by the API. The signer identity is only trustworthy with the
           VERIFIED status (certificate chained to the configured truststore);
           without signature, the self-declared manifest vendor shows greyed. -->
      <template #cell.vendor="{ item }">
        <span v-if="item.signature" class="sig" :class="signatureMeta(item).cls">
          <v-icon size="16">{{ signatureMeta(item).icon }}</v-icon>
          <span class="sig-name">{{ ['VERIFIED', 'SIGNED'].includes(item.signature.status) ? signerCn(item.signature.signer) : signatureLabel(item) }}</span>
          <v-tooltip activator="parent" location="top" :text="signatureLabel(item) + (item.signature.signer ? ' — ' + item.signature.signer : '')" />
        </span>
        <span v-else-if="item.vendor" class="sig unsigned">
          <v-icon size="16">mdi-shield-off-outline</v-icon><span class="sig-name">{{ item.vendor }}</span>
          <v-tooltip activator="parent" location="top" :text="t('system.plugin.signature.declared')" />
        </span>
        <span v-else class="muted">—</span>
      </template>
      <template #cell.statut="{ item }">
        <LjStatus :status="item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'warn' : 'idle'"
                  :tooltip="statusLabel(item.status)" />
      </template>
      <template #cell.enabled="{ item }">
        <span v-if="item.node" class="switch" :class="{ on: item.enabled, busy: togglingKey === item.key }" role="switch" :aria-checked="item.enabled" :title="t('system.plugin.toggleHint')" @click.stop="toggleEnabled(item)" />
        <span v-else class="muted">—</span>
      </template>
      <template #actions="{ item }">
        <v-icon v-if="item.deleted" size="18" color="warning" :title="t('system.plugin.deletionScheduled')">mdi-cancel</v-icon>
        <button v-else class="lj-iconbtn danger" @click.stop="askRemove(item.artifact)">
          <v-icon size="18">mdi-delete-outline</v-icon>
          <v-tooltip activator="parent" :text="t('system.plugin.delete')" location="top" />
        </button>
      </template>
    </VibrantDataTable>

    <!-- Install dialog (shared chrome) -->
    <LjDialog v-model="installDialog" :title="t('system.plugin.installTitle')" icon="mdi-puzzle-plus-outline" :max-width="640">
      <v-autocomplete v-model="installSelection" v-model:search="installSearch" :items="searchResults" item-value="artifact" :label="t('system.plugin.searchArtifacts')"
        :hint="t('system.plugin.searchHint', { repository })" persistent-hint multiple chips closable-chips clearable variant="outlined" :loading="searching" no-filter return-object autofocus
        prepend-inner-icon="mdi-puzzle-plus-outline">
        <template #item="{ props: ip, item }">
          <v-list-item v-bind="ip" :title="item.raw.artifact" :subtitle="item.raw.version" />
        </template>
        <template #no-data>
          <v-list-item :title="installSearch ? t('system.plugin.searchNoMatch') : t('system.plugin.searchPrompt')" />
        </template>
      </v-autocomplete>
      <v-checkbox v-model="installJavadoc" :label="t('system.plugin.installJavadoc')" density="comfortable" hide-details class="mt-1" />
      <div v-if="installing" class="prog"><div class="bar"><i :style="{ width: (installProgress.total ? Math.round(installProgress.current / installProgress.total * 100) : 0) + '%' }" /></div>
        <p>{{ t('system.plugin.installProgress', { current: installProgress.current, total: installProgress.total, label: installProgress.label }) }}</p></div>
      <template #footer>
        <LjButton variant="ghost" :disabled="installing" @click="installDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-download" :disabled="!installSelection.length" :loading="installing" @click="doInstall">{{ t('system.plugin.installAction', { count: installSelection.length || '' }) }}</LjButton>
      </template>
    </LjDialog>

    <!-- Upload dialog (legacy feature parity): install a plugin JAR from the
         local file system via PUT rest/system/plugin/upload (multipart). The
         plugin is staged locally and activated on the next restart. -->
    <LjDialog v-model="uploadDialog" :title="t('system.plugin.uploadTitle')" icon="mdi-upload" :max-width="560">
      <v-file-input v-model="uploadFile" :label="t('system.plugin.uploadFile')" accept=".jar" prepend-icon="" prepend-inner-icon="mdi-package-variant-closed"
        variant="outlined" density="comfortable" :hint="t('system.plugin.uploadHint')" persistent-hint class="mb-3" />
      <v-text-field v-model="uploadId" :label="t('system.plugin.uploadId')" prepend-inner-icon="mdi-identifier" variant="outlined" density="comfortable" class="mb-3" />
      <v-text-field v-model="uploadVersion" :label="t('system.plugin.uploadVersion')" prepend-inner-icon="mdi-tag-outline" variant="outlined" density="comfortable" />
      <template #footer>
        <LjButton variant="ghost" :disabled="uploading" @click="uploadDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-upload" :disabled="!uploadFile || !uploadId || !uploadVersion" :loading="uploading" @click="doUpload">{{ t('system.plugin.uploadAction') }}</LjButton>
      </template>
    </LjDialog>

    <!-- Restart progress dialog: after the restart is requested, polls the API
         availability and auto-closes (+ success toast) once it answers again. -->
    <LjDialog v-model="restartDialog" :title="t('system.plugin.restartTitle')" icon="mdi-restart" :max-width="460" persistent>
      <div class="restart-body">
        <template v-if="restartState !== 'timeout'">
          <v-progress-circular indeterminate size="44" width="4" color="primary" />
          <p class="restart-msg">{{ restartState === 'ready' ? t('system.plugin.restartReady') : t('system.plugin.restartWaiting') }}</p>
          <p class="restart-sub">{{ t('system.plugin.restartSub') }}</p>
        </template>
        <template v-else>
          <span class="restart-warn"><v-icon size="40">mdi-alert-outline</v-icon></span>
          <p class="restart-msg">{{ t('system.plugin.restartTimeout') }}</p>
        </template>
      </div>
      <template v-if="restartState === 'timeout'" #footer>
        <LjButton variant="ghost" @click="restartDialog = false">{{ t('common.close') }}</LjButton>
        <LjButton icon="mdi-refresh" @click="startRestartPolling">{{ t('system.plugin.restartRetry') }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="confirm.open" :title="confirm.title" :icon="confirm.icon" :icon-color="confirm.color" :message="confirm.text" :confirm-label="confirm.label" :confirm-color="confirm.color" :loading="confirm.busy" @confirm="runConfirm">
      <template v-if="confirm.parts">{{ confirm.parts.before }}<strong class="text-error">{{ confirm.parts.name }}</strong>{{ confirm.parts.after }}</template>
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useApi, useAppStore, useErrorStore, useI18nStore, NodeIcon } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjDialog, LjStatus } from '@ligoj/host'
import { statusHeader } from '../useUiHelpers.js'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const REPOSITORIES = computed(() => [
  { id: 'central', label: t('system.plugin.repoCentral'), icon: 'mdi-apache-kafka' },
  { id: 'nexus', label: t('system.plugin.repoNexus'), icon: 'mdi-package-variant-closed' },
])
const repository = ref('central')
const currentRepo = computed(() => REPOSITORIES.value.find((r) => r.id === repository.value) || REPOSITORIES.value[0])
const repoOpen = ref(false)
const repoSel = ref(null)
function pickRepo(id) { repository.value = id; repoOpen.value = false; load() }
function onDocClick(e) { if (repoSel.value && !repoSel.value.contains(e.target)) repoOpen.value = false }

const items = ref([])
const loading = ref(false)
const error = ref(null)
const checking = ref(false)
const restarting = ref(false)

const TYPE_COLOR = { service: '#2f6df6', tool: '#d9701a', feature: '#1d9d63' }

const headers = computed(() => [
  // Status first: icon-only heart header + tooltip + fixed width (shared helper).
  statusHeader({ key: 'statut', tooltip: t('system.plugin.headerStatus'), exportValue: (r) => statusLabel(r.status) }),
  { key: 'name', label: t('system.plugin.headerName'), sortable: true, icon: 'mdi-puzzle-outline', exportValue: (r) => r.name || '' },
  { key: 'key', label: t('system.plugin.headerKey'), sortable: true, icon: 'mdi-identifier', exportValue: (r) => r.key || '' },
  { key: 'version', label: t('system.plugin.headerVersion'), sortable: false, icon: 'mdi-tag-outline', exportValue: (r) => r.version || '' },
  { key: 'vendor', label: t('system.plugin.headerVendor'), sortable: false, icon: 'mdi-shield-account-outline', exportValue: (r) => (r.signature ? `${signatureLabel(r)}${r.signature.signer ? ' — ' + r.signature.signer : ''}` : (r.vendor || '')) },
  { key: 'enabled', label: t('system.plugin.headerEnabled'), sortable: false, align: 'center', icon: 'mdi-power', width: '110px', exportValue: (r) => (r.node ? (r.enabled ? t('system.node.statusEnabled') : t('system.node.statusDisabled')) : '') },
])

function prettyName(artifact, name) {
  if (name) return name
  return String(artifact || '').replace(/^plugin-/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
const rows = computed(() => items.value.map((it) => {
  const enabled = it.node ? (it.node.enabled !== false) : true
  return {
    id: it.plugin?.artifact || it.plugin?.id,
    artifact: it.plugin?.artifact || it.plugin?.id || '',
    type: (it.plugin?.type || '').toLowerCase(),
    name: prettyName(it.plugin?.artifact || it.plugin?.id, it.node?.name || it.plugin?.name),
    key: it.node?.id || '',
    version: it.plugin?.version || '',
    latestLocalVersion: it.latestLocalVersion,
    newVersion: it.newVersion,
    nodes: it.nodes,
    subscriptions: it.subscriptions,
    deleted: it.deleted,
    node: it.node || null,
    enabled,
    status: it.deleted ? 'warn' : (enabled ? 'ok' : 'idle'),
    vendor: it.vendor || null,
    // The backend serializes the status enum in lowercase ("signed"): normalize
    // to the uppercase enum names used by the i18n keys and the meta lookups.
    signature: it.signature ? { ...it.signature, status: String(it.signature.status || 'UNSIGNED').toUpperCase() } : null,
  }
}))

/* Code-signature presentation: icon/color per status + signer CN extraction. */
const SIGNATURE_META = {
  VERIFIED: { icon: 'mdi-shield-check', cls: 'verified' },
  SIGNED: { icon: 'mdi-shield-outline', cls: 'signed' },
  INVALID: { icon: 'mdi-shield-alert', cls: 'invalid' },
  UNSIGNED: { icon: 'mdi-shield-off-outline', cls: 'unsigned' },
}
function signatureMeta(r) { return SIGNATURE_META[r.signature?.status] || SIGNATURE_META.UNSIGNED }
function signatureLabel(r) { return t('system.plugin.signature.' + (r.signature?.status || 'UNSIGNED')) }
function signerCn(dn) { const m = /(?:^|,)CN=([^,]+)/.exec(dn || ''); return m ? m[1] : (dn || '') }

const stats = computed(() => {
  const by = (ty) => rows.value.filter((r) => r.type === ty).length
  const total = rows.value.length || 1
  const pct = (v, k) => k === 'total' ? 100 : Math.round((v / total) * 100)
  return [
    { key: 'total', label: t('system.plugin.statTotal'), value: rows.value.length, icon: 'mdi-puzzle', color: 'rgb(var(--v-theme-secondary))' },
    { key: 'service', label: t('system.plugin.statServices'), value: by('service'), icon: 'mdi-puzzle-outline', color: TYPE_COLOR.service },
    { key: 'tool', label: t('system.plugin.statTools'), value: by('tool'), icon: 'mdi-hammer-wrench', color: TYPE_COLOR.tool },
    { key: 'feature', label: t('system.plugin.statFeatures'), value: by('feature'), icon: 'mdi-wrench-outline', color: TYPE_COLOR.feature },
  ].map((s) => ({ ...s, pct: pct(s.value, s.key) }))
})

function typeIcon(type) {
  if (type === 'feature') return 'mdi-wrench-outline'
  if (type === 'tool') return 'mdi-hammer-wrench'
  return 'mdi-puzzle-outline'
}
function typeLabel(type) { return t('system.plugin.type.' + (type || 'service')) }
function statusLabel(s) { return t('system.plugin.status.' + s) }

/* Enable/disable the plugin's associated node (real action via PUT rest/node,
   keeping parameters via untouchedParameters). Disabling asks for confirm. */
const togglingKey = ref('')
function toggleEnabled(item) {
  if (!item.node) return
  if (item.enabled) {
    ask({ title: t('system.plugin.confirmDisableTitle'), parts: splitAround('system.plugin.confirmDisableText', item.name, 'name'), label: t('system.plugin.disable'), color: 'warning', icon: 'mdi-power', action: () => doToggle(item, false) })
  } else {
    doToggle(item, true)
  }
}
async function doToggle(item, enable) {
  togglingKey.value = item.key
  try {
    await api.put('rest/node', { id: item.node.id, node: item.node.refined?.id, name: item.node.name, mode: item.node.mode || 'all', enabled: enable, untouchedParameters: true })
    await load()
  } finally { togglingKey.value = '' }
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await api.get(`rest/system/plugin?repository=${repository.value}`)
    items.value = Array.isArray(data) ? data : (data?.data || [])
  } catch { error.value = t('common.loadError') || 'Load error' }
  loading.value = false
}

/* ---- install dialog ---- */
const installDialog = ref(false)
const installSelection = ref([])
const installSearch = ref('')
const searchResults = ref([])
const searching = ref(false)
const installJavadoc = ref(false)
const installing = ref(false)
const installProgress = reactive({ current: 0, total: 0, label: '' })
let searchTimer = null

function openInstall() { installSelection.value = []; installSearch.value = ''; searchResults.value = []; installJavadoc.value = false; installDialog.value = true }

/* Upload of a local plugin JAR (legacy feature parity): multipart PUT to
   rest/system/plugin/upload. The plugin is staged in the local repository
   and activated on the next restart (shows up as latestLocalVersion). */
const errorStore = useErrorStore()
const uploadDialog = ref(false)
const uploadFile = ref(null)
const uploadId = ref('')
const uploadVersion = ref('')
const uploading = ref(false)
function openUpload() { uploadFile.value = null; uploadId.value = ''; uploadVersion.value = ''; uploadDialog.value = true }
watch(uploadFile, (v) => {
  const file = Array.isArray(v) ? v[0] : v
  if (!file) return
  // Prefill artifact/version from the conventional `<artifactId>-<version>.jar`
  // filename (same version pattern as the backend PluginsClassLoader).
  const m = /^(.+)-(\d[\da-zA-Z]*(?:\.[\da-zA-Z]+){1,3}(?:-SNAPSHOT)?)\.jar$/.exec(file.name)
  if (m) { uploadId.value = m[1]; uploadVersion.value = m[2] }
})
async function doUpload() {
  const file = Array.isArray(uploadFile.value) ? uploadFile.value[0] : uploadFile.value
  if (!file || !uploadId.value || !uploadVersion.value) return
  uploading.value = true
  try {
    const form = new FormData()
    form.append('plugin-file', file)
    form.append('plugin-id', uploadId.value)
    form.append('plugin-version', uploadVersion.value)
    // `raw`: the endpoint answers 204 No Content on success
    const res = await api.request('rest/system/plugin/upload', { method: 'PUT', body: form, raw: true })
    if (!res?.ok) return
    errorStore.success(t('system.plugin.uploadSuccess', { id: uploadId.value, version: uploadVersion.value }))
    uploadDialog.value = false
    load()
  } finally { uploading.value = false }
}

watch(installSearch, (q) => {
  clearTimeout(searchTimer)
  const term = (q || '').trim()
  if (!term) { searchResults.value = []; return }
  searchTimer = setTimeout(async () => {
    searching.value = true
    try {
      const data = await api.get(`rest/system/plugin/search?repository=${repository.value}&q=${encodeURIComponent(term)}`)
      searchResults.value = Array.isArray(data) ? data : (data?.data || [])
    } finally { searching.value = false }
  }, 300)
})
onBeforeUnmount(() => { clearTimeout(searchTimer); stopRestartPolling(); document.removeEventListener('click', onDocClick) })

async function doInstall() {
  if (!installSelection.value.length) return
  installing.value = true; installProgress.current = 0; installProgress.total = installSelection.value.length
  try {
    for (const entry of installSelection.value) {
      installProgress.current++; installProgress.label = entry.artifact
      await api.post(`rest/system/plugin/${encodeURIComponent(entry.artifact)}?repository=${repository.value}&javadoc=${installJavadoc.value}`)
    }
  } finally { installing.value = false; installDialog.value = false; installSelection.value = []; load() }
}
async function installOne(artifact) { await api.post(`rest/system/plugin/${encodeURIComponent(artifact)}?repository=${repository.value}&javadoc=false`); load() }
async function cancelLocal(item) { await api.del(`rest/system/plugin/${item.artifact}/${item.latestLocalVersion}`); load() }

/* ---- confirm (restart / check / delete) ---- */
const confirm = reactive({ open: false, title: '', text: '', parts: null, label: '', color: 'brand', icon: 'mdi-puzzle', busy: false, action: () => {} })
function ask(o) { Object.assign(confirm, { parts: null, ...o, busy: false, open: true }) }
/* Split a translated sentence around a value so it can be rendered bold-red. */
function splitAround(key, value, param) {
  const full = t(key, { [param]: value })
  const i = full.indexOf(value)
  return i < 0 ? { before: full, name: '', after: '' } : { before: full.slice(0, i), name: value, after: full.slice(i + value.length) }
}
async function runConfirm() { confirm.busy = true; try { await confirm.action() } finally { confirm.busy = false; confirm.open = false } }

/* ---- restart + availability polling ----
   The API context is restarted server-side (its HTTP server is recreated), so
   requests fail during the window then succeed again. We poll a cheap
   authenticated endpoint silently (no error toast / no auth redirect on the
   transient failures) and require having observed it DOWN at least once before
   accepting an UP — so we don't mistake the not-yet-stopped instance for the
   restarted one. A grace fallback accepts UP if the restart was faster than the
   first poll, and an overall timeout surfaces a retry. */
const RESTART_POLL_MS = 3000
const RESTART_TIMEOUT_MS = 180000
const restartDialog = ref(false)
const restartState = ref('waiting') // waiting | ready | timeout
let restartTimer = null
let restartActive = false
function stopRestartPolling() {
  restartActive = false
  if (restartTimer) { clearTimeout(restartTimer); restartTimer = null }
}
async function pingApi() {
  try {
    const res = await api.get('rest/system/configuration', { silent: true, raw: true })
    return !!res?.ok
  } catch { return false }
}
function startRestartPolling() {
  stopRestartPolling()
  restartActive = true
  restartState.value = 'waiting'
  restartDialog.value = true
  const startedAt = Date.now()
  let seenDown = false
  // Self-scheduling poll (NOT setInterval): the next tick is armed only AFTER
  // the current request resolves, so polls never overlap — during the restart
  // window the API request hangs/refuses, and setInterval would otherwise queue
  // several pending pings that all resolve at once when the API returns.
  const tick = async () => {
    restartTimer = null
    if (!restartActive) return
    const up = await pingApi()
    if (!restartActive) return // dialog dismissed while the request was in flight
    const elapsed = Date.now() - startedAt
    // Up: accept once we saw it go down, or via the grace fallback (fast restart).
    if (up && (seenDown || elapsed > RESTART_POLL_MS * 3)) {
      stopRestartPolling()
      restartState.value = 'ready'
      errorStore.success(t('system.plugin.restartDone'))
      load()
      setTimeout(() => { restartDialog.value = false }, 1200)
      return
    }
    if (!up) seenDown = true
    if (elapsed > RESTART_TIMEOUT_MS) { stopRestartPolling(); restartState.value = 'timeout'; return }
    restartTimer = setTimeout(tick, RESTART_POLL_MS)
  }
  restartTimer = setTimeout(tick, RESTART_POLL_MS)
}
// Stop polling if the dialog is dismissed manually.
watch(restartDialog, (open) => { if (!open) stopRestartPolling() })

function askRestart() {
  ask({
    title: t('system.plugin.confirmRestartTitle'), text: t('system.plugin.confirmRestartText'),
    label: t('system.plugin.restart'), color: 'error', icon: 'mdi-restart',
    action: async () => {
      restarting.value = true
      try {
        await api.put('rest/system/plugin/restart')
        startRestartPolling()
      } finally { restarting.value = false }
    },
  })
}
function askCheckVersions() { ask({ title: t('system.plugin.confirmCheckTitle'), text: t('system.plugin.confirmCheckText', { repository: repository.value }), label: t('system.plugin.confirmCheckLabel'), color: 'brand', icon: 'mdi-magnify-plus-outline', action: async () => { checking.value = true; try { await api.put(`rest/system/plugin/cache?repository=${repository.value}`); await load() } finally { checking.value = false } } }) }
function askRemove(artifact) { ask({ title: t('system.plugin.confirmDeleteTitle'), parts: splitAround('system.plugin.confirmDeleteText', artifact, 'artifact'), label: t('common.delete'), color: 'error', icon: 'mdi-delete-outline', action: async () => { await api.del(`rest/system/plugin/${artifact}`); await load() } }) }

onMounted(() => {
  document.addEventListener('click', onDocClick)
  app.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.plugin.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, primary/ghost/danger buttons,
   install dialog, row delete button) comes from the shared host components +
   the global `.lj-surface` / `.lj-iconbtn` classes, which supply the ink,
   pill, radius, mono, surface, card and border vars these rules read. The
   `.vsel` repository picker is bespoke (no shared equivalent). */
.sub b { color: var(--ink-2); font-family: var(--mono); }

/* Custom repository picker (login/profile locale-picker pattern) */
.vsel { position: relative; }
.vsel-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--surface); color: var(--ink-2); font-family: var(--font); font-size: 14px; font-weight: 700; line-height: 1.2; cursor: pointer; transition: border-color .15s; }
.vsel-btn:hover { border-color: var(--border-2); }
.vcaret { color: var(--ink-3); font-size: 11px; transition: transform .2s; }
.vsel.open .vcaret { transform: rotate(180deg); }
.vsel-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 190px; background: var(--surface); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); box-shadow: var(--shadow-lg); padding: 5px; z-index: 20; animation: vmenu .12s ease; }
@keyframes vmenu { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.vsel-opt { width: 100%; display: flex; align-items: center; gap: 9px; padding: 9px 11px; border: 0; background: transparent; border-radius: var(--radius-sm); color: var(--ink); font-family: var(--font); font-size: 13.5px; font-weight: 600; cursor: pointer; text-align: left; }
.vsel-opt:hover { background: var(--hover); }
.vsel-opt.sel { color: var(--accent); }
.vlabel { white-space: nowrap; }
.vok { margin-left: auto; color: var(--accent); font-weight: 800; }

/* KPI stat cards */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 18px; }
.stat { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: linear-gradient(135deg, color-mix(in srgb, var(--c) 9%, var(--card)), var(--card)); box-shadow: var(--shadow); overflow: hidden; opacity: 0; transform: translateY(10px); animation: rise .5s cubic-bezier(.2, .7, .3, 1) forwards; transition: transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s, border-color .18s; }
.stat:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -20px color-mix(in srgb, var(--c) 55%, transparent); border-color: color-mix(in srgb, var(--c) 30%, var(--border)); }
@keyframes rise { to { opacity: 1; transform: none; } }
.stop { display: flex; align-items: center; gap: 14px; }
.sicon { width: 46px; height: 46px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 70%, #000)); box-shadow: 0 8px 18px -8px color-mix(in srgb, var(--c) 65%, transparent); }
.snum { display: flex; align-items: baseline; gap: 7px; font-family: var(--mono); font-weight: 700; font-size: 26px; line-height: 1; color: var(--ink); }
.spct { font-size: 12px; font-weight: 700; color: color-mix(in srgb, var(--c) 70%, var(--ink-3)); }
.slabel { font-size: 12.5px; font-weight: 600; color: var(--ink-3); margin-top: 4px; }
.sbar { height: 6px; border-radius: 4px; background: var(--pill); overflow: hidden; }
.sbar i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, white)); transition: width .5s cubic-bezier(.2, .7, .3, 1); }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

/* table cells */
.avatar-cell { display: flex; align-items: center; gap: 12px; }
.tglyph { width: 36px; height: 36px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #8a92a3, #5b6472); }
.tglyph.service { background: linear-gradient(135deg, #2f6df6, #2552c9); }
.tglyph.tool { background: linear-gradient(135deg, #ff9436, #d9701a); }
.tglyph.feature { background: linear-gradient(135deg, #1d9d63, #15784b); }
.ac-name { font-family: var(--font); font-weight: 700; font-size: 14px; color: var(--ink); line-height: 1.2; }
.ac-key, .ac-sub { font-family: var(--mono); font-size: 11.5px; color: var(--ink-3); }
/* Brand logo tile (white, like the cockpit tool logos). */
.logo-tile { width: 36px; height: 36px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 var(--border-w) var(--border-c), 0 2px 6px -3px rgba(0, 0, 0, .3); }
.logo-tile :deep(img.tool-icon) { width: 22px; height: 22px; object-fit: contain; }
.logo-tile :deep(i) { font-size: 20px; color: #475569; }
/* Restart progress dialog. */
.restart-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 14px 8px 6px; }
.restart-msg { font-family: var(--font); font-weight: 700; font-size: 15px; color: var(--ink); margin: 0; }
.restart-sub { font-size: 12.5px; color: var(--ink-3); margin: 0; }
.restart-warn { color: rgb(var(--v-theme-warning)); display: grid; place-items: center; }

/* Code-signature / vendor cell. */
.sig { display: inline-flex; align-items: center; gap: 6px; }
.sig-name { font-family: var(--font); font-weight: 600; font-size: 12.5px; }
.sig.verified { color: #1d9d63; }
.sig.signed { color: #d9701a; }
.sig.invalid { color: #df4d42; }
.sig.unsigned { color: var(--ink-3); }

/* Toggle switch (mockup .switch). */
.switch { display: inline-block; width: 44px; height: 25px; border-radius: 20px; background: var(--border-2); position: relative; cursor: pointer; transition: background .2s, opacity .2s; vertical-align: middle; }
.switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 19px; height: 19px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); transition: left .2s; }
.switch.on { background: #1d9d63; }
.switch.on::after { left: 22px; }
.switch.busy { opacity: .5; pointer-events: none; }
.pill { display: inline-flex; align-items: center; font-family: var(--font); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; padding: 3px 10px; border-radius: 999px; color: var(--ink-2); background: var(--pill); }
.pill.service { color: #2f6df6; background: rgba(47, 109, 246, .13); }
.pill.tool { color: #d9701a; background: rgba(255, 122, 24, .14); }
.pill.feature { color: #1d9d63; background: rgba(29, 157, 99, .14); }
.mono { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
.ver { font-weight: 700; }
.muted { color: var(--ink-3); }
.cchip { display: inline-grid; place-items: center; min-width: 26px; height: 24px; padding: 0 8px; border-radius: var(--radius-sm); font-family: var(--mono); font-weight: 700; font-size: 12px; color: var(--ink-2); background: var(--pill); }
.sdot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; position: relative; }
.sdot::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; background: currentColor; opacity: .2; }
.sdot.ok { background: #1d9d63; color: #1d9d63; }
.sdot.warn { background: #d98a16; color: #d98a16; }
.vchip { display: inline-flex; align-items: center; gap: 2px; font-family: var(--mono); font-size: 10.5px; font-weight: 700; border-radius: var(--radius-sm); padding: 1px 6px; margin-left: 6px; cursor: pointer; }
.vchip.local { color: var(--accent); background: rgba(var(--v-theme-secondary), .14); }
.vchip.up { color: #1d9d63; background: rgba(29, 157, 99, .14); }
/* Danger accent for the inline delete trigger (base `.lj-iconbtn` is global). */
.lj-iconbtn.danger:hover { background: rgba(var(--v-theme-error), .1); color: rgb(var(--v-theme-error)); }

/* Install progress bar inside the dialog body (--pill comes from the
   LjDialog card's `.lj-surface`). */
.prog { margin-top: 12px; }
.prog .bar { height: 7px; border-radius: 5px; background: var(--pill); overflow: hidden; }
.prog .bar i { display: block; height: 100%; background: linear-gradient(90deg, #ff9436, #ff5a52); transition: width .2s; }
.prog p { font-size: 12px; color: var(--ink-3); margin: 6px 0 0; }
</style>
