<!--
  SystemConfigurationView — 2026 "Vibrant" configuration manager
  (Administration → Configuration). Ports plugin-ui's SystemConfigurationView
  logic (rest/system/configuration list / save / delete + the crypto encrypt
  helper) onto the Vibrant chrome: breadcrumb-chip header, a search box, KPI
  stat cards that double as filters (Total / Secured / Overridden / Database),
  a collapsible encryption tool, VibrantDataTable with a cog-glyph key cell,
  masked secured values, a source pill and edit/delete row actions, plus a
  Vibrant edit modal and confirm dialog. Mockup language reused from the Nodes
  view. Client-side search / sort / pagination (the key set is small).
-->
<template>
  <div class="config lj-surface">
    <LjPageHeader :title="t('system.config.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.config.title'), current: true }]">
      <template #subtitle>
        <b>{{ items.length }}</b> {{ t('system.config.countLabel') }}<span v-if="filtered.length !== items.length"> · {{ filtered.length }} {{ t('system.config.filtered') }}</span>
      </template>
      <template #actions>
        <LjSearch v-model="query" :placeholder="t('system.config.searchPlaceholder')" @input="page = 1" />
        <LjButton icon="mdi-plus" @click="openNew">{{ t('system.config.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <div class="stats">
      <div v-for="(s, i) in stats" :key="s.key" class="stat" :class="{ active: filter === s.fkey }" :style="{ '--c': s.color, 'animation-delay': (i * 50) + 'ms' }" @click="pickFilter(s.fkey)">
        <div class="stop">
          <span class="sicon"><v-icon size="22">{{ s.icon }}</v-icon></span>
          <div class="sbody"><div class="snum">{{ s.value }}</div><div class="slabel">{{ s.label }}</div></div>
        </div>
        <div class="sbar"><i :style="{ width: s.pct + '%' }" /></div>
      </div>
    </div>

    <!-- Collapsible encryption tool. -->
    <div class="crypto" :class="{ open: cryptoOpen }">
      <button type="button" class="crypto-head" @click="cryptoOpen = !cryptoOpen">
        <span class="ck-ic"><v-icon size="18">mdi-shield-key</v-icon></span>
        <span class="ck-txt"><span class="ck-title">{{ t('system.config.encryptToggle') }}</span><span class="ck-hint">{{ t('system.config.encryptHint') }}</span></span>
        <span class="ck-caret"><v-icon size="20">{{ cryptoOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></span>
      </button>
      <div v-if="cryptoOpen" class="crypto-body">
        <div class="cfield">
          <v-icon size="17" class="cf-ic">mdi-lock-plus-outline</v-icon>
          <input v-model="toEncrypt" type="text" :placeholder="t('system.config.encryptInput')" @keyup.enter="encrypt" />
        </div>
        <LjButton icon="mdi-lock" :icon-size="17" :disabled="!toEncrypt" :loading="encrypting" @click="encrypt">{{ t('system.config.encrypt') }}</LjButton>
        <div class="cfield result">
          <v-icon size="17" class="cf-ic">mdi-key-variant</v-icon>
          <input :value="encrypted" type="text" readonly :placeholder="t('system.config.encryptResult')" />
          <button v-if="encrypted" class="cf-copy" :title="t('common.copy') || 'Copier'" @click="copyResult"><v-icon size="16">mdi-content-copy</v-icon></button>
        </div>
      </div>
    </div>

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <VibrantDataTable :headers="headers" :items="paged" :items-length="filtered.length" :loading="loading" item-value="name"
      :empty-text="query ? t('common.noData') : t('common.noData')" default-sort="name" filename="system-configuration.csv" @update:options="onOptions" @row-click="openEdit">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span class="kglyph" :class="{ secured: item.secured }"><v-icon size="18">{{ item.secured ? 'mdi-lock' : 'mdi-cog-outline' }}</v-icon></span>
          <code class="kname">{{ item.name }}</code>
        </div>
      </template>
      <template #cell.value="{ item }">
        <span v-if="item.secured" class="masked">•••••••••</span>
        <code v-else class="cval" :title="item.value">{{ item.value }}</code>
      </template>
      <template #cell.source="{ item }">
        <span class="srcpill" :title="item.source || ''">
          <v-icon size="14">{{ sourceIcon(item.source) }}</v-icon><span class="src-txt">{{ sourceLabel(item.source) }}</span>
        </span>
        <span v-if="item.overridden" class="ovr" :title="t('system.config.tipOverridden')"><v-icon size="13">mdi-alert</v-icon></span>
      </template>
      <template #actions="{ item }">
        <button class="lj-iconbtn" @click.stop="openEdit(item)">
          <v-icon size="18">mdi-pencil-outline</v-icon>
          <v-tooltip activator="parent" :text="t('common.edit')" location="top" />
        </button>
        <button class="lj-iconbtn danger" @click.stop="startDelete(item)">
          <v-icon size="18">mdi-delete-outline</v-icon>
          <v-tooltip activator="parent" :text="t('common.delete')" location="top" />
        </button>
      </template>
    </VibrantDataTable>

    <!-- Create / edit dialog (shared chrome). -->
    <LjDialog v-model="editDialog" :title="editTarget ? t('system.config.editTitle') : t('system.config.newTitle')" icon="mdi-cog" :max-width="560">
      <v-form ref="formRef" @submit.prevent="save">
        <LjAvailabilityField v-model="editForm.name" v-model:taken="nameTaken" endpoint="system/configuration" :enabled="!editTarget"
          prepend-inner-icon="mdi-key-outline" :label="t('system.config.fieldName')" class="mb-3" autofocus :disabled="!!editTarget" />
        <v-textarea v-model="editForm.value" prepend-inner-icon="mdi-text-long" :label="t('system.config.fieldValue')" :rules="[rules.required]" :counter="1023" maxlength="1023" rows="3" auto-grow variant="outlined" class="mb-2" />
        <label class="chk"><input type="checkbox" v-model="editForm.system" /><span class="chk-box" /><span>{{ t('system.config.fieldSystem') }}</span></label>
        <label class="chk"><input type="checkbox" v-model="editForm.secured" /><span class="chk-box" /><span>{{ t('system.config.fieldSecured') }}</span></label>
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="editDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :loading="saving" @click="save">{{ t('common.save') }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.config.deleteTitle')" icon="mdi-cog" confirm-color="error" :confirm-label="t('common.delete')" :loading="deleting" @confirm="confirmDelete">
      {{ t('system.config.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget?.name }}</strong>{{ t('system.config.deleteConfirmAfter') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useI18nStore, useClipboard, APP_BASE } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjSearch, LjDialog, LjAvailabilityField } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t
const { copy } = useClipboard()

const items = ref([])
const loading = ref(false)
const error = ref(null)

const rules = { required: (v) => (v !== '' && v != null) || (t('common.required') || 'Required') }

/* --- search / filter / sort / pagination (all client-side) --- */
const query = ref('')
const filter = ref('all')
const page = ref(1)
const perPage = ref(25)
const sortKey = ref('name')
const sortOrder = ref('asc')

function pickFilter(id) { filter.value = id; page.value = 1 }
function onOptions(o) {
  page.value = o.page
  perPage.value = o.itemsPerPage
  sortKey.value = o.sortBy?.[0]?.key || 'name'
  sortOrder.value = o.sortBy?.[0]?.order || 'asc'
}

function matchFilter(it) {
  if (filter.value === 'secured') return !!it.secured
  if (filter.value === 'overridden') return !!it.overridden
  if (filter.value === 'database') return /database/i.test(it.source || '')
  return true
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((it) => {
    if (!matchFilter(it)) return false
    if (!q) return true
    return [it.name, it.secured ? '' : it.value, it.source].some((f) => String(f || '').toLowerCase().includes(q))
  })
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  const k = sortKey.value
  arr.sort((a, b) => {
    const va = String(a[k] ?? '').toLowerCase()
    const vb = String(b[k] ?? '').toLowerCase()
    return sortOrder.value === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
  })
  return arr
})

const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return sorted.value.slice(start, start + perPage.value)
})

const headers = computed(() => [
  { key: 'name', label: t('system.config.headerName'), sortable: true, icon: 'mdi-key-outline' },
  { key: 'value', label: t('system.config.headerValue'), sortable: false, icon: 'mdi-text-short', exportValue: (r) => (r.secured ? '•••••••••' : (r.value ?? '')) },
  { key: 'source', label: t('system.config.headerSource'), sortable: true, align: 'center', icon: 'mdi-source-branch', exportValue: (r) => sourceLabel(r.source) },
])

/* --- KPI cards (clickable filters) --- */
const stats = computed(() => {
  const total = items.value.length || 1
  const secured = items.value.filter((i) => i.secured).length
  const overridden = items.value.filter((i) => i.overridden).length
  const database = items.value.filter((i) => /database/i.test(i.source || '')).length
  const mk = (key, fkey, label, icon, color, value) => ({ key, fkey, label, icon, color, value, pct: fkey === 'all' ? 100 : Math.round(value / total * 100) })
  return [
    mk('total', 'all', t('system.config.statTotal'), 'mdi-cog-outline', 'rgb(var(--v-theme-secondary))', items.value.length),
    mk('secured', 'secured', t('system.config.statSecured'), 'mdi-lock', '#8b5cf6', secured),
    mk('overridden', 'overridden', t('system.config.statOverridden'), 'mdi-alert', '#d9701a', overridden),
    mk('database', 'database', t('system.config.statDatabase'), 'mdi-database', '#1d9d63', database),
  ]
})

/* --- source display --- */
const SOURCE_ICONS = {
  systemEnvironment: 'mdi-desktop-classic',
  systemProperties: 'mdi-language-java',
  applicationConfig: 'mdi-file-code',
  database: 'mdi-database',
  classpath: 'mdi-file-code-outline',
}
function sourceIcon(source) {
  if (!source) return 'mdi-help-circle-outline'
  const key = source.split(':')[0]
  return SOURCE_ICONS[source.includes('classpath') ? 'classpath' : key] || 'mdi-help-circle-outline'
}
function sourceLabel(source) {
  if (!source) return '—'
  return source.split(':')[0].replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()
}

/* --- crypto helper --- */
const cryptoOpen = ref(false)
const toEncrypt = ref('')
const encrypted = ref('')
const encrypting = ref(false)
async function encrypt() {
  if (!toEncrypt.value) return
  encrypting.value = true
  try {
    // Endpoint expects a text/plain body; useApi always JSON-encodes strings,
    // so call fetch directly here (mirrors plugin-ui).
    const resp = await fetch(`${APP_BASE}rest/system/security/crypto`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'text/plain' }, body: toEncrypt.value,
    })
    encrypted.value = resp.ok ? await resp.text() : ''
  } catch { encrypted.value = '' } finally { encrypting.value = false }
}
function copyResult() { if (encrypted.value) copy(encrypted.value) }

/* --- load --- */
async function load() {
  loading.value = true; error.value = null
  try {
    const d = await api.get('rest/system/configuration')
    items.value = Array.isArray(d) ? d : (d?.data || [])
  } catch { error.value = t('common.loadError') || 'Load error' }
  loading.value = false
}

/* --- create / edit --- */
const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ name: '', value: '', system: false, secured: false })
const nameTaken = ref(false)
const saving = ref(false)

function openNew() {
  editTarget.value = null
  editForm.value = { name: '', value: '', system: false, secured: false }
  editDialog.value = true
}
function openEdit(item) {
  editTarget.value = item
  editForm.value = { name: item.name, value: item.secured ? '' : (item.value ?? ''), system: false, secured: !!item.secured }
  editDialog.value = true
}
async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (nameTaken.value) return
  saving.value = true
  try {
    await api.post('rest/system/configuration', {
      name: editForm.value.name,
      oldName: editTarget.value?.name || '',
      system: !!editForm.value.system,
      secured: !!editForm.value.secured,
      value: editForm.value.value,
    })
    editDialog.value = false
    load()
  } finally { saving.value = false }
}

/* --- delete --- */
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)
function startDelete(item) { deleteTarget.value = item; deleteDialog.value = true }
async function confirmDelete() {
  deleting.value = true
  try {
    await api.del(`rest/system/configuration/${encodeURIComponent(deleteTarget.value.name)}/true`)
    deleteDialog.value = false
    load()
  } finally { deleting.value = false }
}

onMounted(() => {
  app.setBreadcrumbs([{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.config.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, primary/encrypt
   buttons, dialog, row icon buttons) comes from the shared host components +
   the global `.lj-surface` / `.lj-iconbtn` classes, which supply the ink,
   pill, radius, mono, surface, card and border vars these rules read. The
   `.crypto` encryption tool and `.chk` custom checkboxes are bespoke. */
.sub b { color: var(--ink-2); font-family: var(--mono); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 16px; }
.stat { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: linear-gradient(135deg, color-mix(in srgb, var(--c) 9%, var(--card)), var(--card)); box-shadow: var(--shadow); cursor: pointer; opacity: 0; transform: translateY(10px); animation: rise .5s cubic-bezier(.2, .7, .3, 1) forwards; transition: transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s, border-color .18s; }
@keyframes rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .stat { animation: none; opacity: 1; transform: none; } }
.stat:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -20px color-mix(in srgb, var(--c) 55%, transparent); border-color: color-mix(in srgb, var(--c) 30%, var(--border)); }
.stat.active { border-color: color-mix(in srgb, var(--c) 55%, var(--border)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 45%, transparent); }
.stop { display: flex; align-items: center; gap: 14px; }
.sicon { width: 46px; height: 46px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 70%, #000)); box-shadow: 0 8px 18px -8px color-mix(in srgb, var(--c) 65%, transparent); }
.snum { font-family: var(--mono); font-weight: 700; font-size: 26px; line-height: 1; color: var(--ink); }
.slabel { font-size: 12.5px; font-weight: 600; color: var(--ink-3); margin-top: 4px; }
.sbar { height: 6px; border-radius: 4px; background: var(--pill); overflow: hidden; }
.sbar i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, white)); transition: width .5s cubic-bezier(.2, .7, .3, 1); }

/* Encryption tool. */
.crypto { border: var(--border-w) var(--lj-border-style, solid) var(--border-c); border-radius: var(--radius); background: var(--card); margin-bottom: 18px; overflow: hidden; transition: border-color .15s; }
.crypto.open { border-color: var(--border-2); }
.crypto-head { width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 0; background: transparent; cursor: pointer; text-align: left; }
.ck-ic { width: 42px; height: 42px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 8px 18px -8px rgba(139, 92, 246, .6); }
.ck-txt { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.ck-title { font-family: var(--font); font-weight: var(--bold); font-size: 14px; color: var(--ink); }
.ck-hint { font-size: 12.5px; color: var(--ink-3); font-weight: 500; }
.ck-caret { color: var(--ink-3); }
.crypto-body { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 0 18px 18px; }
.cfield { display: flex; align-items: center; gap: 8px; padding: 0 12px; height: 44px; border-radius: var(--radius-sm); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: var(--surface); flex: 1; min-width: 220px; transition: border-color .15s; }
.cfield:focus-within { border-color: var(--border-2); }
.cfield.result { background: var(--pill); }
.cf-ic { color: var(--ink-3); }
.cfield input { flex: 1; border: 0; outline: 0; background: transparent; color: var(--ink); font-family: var(--mono); font-size: 13px; min-width: 0; }
.cfield input::placeholder { font-family: var(--font); color: var(--ink-3); }
.cf-copy { border: 0; background: transparent; cursor: pointer; color: var(--ink-3); display: grid; place-items: center; padding: 4px; border-radius: 7px; }
.cf-copy:hover { color: var(--accent); background: var(--hover); }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

/* Table cells. */
.avatar-cell { display: flex; align-items: center; gap: 12px; }
.kglyph { width: 34px; height: 34px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: var(--pill); color: var(--ink-3); }
.kglyph.secured { background: rgba(139, 92, 246, .14); color: #8b5cf6; }
.kname { font-family: var(--mono); font-size: 12.5px; font-weight: 600; color: var(--ink); word-break: break-all; }
.masked { font-family: var(--mono); color: var(--ink-3); letter-spacing: .1em; }
.cval { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); background: var(--pill); padding: 2px 8px; border-radius: var(--radius-sm); display: inline-block; max-width: 460px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.srcpill { display: inline-flex; align-items: center; gap: 5px; max-width: 240px; font-family: var(--font); font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 999px; color: var(--ink-2); background: var(--pill); }
.srcpill :deep(.v-icon) { flex: none; }
.src-txt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ovr { color: #d9701a; margin-left: 5px; vertical-align: middle; }
/* Danger accent for the inline delete trigger (base `.lj-iconbtn` is global). */
.lj-iconbtn.danger:hover { background: rgba(var(--v-theme-error), .1); color: rgb(var(--v-theme-error)); }

/* Custom checkboxes inside the edit dialog (slotted content keeps this
   component's scope id; --accent/--border-2 come from the LjDialog card's
   `.lj-surface`). */
.chk { display: flex; align-items: center; gap: 10px; padding: 7px 0; cursor: pointer; font-family: var(--font); font-size: 13.5px; font-weight: 600; color: var(--ink-2); }
.chk input { position: absolute; opacity: 0; width: 0; height: 0; }
.chk-box { width: 19px; height: 19px; border-radius: 6px; border: 2px solid var(--border-2); flex: none; display: grid; place-items: center; transition: background .12s, border-color .12s; }
.chk input:checked + .chk-box { background: var(--accent); border-color: var(--accent); }
.chk input:checked + .chk-box::after { content: ""; width: 9px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg) translateY(-1px); }
.chk input:focus-visible + .chk-box { box-shadow: 0 0 0 3px rgba(var(--v-theme-secondary), .3); }
</style>
