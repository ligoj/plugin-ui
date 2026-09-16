<!--
  ProjectsView — Projects cockpit. Faithful to the validated
  mockup (mockup viewProjects): a grid of project
  cards with a folder glyph, name + key, subscription count, a tool-logo set,
  and a footer "open" link + health bar. Loads real projects from rest/project
  (DataTables shape) one page at a time — paging, sorting and search are
  server-side through useDataTable; the demo projects are appended in demo mode.
-->
<template>
  <div class="projects lj-surface">
    <LjPageHeader :title="t('project.title')" actions-target="project" :actions-context="() => ({ reload: load })">
      <template #subtitle>
        <b>{{ total }}</b> {{ t('project.countLabel') }}
      </template>
      <template #actions>
        <LjSearch v-model="search" :placeholder="t('project.searchPlaceholder')" />
        <LjButton icon="mdi-plus" @click="openNew">{{ t('project.new') }}</LjButton>
      </template>
    </LjPageHeader>

    <LjDataTable :headers="headers" :items="items" :items-length="total" :loading="dt.loading.value" item-value="id" default-sort="name" :empty-text="t('common.noData') || 'Aucune donnée'"
      filename="projects.csv" :fetch-all="exportAll" @update:options="loadData" @row-click="openProject">
      <template #cell.name="{ item }">
        <div class="name-cell">
          <div class="folder-glyph"><v-icon color="#2f6df6" size="20">mdi-folder</v-icon></div>
          <div class="name-stack">
            <div class="name-main">{{ item.name }}</div>
            <div class="name-key">{{ item.pkey }}</div>
          </div>
        </div>
      </template>
      <template #cell.teamLeader="{ item }">
        <span v-if="item.teamLeader" class="tl-pill"><v-icon size="14">mdi-account-circle</v-icon>{{ item.teamLeader }}</span>
        <span v-else class="muted">—</span>
      </template>
      <template #cell.createdDate="{ item }">
        <span v-if="item.createdDate" class="mono">{{ fmtDate(item.createdDate) }}</span>
        <span v-else class="muted">—</span>
      </template>
      <template #cell.subs="{ item }">
        <span class="subs-chip">{{ item.subs }}</span>
      </template>
      <template #actions="{ item }">
        <RowActionsCog>
          <button @click="openEdit(item)"><v-icon size="18">mdi-pencil-outline</v-icon>{{ t('common.edit') }}</button>
          <div class="sep" />
          <button class="danger" @click="startDelete(item)"><v-icon size="18">mdi-delete-outline</v-icon>{{ t('common.delete') }}</button>
        </RowActionsCog>
      </template>
    </LjDataTable>

    <ProjectEditDialog v-model="editDialog" :project="editTarget" @saved="onSaved" />

    <LjConfirmDialog v-model="deleteDialog" :title="t('project.deleteTitle') || 'Supprimer le projet'" icon="mdi-folder-remove" confirm-color="error" :confirm-label="t('common.delete')"
      :loading="deleting" @confirm="confirmDelete">
      <span>{{ t('project.deleteConfirm', { name: deleteTarget?.name }) || `Supprimer le projet « ${deleteTarget?.name} » ?` }}</span>
    </LjConfirmDialog>

    <div class="toast" :class="{ show: toastMsg }">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi, useAppStore, useDataTable, useDemoMode, useI18nStore } from '@ligoj/host'
import { DEMO_PROJECTS } from '../demo/demoData.js'
import ProjectEditDialog from './ProjectEditDialog.vue'
import RowActionsCog from '../components/RowActionsCog.vue'
import { LjDataTable, LjConfirmDialog, LjPageHeader, LjButton, LjSearch } from '@ligoj/host'

const router = useRouter()
const api = useApi()
const appStore = useAppStore()
const i18n = useI18nStore()
const t = i18n.t

// Server-side paging, sorting and search (rest/project: rows / page / sidx / sord / search[value]);
// the table emits its options and the current page only is loaded, so any number of projects works.
const dt = useDataTable('project', { defaultSort: 'name' })
const search = dt.search
// The "subs" column sorts on the backend's subscription count column.
const SORT_KEYS = { subs: 'nbSubscriptions' }
let lastOptions = { page: 1, itemsPerPage: 25, sortBy: [{ key: 'name', order: 'asc' }] }
function loadData(options) {
  if (options) lastOptions = options
  const sortBy = (lastOptions.sortBy || []).map((sb) => ({ ...sb, key: SORT_KEYS[sb.key] || sb.key }))
  return dt.load({ ...lastOptions, sortBy })
}
function load() { return loadData() }
// Typing in the search box restarts from the first page, debounced.
let searchTimer
watch(search, () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => loadData({ ...lastOptions, page: 1 }), 300) })

// Admin-level demo mode: blend the demonstration projects into the list.
const { enabled: demo } = useDemoMode()
const items = computed(() => {
  const rows = dt.items.value.map(mapProject)
  return demo.value ? rows.concat(DEMO_PROJECTS) : rows
})
const total = computed(() => dt.totalItems.value + (demo.value ? DEMO_PROJECTS.length : 0))
async function exportAll() { return (await dt.loadAll()).map(mapProject) }

const headers = computed(() => [
  { key: 'name', label: t('common.name'), sortable: true },
  { key: 'description', label: t('common.description'), sortable: false },
  { key: 'teamLeader', label: t('project.teamLeader') || 'Team leader', sortable: true, exportValue: (r) => r.teamLeader || '' },
  { key: 'createdDate', label: t('common.createdDate') || 'Created', sortable: true, exportValue: (r) => fmtDate(r.createdDate) },
  { key: 'subs', label: t('project.subsShort'), sortable: true, align: 'center', width: '90px' },
])

/* Map a raw Ligoj project (DataTables row) to the card's shape. */
function mapProject(p) {
  const subs = Array.isArray(p.subscriptions) ? p.subscriptions : []
  const tools = [...new Set(subs.map((s) => s?.node?.name || s?.node?.id || s?.name).filter(Boolean))]
  const leader = p.teamLeader
  return {
    id: p.id, name: p.name, pkey: p.pkey,
    description: p.description || '',
    teamLeader: typeof leader === 'object' ? (leader?.fullName || leader?.id || '') : (leader || ''),
    createdDate: p.createdDate ?? p.creationDate ?? null,
    subs: p.nbSubscriptions ?? subs.length ?? 0,
    tools,
    health: typeof p.health === 'number' ? p.health : null,
  }
}

let toastT
const toastMsg = ref('')
function toast(msg) { toastMsg.value = msg; clearTimeout(toastT); toastT = setTimeout(() => (toastMsg.value = ''), 2200) }
function openProject(p) { router.push(`/project/${p.id ?? p.pkey}`) }

function fmtDate(d) {
  if (!d) return ''
  const date = typeof d === 'number' ? new Date(d) : new Date(String(d))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

const editDialog = ref(false)
const editTarget = ref(null)
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)
function openNew() { editTarget.value = null; editDialog.value = true }
function openEdit(p) { editTarget.value = p; editDialog.value = true }

function startDelete(p) { deleteTarget.value = p; deleteDialog.value = true }
async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.del(`rest/project/${deleteTarget.value.id}`)
    deleteDialog.value = false
    deleteTarget.value = null
    await load()
  } finally { deleting.value = false }
}
/* After a create/edit: jump straight to the new project's detail (so the
   user lands on the cockpit they just populated); on edit, reload the grid. */
function onSaved({ id, created }) {
  if (created && id != null && typeof id !== 'object') router.push(`/project/${id}`)
  else load()
}

onMounted(() => {
  appStore.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('project.title') }], { refresh: load })
  load()
})
</script>

<style scoped>
/* View-specific styling only — chrome (header, search, primary button, row
   icon buttons) comes from the shared host components + the global
   `.lj-surface` / `.lj-iconbtn` classes, which supply the ink, pill, radius,
   mono, card and shadow vars these rules read. */
.sub b {
  color: var(--ink-2);
  font-family: var(--mono);
}

/* Table cells (folder glyph + name stack, team leader pill, subs chip). */
.name-cell {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.folder-glyph {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, #2f6df6 12%, var(--card));
  box-shadow: 0 2px 6px -3px rgba(47, 109, 246, .35);
  flex: none;
}

.name-stack {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name-main {
  font-family: var(--font);
  font-weight: var(--bold);
  font-size: 14px;
  color: var(--ink);
  letter-spacing: -.02em;
}

.name-key {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-3);
  text-transform: uppercase;
  letter-spacing: .04em;
}

.tl-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--ink-2);
}

.subs-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--pill);
  font-family: var(--mono);
  font-weight: 700;
  font-size: 12px;
  color: var(--ink-2);
}

.muted {
  color: var(--ink-3);
}

.mono {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--ink-2);
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background: var(--ink);
  color: var(--surface);
  padding: 11px 18px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  z-index: 60;
  opacity: 0;
  transition: .25s;
  pointer-events: none;
  box-shadow: var(--shadow-lg);
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
