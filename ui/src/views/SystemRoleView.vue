<!--
  SystemRolesView — 2026 "Vibrant" role manager (Administration → Roles).
  Ports plugin-ui's SystemRoleView logic (rest/system/security/role/withAuth
  list + POST/PUT save + DELETE) onto the Vibrant chrome: breadcrumb-chip
  header with a search box, KPI stat cards doubling as filters (All / With API
  / With UI / Unrestricted), VibrantDataTable with a shield glyph and
  pattern-token chips, a Vibrant edit modal (name + two chip comboboxes for the
  API / UI patterns) and a confirm dialog. Client-side search / sort / paging.
-->
<template>
  <div class="roles lj-surface">
    <LjPageHeader :title="t('system.role.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.role.title'), current: true }]">
      <template #subtitle>
        <b>{{ items.length }}</b> {{ t('system.role.countLabel') }}<span v-if="filtered.length !== items.length"> · {{ filtered.length }} {{ t('system.role.filtered') }}</span>
      </template>
      <template #actions>
        <LjSearch v-model="query" :placeholder="t('system.role.searchPlaceholder')" @input="page = 1" />
        <LjButton icon="mdi-plus" @click="openNew">{{ t('system.role.new') }}</LjButton>
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

    <p v-if="error" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ error }}</p>

    <VibrantDataTable :headers="headers" :items="paged" :items-length="filtered.length" :loading="loading" item-value="id" default-sort="name"
      :empty-text="t('common.noData')" @update:options="onOptions" @row-click="openEdit">
      <template #cell.name="{ item }">
        <div class="avatar-cell">
          <span class="rglyph" :class="{ admin: isUnrestricted(item) }"><v-icon size="18">mdi-shield-account-outline</v-icon></span>
          <div class="ac-name">{{ item.name }}</div>
        </div>
      </template>
      <template #cell.authApi="{ item }">
        <span class="tokens">
          <code v-for="a in (item['authorizations-api'] || [])" :key="a.id || a.pattern" class="tok api">{{ a.pattern }}</code>
          <span v-if="!(item['authorizations-api'] || []).length" class="dash">—</span>
        </span>
      </template>
      <template #cell.authUi="{ item }">
        <span class="tokens">
          <code v-for="a in (item['authorizations-ui'] || [])" :key="a.id || a.pattern" class="tok ui">{{ a.pattern }}</code>
          <span v-if="!(item['authorizations-ui'] || []).length" class="dash">—</span>
        </span>
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
    <LjDialog v-model="editDialog" :title="editTarget ? t('system.role.editTitle') : t('system.role.newTitle')" icon="mdi-shield-account-outline" :max-width="640">
      <v-form ref="formRef" @submit.prevent="save">
        <v-text-field v-model="editForm.name" prepend-inner-icon="mdi-shield-outline" :label="t('system.role.fieldName')" :rules="[rules.required]" variant="outlined" class="mb-4" autofocus />
        <v-combobox v-model="editForm.apiPatterns" :label="t('system.role.fieldApiPatterns')" prepend-inner-icon="mdi-api" :items="[]" chips closable-chips multiple variant="outlined" :hint="t('system.role.patternsHint')" persistent-hint class="mb-4" />
        <v-combobox v-model="editForm.uiPatterns" :label="t('system.role.fieldUiPatterns')" prepend-inner-icon="mdi-monitor" :items="[]" chips closable-chips multiple variant="outlined" :hint="t('system.role.patternsHint')" persistent-hint class="mb-2" />
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="editDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :loading="saving" @click="save">{{ t('common.save') }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.role.deleteTitle')" icon="mdi-shield-account-outline" confirm-color="error" :confirm-label="t('common.delete')" :loading="deleting" @confirm="confirmDelete">
      {{ t('system.role.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget?.name }}</strong>{{ t('system.role.deleteConfirmAfter') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useI18nStore } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjSearch, LjDialog } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

const items = ref([])
const loading = ref(false)
const error = ref(null)

const rules = { required: (v) => !!v || (t('common.required') || 'Required') }

/* search / filter / sort / paging (client-side) */
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

function apiCount(r) { return (r['authorizations-api'] || []).length }
function uiCount(r) { return (r['authorizations-ui'] || []).length }
// A role granting an unrestricted/broad pattern (".*" or "^.*$") is effectively
// an administrator role — surface it as its own KPI / glyph accent.
function isUnrestricted(r) {
  return (r.authorizations || []).some((a) => /^\^?\.\*\$?$/.test(String(a.pattern || '').trim()))
}

function matchFilter(r) {
  if (filter.value === 'api') return apiCount(r) > 0
  if (filter.value === 'ui') return uiCount(r) > 0
  if (filter.value === 'admin') return isUnrestricted(r)
  return true
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((r) => {
    if (!matchFilter(r)) return false
    if (!q) return true
    if (String(r.name || '').toLowerCase().includes(q)) return true
    return (r.authorizations || []).some((a) => String(a.pattern || '').toLowerCase().includes(q))
  })
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  arr.sort((a, b) => {
    const va = String(a[sortKey.value] ?? '').toLowerCase()
    const vb = String(b[sortKey.value] ?? '').toLowerCase()
    return sortOrder.value === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
  })
  return arr
})

const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return sorted.value.slice(start, start + perPage.value)
})

const headers = computed(() => [
  { key: 'name', label: t('system.role.headerName'), sortable: true, icon: 'mdi-shield-outline' },
  { key: 'authApi', label: t('system.role.headerApi'), sortable: false, icon: 'mdi-api' },
  { key: 'authUi', label: t('system.role.headerUi'), sortable: false, icon: 'mdi-monitor' },
])

const stats = computed(() => {
  const total = items.value.length || 1
  const withApi = items.value.filter((r) => apiCount(r) > 0).length
  const withUi = items.value.filter((r) => uiCount(r) > 0).length
  const admin = items.value.filter(isUnrestricted).length
  const mk = (key, fkey, label, icon, color, value) => ({ key, fkey, label, icon, color, value, pct: fkey === 'all' ? 100 : Math.round(value / total * 100) })
  return [
    mk('total', 'all', t('system.role.statTotal'), 'mdi-shield-account-outline', 'rgb(var(--v-theme-secondary))', items.value.length),
    mk('api', 'api', t('system.role.statApi'), 'mdi-api', '#2f6df6', withApi),
    mk('ui', 'ui', t('system.role.statUi'), 'mdi-monitor', '#1d9d63', withUi),
    mk('admin', 'admin', t('system.role.statAdmin'), 'mdi-shield-crown-outline', '#d9701a', admin),
  ]
})

async function load() {
  loading.value = true; error.value = null
  try {
    const data = await api.get('rest/system/security/role/withAuth')
    const rows = data?.data || data || []
    for (const r of rows) {
      r['authorizations-api'] = (r.authorizations || []).filter((a) => a.type === 'api')
      r['authorizations-ui'] = (r.authorizations || []).filter((a) => a.type === 'ui')
    }
    items.value = rows
  } catch { error.value = t('common.loadError') || 'Load error' }
  loading.value = false
}

/* create / edit */
const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ name: '', apiPatterns: [], uiPatterns: [] })
const saving = ref(false)
function openNew() {
  editTarget.value = null
  editForm.value = { name: '', apiPatterns: [], uiPatterns: [] }
  editDialog.value = true
}
function openEdit(item) {
  editTarget.value = item
  editForm.value = {
    name: item.name,
    apiPatterns: (item['authorizations-api'] || []).map((a) => a.pattern),
    uiPatterns: (item['authorizations-ui'] || []).map((a) => a.pattern),
  }
  editDialog.value = true
}
async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    const payload = {
      id: editTarget.value?.id,
      name: editForm.value.name,
      authorizations: [
        ...editForm.value.apiPatterns.map((p) => ({ pattern: p, type: 'api' })),
        ...editForm.value.uiPatterns.map((p) => ({ pattern: p, type: 'ui' })),
      ],
    }
    await api[editTarget.value ? 'put' : 'post']('rest/system/security/role', payload)
    editDialog.value = false
    load()
  } finally { saving.value = false }
}

/* delete */
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)
function startDelete(item) { deleteTarget.value = item; deleteDialog.value = true }
async function confirmDelete() {
  deleting.value = true
  try {
    await api.del(`rest/system/security/role/${deleteTarget.value.id}`)
    deleteDialog.value = false
    load()
  } finally { deleting.value = false }
}

onMounted(() => {
  app.setBreadcrumbs([{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.role.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, button, dialog, row
   icon buttons) comes from the shared host components + the global
   `.lj-surface` / `.lj-iconbtn` classes, which supply the ink, pill, radius,
   mono and card vars these rules read. */
.sub b { color: var(--ink-2); font-family: var(--mono); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 18px; }
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

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

.avatar-cell { display: flex; align-items: center; gap: 12px; }
.rglyph { width: 34px; height: 34px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; background: var(--pill); color: var(--ink-3); }
.rglyph.admin { background: rgba(217, 112, 26, .14); color: #d9701a; }
.ac-name { font-family: var(--font); font-weight: 700; font-size: 14px; color: var(--ink); }
.tokens { display: inline-flex; flex-wrap: wrap; gap: 5px; max-width: 420px; }
.tok { font-family: var(--mono); font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-sm); color: var(--ink-2); background: var(--pill); }
.tok.api { color: #2f6df6; background: rgba(47, 109, 246, .12); }
.tok.ui { color: #1d9d63; background: rgba(29, 157, 99, .13); }
.dash { color: var(--ink-3); }
/* Danger accent for the inline delete trigger (base `.lj-iconbtn` is global). */
.lj-iconbtn.danger:hover { background: rgba(var(--v-theme-error), .1); color: rgb(var(--v-theme-error)); }
</style>
