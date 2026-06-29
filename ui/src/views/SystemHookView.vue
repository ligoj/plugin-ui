<!--
  SystemHookView — 2026 "Vibrant" hook manager
  (Administration → Hooks). Ports the bootstrap HookResource CRUD
  (rest/system/hook — server-paginated DataTables list, POST create, PUT
  update, DELETE) onto the Vibrant chrome: breadcrumb-chip header with a
  search box and a row count subtitle (no KPI cards), VibrantDataTable with
  name / method chip / path / command preview / delay badge cells, a Vibrant
  create/edit modal and a confirm dialog.

  The entity's `match` column is a JSON string `{path, method}` — the dialog
  edits `path` + `method` as two fields and (de)serializes them around save /
  load. `method` omitted (or null) means "all methods", matching the backend
  filter (HookConfiguration#filterUnSafe: method == null || equalsIgnoreCase).
-->
<template>
  <div class="hooks lj-surface">
    <LjPageHeader :title="t('system.hook.title')" :crumbs="[{ icon: 'mdi-cog-outline', label: t('system.breadcrumb') }, { label: t('system.hook.title'), current: true }]">
      <template #subtitle>
        <b>{{ dt.totalItems.value }}</b> {{ t('system.hook.countLabel') }}
      </template>
      <template #actions>
        <LjSearch v-model="dt.search.value" :placeholder="t('system.hook.searchPlaceholder')" @input="onSearch" />
        <LjButton icon="mdi-plus" @click="openNew">{{ t('system.hook.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <p v-if="dt.error.value" class="errline"><v-icon size="16">mdi-alert-outline</v-icon>{{ dt.error.value }}</p>

    <VibrantDataTable :headers="headers" :items="dt.items.value" :items-length="dt.totalItems.value" :loading="dt.loading.value" item-value="id"
      default-sort="name" :empty-text="t('common.noData')" :fetch-all="dt.loadAll" filename="system-hooks.csv" @update:options="loadData" @row-click="openEdit">
      <template #cell.name="{ item }">
        <code class="hname">{{ item.name }}</code>
      </template>
      <template #cell.method="{ item }">
        <span class="mchip" :class="`m-${(hookMethod(item) || 'all').toLowerCase()}`">{{ hookMethod(item) || t('system.hook.methodAll') }}</span>
      </template>
      <template #cell.path="{ item }">
        <code class="hpath">{{ hookPath(item) || '—' }}</code>
      </template>
      <template #cell.command="{ item }">
        <code class="hcmd" :title="item.command">{{ item.command }}</code>
      </template>
      <template #cell.delay="{ item }">
        <span v-if="item.delay === 0" class="dbadge sync"><v-icon size="13">mdi-flash</v-icon>{{ t('system.hook.sync') }}</span>
        <span v-else class="dbadge async"><v-icon size="13">mdi-timer-sand</v-icon>{{ t('system.hook.async') }}</span>
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
    <LjDialog v-model="editDialog" :title="editTarget ? t('system.hook.editTitle') : t('system.hook.newTitle')" icon="mdi-webhook" :max-width="600">
      <v-form ref="formRef" @submit.prevent="save">
        <LjAvailabilityField v-model="editForm.name" v-model:taken="nameTaken" endpoint="system/hook" field="name" :enabled="!editTarget"
          prepend-inner-icon="mdi-tag-outline" :label="t('system.hook.fieldName')" :disabled="!!editTarget" class="mb-3" autofocus />
        <div class="d-flex ga-3 mb-1 align-start">
          <v-select v-model="editForm.method" :items="methodOptions" :label="t('system.hook.fieldMethod')" prepend-inner-icon="mdi-swap-horizontal"
            variant="outlined" class="m-field" />
          <v-text-field v-model="editForm.path" :label="t('system.hook.fieldPath')" prepend-inner-icon="mdi-regex" :rules="[rules.required]"
            :hint="t('system.hook.pathHint')" variant="outlined" class="flex-grow-1" />
        </div>
        <v-text-field v-model="editForm.command" :label="t('system.hook.fieldCommand')" prepend-inner-icon="mdi-console-line" :rules="[rules.required]"
          :counter="255" maxlength="255" variant="outlined" class="mb-1" />
        <v-text-field v-model="editForm.workingDirectory" :label="t('system.hook.fieldWorkingDirectory')" prepend-inner-icon="mdi-folder-outline"
          :rules="[rules.required, rules.noSpace]" :hint="t('system.hook.workingDirectoryHint')" :counter="255" maxlength="255" variant="outlined" class="mb-1" />
        <v-combobox v-model="editForm.inject" :label="t('system.hook.fieldInject')" prepend-inner-icon="mdi-variable" multiple chips closable-chips
          :hint="t('system.hook.injectHint')" persistent-hint variant="outlined" class="mb-3" />
        <div class="d-flex ga-3">
          <v-text-field v-model.number="editForm.timeout" type="number" min="1" :label="t('system.hook.fieldTimeout')" prepend-inner-icon="mdi-timer-outline"
            :hint="t('system.hook.timeoutHint')" persistent-hint variant="outlined" class="flex-grow-1" />
          <v-text-field v-model.number="editForm.delay" type="number" min="0" :label="t('system.hook.fieldDelay')" prepend-inner-icon="mdi-timer-sand"
            :hint="t('system.hook.delayHint')" persistent-hint variant="outlined" class="flex-grow-1" />
        </div>
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="editDialog = false">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :loading="saving" @click="save">{{ t('common.save') }}</LjButton>
      </template>
    </LjDialog>

    <LigojConfirmDialog v-model="deleteDialog" :title="t('system.hook.deleteTitle')" icon="mdi-webhook" confirm-color="error" :confirm-label="t('common.delete')" :loading="deleting" @confirm="confirmDelete">
      {{ t('system.hook.deleteConfirmBefore') }}<strong class="text-error">{{ deleteTarget?.name }}</strong>{{ t('system.hook.deleteConfirmAfter') }}
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

// Server-side fetch / sort / paging / search. The backend only sorts on
// `id` and `name` (HookResource.ORDERED_COLUMNS), hence name is the only
// sortable column below.
const dt = useDataTable('system/hook', { defaultSort: 'name' })
let searchTimeout = null
let lastOptions = {}

const rules = {
  required: (v) => (v != null && v !== '') || (t('common.required') || 'Required'),
  // workingDirectory is `@Pattern(\\S*)` server-side — reject any whitespace.
  noSpace: (v) => !/\s/.test(v || '') || t('system.hook.noSpace'),
}

// `match` is a JSON string `{path, method}`; parse defensively (an invalid
// row must not break the whole table render).
function parseMatch(item) {
  try { return JSON.parse(item.match || '{}') || {} } catch { return {} }
}
function hookPath(item) { return parseMatch(item).path }
function hookMethod(item) { return parseMatch(item).method }

const methodOptions = computed(() => [
  { title: t('system.hook.methodAll'), value: null },
  { title: 'GET', value: 'GET' },
  { title: 'POST', value: 'POST' },
  { title: 'PUT', value: 'PUT' },
  { title: 'DELETE', value: 'DELETE' },
  { title: 'PATCH', value: 'PATCH' },
])

const headers = computed(() => [
  { key: 'name', label: t('system.hook.headerName'), sortable: true, icon: 'mdi-tag-outline' },
  { key: 'method', label: t('system.hook.headerMethod'), sortable: false, align: 'center', icon: 'mdi-swap-horizontal', exportValue: (r) => hookMethod(r) || t('system.hook.methodAll') },
  { key: 'path', label: t('system.hook.headerPath'), sortable: false, icon: 'mdi-regex', exportValue: (r) => hookPath(r) || '' },
  { key: 'command', label: t('system.hook.headerCommand'), sortable: false, icon: 'mdi-console-line', exportValue: (r) => r.command || '' },
  { key: 'delay', label: t('system.hook.headerDelay'), sortable: false, align: 'center', icon: 'mdi-timer-sand', exportValue: (r) => (r.delay === 0 ? t('system.hook.sync') : t('system.hook.async')) },
])

function loadData(options) { lastOptions = options; dt.load(options) }
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => dt.load({ page: 1, itemsPerPage: lastOptions.itemsPerPage || 25, sortBy: lastOptions.sortBy }), 300)
}

/* create / edit */
const formRef = ref(null)
const editDialog = ref(false)
const editTarget = ref(null)
const editForm = ref(emptyForm())
const nameTaken = ref(false)
const saving = ref(false)

function emptyForm() {
  return { name: '', method: null, path: '', command: '', workingDirectory: '', inject: [], timeout: null, delay: null }
}
function openNew() {
  editTarget.value = null
  editForm.value = emptyForm()
  editDialog.value = true
}
function openEdit(item) {
  editTarget.value = item
  const m = parseMatch(item)
  editForm.value = {
    name: item.name,
    method: m.method ?? null,
    path: m.path ?? '',
    command: item.command ?? '',
    workingDirectory: item.workingDirectory ?? '',
    inject: Array.isArray(item.inject) ? [...item.inject] : [],
    timeout: item.timeout ?? null,
    delay: item.delay ?? null,
  }
  editDialog.value = true
}
async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (nameTaken.value) return
  saving.value = true
  try {
    // Re-serialize path + method into the `match` JSON. Omit `method` for
    // "all" so the stored payload matches the backend's null-means-all
    // semantics (and stays minimal).
    const match = editForm.value.method
      ? { path: editForm.value.path, method: editForm.value.method }
      : { path: editForm.value.path }
    const payload = {
      ...(editTarget.value ? { id: editTarget.value.id } : {}),
      name: editForm.value.name,
      command: editForm.value.command,
      workingDirectory: editForm.value.workingDirectory,
      match: JSON.stringify(match),
      inject: editForm.value.inject || [],
      timeout: editForm.value.timeout || null,
      delay: editForm.value.delay ?? null,
    }
    await api[editTarget.value ? 'put' : 'post']('rest/system/hook', payload)
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
    await api.del(`rest/system/hook/${deleteTarget.value.id}`)
    deleteDialog.value = false
    dt.load(lastOptions)
  } finally { deleting.value = false }
}

onMounted(() => {
  app.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('system.hook.title') }], { refresh: () => dt.load(lastOptions) })
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, button, dialog, row
   icon buttons) comes from the shared host components + the global
   `.lj-surface` / `.lj-iconbtn` classes, which supply the ink, pill, radius,
   mono and card vars these rules read. */
.sub b { color: var(--ink-2); font-family: var(--mono); }

.errline { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: rgb(var(--v-theme-error)); margin: 0 0 14px; }

/* Table cells. */
.hname { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--ink); word-break: break-all; }
.hpath { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); background: var(--pill); padding: 2px 8px; border-radius: var(--radius-sm); display: inline-block; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.hcmd { font-family: var(--mono); font-size: 12.5px; color: var(--ink-2); display: inline-block; max-width: 360px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }

/* HTTP method chip — neutral by default, tinted per verb. */
.mchip { display: inline-flex; align-items: center; font-family: var(--mono); font-weight: 700; font-size: 11px; letter-spacing: .03em; padding: 3px 9px; border-radius: 999px; color: var(--ink-2); background: var(--pill); }
.mchip.m-all { color: var(--ink-3); }
.mchip.m-get { color: #1d9d63; background: rgba(29, 157, 99, .13); }
.mchip.m-post { color: #2563eb; background: rgba(37, 99, 235, .13); }
.mchip.m-put { color: #d9701a; background: rgba(217, 112, 26, .13); }
.mchip.m-delete { color: rgb(var(--v-theme-error)); background: rgba(220, 38, 38, .12); }
.mchip.m-patch { color: #8b5cf6; background: rgba(139, 92, 246, .13); }

/* Sync / async delay badge. */
.dbadge { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font); font-weight: 700; font-size: 11px; padding: 3px 9px; border-radius: 999px; }
.dbadge.sync { color: #d9701a; background: rgba(217, 112, 26, .13); }
.dbadge.async { color: var(--ink-3); background: var(--pill); }

/* Method select sizing in the dialog row. */
.m-field { max-width: 170px; flex: none; }
</style>
