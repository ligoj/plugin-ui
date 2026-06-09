<!--
  SystemUsersView — 2026 "Vibrant" system-account manager
  (Administration → System users). Ports plugin-ui's SystemUserView logic
  (useDataTable on 'system/user/roles' for server-side fetch / sort / paging /
  search + POST/PUT save + DELETE, roles loaded from rest/system/security/role)
  onto the Vibrant chrome: breadcrumb-chip header with a search box, KPI stat
  cards, VibrantDataTable with a login avatar cell and role chips, a Vibrant
  edit modal (login + roles autocomplete) and a confirm dialog.
-->
<template>
  <div class="susers lj-surface">
    <LjPageHeader :title="t('system.user.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.user.title'), current: true }]">
      <template #subtitle>
        <b>{{ dt.totalItems.value }}</b> {{ t('system.user.countLabel') }}
      </template>
      <template #actions>
        <LjSearch v-model="dt.search.value" :placeholder="t('system.user.searchPlaceholder')" @input="onSearch" />
        <LjButton icon="mdi-plus" @click="openNew">{{ t('system.user.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <div class="stats">
      <div v-for="(s, i) in stats" :key="s.key" class="stat" :style="{ '--c': s.color, 'animation-delay': (i * 50) + 'ms' }">
        <div class="stop">
          <span class="sicon"><v-icon size="22">{{ s.icon }}</v-icon></span>
          <div class="sbody"><div class="snum">{{ s.value }}</div><div class="slabel">{{ s.label }}</div></div>
        </div>
        <div class="sbar"><i :style="{ width: s.pct + '%' }" /></div>
      </div>
    </div>

    <p v-if="dt.error.value" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ dt.error.value }}</p>

    <VibrantDataTable :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value" item-value="login"
      default-sort="login" :empty-text="t('common.noData')" :fetch-all="dt.loadAll" filename="system-users.csv" @update:options="loadData" @row-click="openEdit">
      <template #cell.login="{ item }">
        <code class="ulogin">{{ item.login }}</code>
      </template>
      <!-- IAM cache attributes (same PK as the system user); dash when the
           login has no IAM entry. -->
      <template #cell.name="{ item }">
        <span v-if="fullName(item)" class="uname">{{ fullName(item) }}</span>
        <span v-else class="dash">—</span>
      </template>
      <template #cell.mails="{ item }">
        <a v-if="(item.mails || []).length" class="umail" :href="`mailto:${item.mails[0]}`" @click.stop>{{ item.mails.join(' ') }}</a>
        <span v-else class="dash">—</span>
      </template>
      <template #cell.roles="{ item }">
        <span class="chips">
          <span v-for="r in (item.roles || [])" :key="r.id" class="rchip"><v-icon size="12">mdi-shield-account-outline</v-icon>{{ r.name }}</span>
          <span v-if="!(item.roles || []).length" class="dash">{{ t('system.user.noRoles') }}</span>
        </span>
      </template>
      <template #actions="{ item }">
        <RowActionsCog>
          <button @click="openEdit(item)"><v-icon size="18">mdi-pencil-outline</v-icon>{{ t('common.edit') }}</button>
          <div class="sep" />
          <button class="danger" @click="startDelete(item)"><v-icon size="18">mdi-delete-outline</v-icon>{{ t('common.delete') }}</button>
        </RowActionsCog>
      </template>
    </VibrantDataTable>

    <!-- Create / edit dialog (shared chrome). -->
    <LjDialog v-model="editDialog" :title="editTarget ? t('system.user.editTitle') : t('system.user.newTitle')" icon="mdi-account" :max-width="540">
      <v-form ref="formRef" @submit.prevent="save">
        <LjAvailabilityField v-model="editForm.login" v-model:taken="loginTaken" endpoint="system/user/roles" field="login" :enabled="!editTarget"
          prepend-inner-icon="mdi-account" :label="t('system.user.fieldLogin')" :disabled="!!editTarget" class="mb-3" autofocus />
        <!-- IAM details sharing the same login (when available): read-only,
             they are owned by the identity provider, not by this dialog —
             framed in a fieldset whose legend carries the source notice. -->
        <fieldset v-if="editDetails" class="iam-frame">
          <legend class="iam-legend"><v-icon size="13">mdi-information-outline</v-icon>{{ t('system.user.iamDetails') }}</legend>
          <div v-if="editDetails.firstName || editDetails.lastName" class="d-flex ga-3" :class="{ 'mb-3': (editDetails.mails || []).length }">
            <v-text-field :model-value="editDetails.firstName || '—'" prepend-inner-icon="mdi-badge-account-horizontal-outline" :label="t('system.user.fieldFirstName')" readonly hide-details variant="outlined" density="comfortable" class="ro-field" />
            <v-text-field :model-value="editDetails.lastName || '—'" :label="t('system.user.fieldLastName')" readonly hide-details variant="outlined" density="comfortable" class="ro-field" />
          </div>
          <v-text-field v-if="(editDetails.mails || []).length" :model-value="editDetails.mails.join(' ')" prepend-inner-icon="mdi-email-outline" :label="t('system.user.fieldMail')" readonly hide-details variant="outlined" density="comfortable" class="ro-field" />
        </fieldset>
        <v-autocomplete v-model="editForm.roles" :label="t('system.user.fieldRoles')" prepend-inner-icon="mdi-shield-account-outline" :items="allRoles" item-value="id" item-title="name"
          multiple chips closable-chips variant="outlined" :rules="[rules.requiredArray]" :hint="t('system.user.rolesHint')" persistent-hint />
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="editDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :loading="saving" @click="save">{{ t('common.save') }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.user.deleteTitle')" icon="mdi-account" confirm-color="error" :confirm-label="t('common.delete')" :loading="deleting" @confirm="confirmDelete">
      {{ t('system.user.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget?.login }}</strong>{{ t('system.user.deleteConfirmAfter') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore, useDataTable, useI18nStore } from '@ligoj/host'
import { VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog, LjPageHeader, LjButton, LjSearch, LjDialog, LjAvailabilityField } from '@ligoj/host'
import RowActionsCog from '../components/RowActionsCog.vue'

const api = useApi()
const app = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

// The lookup (bootstrap UserResource) searches the login and — through the
// ISystemUserDetailsProvider extension point (plugin-core IAM provider) — the
// first name, last name and mails sharing the same login, returned decorated.
const dt = useDataTable('system/user/roles', { defaultSort: 'login' })
let searchTimeout = null
let lastOptions = {}

const allRoles = ref([])

const rules = {
  required: (v) => !!v || (t('common.required') || 'Required'),
  requiredArray: (v) => (Array.isArray(v) && v.length > 0) || t('system.user.rolesHint'),
}

function fullName(r) { return [r.firstName, r.lastName].filter(Boolean).join(' ') }

const headers = computed(() => [
  { key: 'login', label: t('system.user.headerLogin'), sortable: true, icon: 'mdi-account' },
  // IAM cache attributes: present only when the login matches an IAM entry;
  // not sortable (no JPA association server-side).
  { key: 'name', label: t('system.user.headerName'), sortable: false, icon: 'mdi-badge-account-horizontal-outline', exportValue: (r) => fullName(r) },
  { key: 'mails', label: t('system.user.headerMail'), sortable: false, icon: 'mdi-email-outline', exportValue: (r) => (r.mails || []).join(' ') },
  { key: 'roles', label: t('system.user.headerRoles'), sortable: false, icon: 'mdi-shield-account-outline', exportValue: (r) => (r.roles || []).map((x) => x.name).join(' ') },
])

const stats = computed(() => [
  { key: 'total', label: t('system.user.statTotal'), icon: 'mdi-account-key-outline', color: 'rgb(var(--v-theme-secondary))', value: dt.totalItems.value, pct: 100 },
  { key: 'roles', label: t('system.user.statRoles'), icon: 'mdi-shield-account-outline', color: '#8b5cf6', value: allRoles.value.length, pct: 100 },
])

function loadData(options) { lastOptions = options; dt.load(options) }
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => dt.load({ page: 1, itemsPerPage: lastOptions.itemsPerPage || 25, sortBy: lastOptions.sortBy }), 300)
}

async function loadRoles() {
  try {
    const data = await api.get('rest/system/security/role')
    if (Array.isArray(data)) allRoles.value = data
    else if (Array.isArray(data?.data)) allRoles.value = data.data
  } catch { /* free-text fallback */ }
}

/* create / edit */
const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref({ login: '', roles: [] })
const loginTaken = ref(false)
const saving = ref(false)
// IAM details of the edited user (read-only in the dialog), or null when
// creating or when the login has no IAM entry.
const editDetails = computed(() => {
  const it = editTarget.value
  return it && (it.firstName || it.lastName || (it.mails || []).length) ? it : null
})
function openNew() {
  editTarget.value = null
  editForm.value = { login: '', roles: [] }
  editDialog.value = true
}
function openEdit(item) {
  editTarget.value = item
  editForm.value = { login: item.login, roles: (item.roles || []).map((r) => r.id) }
  editDialog.value = true
}
async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (loginTaken.value) return
  saving.value = true
  try {
    await api[editTarget.value ? 'put' : 'post']('rest/system/user', { login: editForm.value.login, roles: editForm.value.roles })
    editDialog.value = false
    dt.load(lastOptions)
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
    await api.del(`rest/system/user/${encodeURIComponent(deleteTarget.value.login)}`)
    deleteDialog.value = false
    dt.load(lastOptions)
  } finally { deleting.value = false }
}

onMounted(() => {
  app.setBreadcrumbs([{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.user.title') }], { refresh: () => { loadRoles(); dt.load(lastOptions) } })
  loadRoles()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, button, dialog, row
   icon buttons) comes from the shared host components + the global
   `.lj-surface` / `.lj-iconbtn` classes, which supply the ink, pill, radius,
   mono and card vars these rules read. */
.sub b { color: var(--ink-2); font-family: var(--mono); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 18px; }
.stat { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border-radius: var(--radius); border: var(--border-w) var(--lj-border-style, solid) var(--border-c); background: linear-gradient(135deg, color-mix(in srgb, var(--c) 9%, var(--card)), var(--card)); box-shadow: var(--shadow); opacity: 0; transform: translateY(10px); animation: rise .5s cubic-bezier(.2, .7, .3, 1) forwards; transition: transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s, border-color .18s; }
@keyframes rise { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .stat { animation: none; opacity: 1; transform: none; } }
.stat:hover { transform: translateY(-3px); box-shadow: 0 18px 36px -20px color-mix(in srgb, var(--c) 55%, transparent); border-color: color-mix(in srgb, var(--c) 30%, var(--border)); }
.stop { display: flex; align-items: center; gap: 14px; }
.sicon { width: 46px; height: 46px; border-radius: var(--radius-sm); flex: none; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 70%, #000)); box-shadow: 0 8px 18px -8px color-mix(in srgb, var(--c) 65%, transparent); }
.snum { font-family: var(--mono); font-weight: 700; font-size: 26px; line-height: 1; color: var(--ink); }
.slabel { font-size: 12.5px; font-weight: 600; color: var(--ink-3); margin-top: 4px; }
.sbar { height: 6px; border-radius: 4px; background: var(--pill); overflow: hidden; }
.sbar i { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, white)); transition: width .5s cubic-bezier(.2, .7, .3, 1); }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

.ulogin { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--ink); }
.uname { font-family: var(--font); font-weight: 600; font-size: 13.5px; color: var(--ink); }
.umail { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); text-decoration: none; }
.umail:hover { color: var(--accent); text-decoration: underline; }

/* Read-only IAM details in the edit dialog: framed in a fieldset so they
   read as one informational group, with the identity-provider source notice
   as the frame legend. */
.iam-frame { border: var(--border-w, 1px) var(--lj-border-style, solid) var(--border-2); border-radius: var(--radius-sm); padding: 12px 14px 14px; margin: 0 0 16px; background: var(--hover); }
.iam-legend { display: inline-flex; align-items: center; gap: 5px; padding: 0 7px; margin-left: 6px; font-size: 11.5px; font-weight: 600; color: var(--ink-3); }
.ro-field :deep(input) { color: var(--ink-2); cursor: default; }
.chips { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.rchip { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font); font-weight: 700; font-size: 11.5px; padding: 3px 10px; border-radius: 999px; color: #8b5cf6; background: rgba(139, 92, 246, .13); }
.dash { color: var(--ink-3); font-size: 13px; }
</style>
