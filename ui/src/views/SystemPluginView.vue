<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4 ga-2">
      <h1 class="text-h4">Plugins</h1>
      <v-spacer />
      <v-select
        v-model="repository"
        :items="REPOSITORIES"
        item-value="id"
        item-title="label"
        label="Repository"
        density="compact"
        hide-details
        variant="outlined"
        style="max-width: 200px"
        @update:model-value="load"
      />
      <v-btn
        variant="outlined"
        prepend-icon="mdi-magnify-plus"
        :loading="checking"
        @click="askCheckVersions"
      >
        Check versions
      </v-btn>
      <v-btn
        color="error"
        variant="outlined"
        prepend-icon="mdi-restart"
        :loading="restarting"
        @click="askRestart"
      >
        Restart
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openInstall">Install</v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
    >
      <template #item.type="{ item }">
        <v-icon size="small" :title="item.plugin?.type">{{ typeIcon(item) }}</v-icon>
      </template>
      <template #item.version="{ item }">
        <span>{{ item.plugin?.version || '—' }}</span>
        <v-chip
          v-if="item.latestLocalVersion"
          size="x-small"
          color="primary"
          class="ml-1"
          closable
          @click:close="cancelLocal(item)"
          title="Cancel local install"
        >{{ item.latestLocalVersion }}</v-chip>
        <v-chip
          v-if="item.newVersion && item.newVersion !== item.latestLocalVersion"
          size="x-small"
          color="success"
          class="ml-1"
          @click="installOne(item.plugin.artifact)"
          title="Upgrade available — click to install"
        >
          <v-icon start size="x-small">mdi-arrow-up</v-icon>{{ item.newVersion }}
        </v-chip>
      </template>
      <template #item.nodes="{ item }">
        <span v-if="item.plugin?.type?.toLowerCase() !== 'feature'">{{ item.nodes ?? 0 }}</span>
      </template>
      <template #item.subscriptions="{ item }">
        <span v-if="item.plugin?.type?.toLowerCase() !== 'feature'">{{ item.subscriptions ?? 0 }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-icon v-if="item.deleted" size="small" color="warning" title="Deletion scheduled">mdi-cancel</v-icon>
        <v-btn
          v-else
          icon
          size="small"
          variant="text"
          color="error"
          @click="askRemove(item.plugin.artifact)"
          title="Delete plug-in"
        >
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Install dialog: search-driven autocomplete -->
    <v-dialog v-model="installDialog" max-width="640" persistent>
      <v-card>
        <v-card-title>Install plug-in</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="installSelection"
            v-model:search="installSearch"
            :items="searchResults"
            item-value="artifact"
            label="Search artifacts"
            :hint="`Repository: ${repository} — type at least one character`"
            persistent-hint
            multiple
            chips
            closable-chips
            clearable
            variant="outlined"
            :loading="searching"
            no-filter
            return-object
            class="mb-2"
            autofocus
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :title="item.raw.artifact">
                <template #subtitle>
                  <span class="text-caption">{{ item.raw.version }}</span>
                </template>
              </v-list-item>
            </template>
            <template #chip="{ props: chipProps, item }">
              <v-chip v-bind="chipProps" closable size="small">
                {{ item.raw.artifact }}
                <span class="text-caption text-medium-emphasis ml-1">{{ item.raw.version }}</span>
              </v-chip>
            </template>
            <template #no-data>
              <v-list-item>
                <v-list-item-title class="text-caption text-medium-emphasis">
                  {{ installSearch ? 'No matches' : 'Type to search artifacts' }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-checkbox
            v-model="installJavadoc"
            label="Install Javadoc bundles"
            density="compact"
            hide-details
            class="mb-2"
          />

          <v-progress-linear
            v-if="installing"
            :model-value="installProgress.total ? Math.round(installProgress.current / installProgress.total * 100) : 0"
            color="primary"
            class="mt-2"
          />
          <p v-if="installing" class="text-caption text-medium-emphasis mt-1">
            Installing {{ installProgress.current }} / {{ installProgress.total }}: {{ installProgress.label }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="installing" @click="installDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="installing"
            :disabled="!installSelection.length"
            @click="doInstall"
          >
            Install {{ installSelection.length || '' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm dialog (restart / check-versions / delete) -->
    <v-dialog v-model="confirm.open" max-width="440">
      <v-card>
        <v-card-title>{{ confirm.title }}</v-card-title>
        <v-card-text>{{ confirm.text }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="confirm.busy" @click="confirm.open = false">Cancel</v-btn>
          <v-btn
            :color="confirm.color"
            variant="elevated"
            :loading="confirm.busy"
            @click="runConfirm"
          >
            {{ confirm.label }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useApi, useAppStore } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const REPOSITORIES = [
  { id: 'central', label: 'Maven Central' },
  { id: 'nexus',   label: 'OSSRH Nexus' },
]

const repository = ref('central')
const items = ref([])
const loading = ref(false)
const error = ref(null)
const checking = ref(false)
const restarting = ref(false)

const headers = [
  { title: '',         key: 'type',          sortable: false, width: '40px' },
  { title: 'Artifact', key: 'id',            sortable: true },
  { title: 'Name',     key: 'name',          sortable: true },
  { title: 'Vendor',   key: 'vendor',        sortable: true,  width: '160px' },
  { title: 'Version',  key: 'version',       sortable: false, width: '280px' },
  { title: 'Nodes',    key: 'nodes',         sortable: true,  width: '80px',  align: 'center' },
  { title: 'Subs',     key: 'subscriptions', sortable: true,  width: '80px',  align: 'center' },
  { title: '',         key: 'actions',       sortable: false, width: '60px',  align: 'end' },
]

function typeIcon(plugin) {
  const t = plugin.plugin?.type?.toLowerCase()
  if (!t) return 'mdi-link-off'
  if (t === 'feature') return 'mdi-wrench'
  if (t === 'service') return 'mdi-puzzle'
  if (t === 'tool') return 'mdi-hammer-wrench'
  return 'mdi-puzzle'
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get(`rest/system/plugin?repository=${repository.value}`)
  items.value = Array.isArray(data) ? data : (data?.data || [])
  loading.value = false
}

/* -------- install dialog (search-driven, multi-select) ---------- */

const installDialog = ref(false)
/** Selected artifacts to install. v-autocomplete is `return-object`
 *  so each entry holds the full {artifact, version} record. */
const installSelection = ref([])
const installSearch = ref('')
const searchResults = ref([])
const searching = ref(false)
const installJavadoc = ref(false)
const installing = ref(false)
const installProgress = reactive({ current: 0, total: 0, label: '' })
let searchTimer = null

function openInstall() {
  installSelection.value = []
  installSearch.value = ''
  searchResults.value = []
  installJavadoc.value = false
  installDialog.value = true
}

/** Debounced query against the same /system/plugin/search endpoint the
 *  legacy Cascade UI used (Select2 ajax). The endpoint returns an array
 *  of `{ artifact, version }` records — we surface artifact in the
 *  autocomplete title and version in the subtitle. */
watch(installSearch, (q) => {
  clearTimeout(searchTimer)
  const term = (q || '').trim()
  if (!term) {
    searchResults.value = []
    return
  }
  searchTimer = setTimeout(async () => {
    searching.value = true
    try {
      const data = await api.get(
        `rest/system/plugin/search?repository=${repository.value}&q=${encodeURIComponent(term)}`,
      )
      searchResults.value = Array.isArray(data) ? data : (data?.data || [])
    } finally {
      searching.value = false
    }
  }, 300)
})

onBeforeUnmount(() => clearTimeout(searchTimer))

async function doInstall() {
  if (!installSelection.value.length) return
  installing.value = true
  installProgress.current = 0
  installProgress.total = installSelection.value.length
  try {
    for (const entry of installSelection.value) {
      installProgress.current++
      installProgress.label = entry.artifact
      const qs = `repository=${repository.value}&javadoc=${installJavadoc.value}`
      await api.post(`rest/system/plugin/${encodeURIComponent(entry.artifact)}?${qs}`)
    }
  } finally {
    installing.value = false
    installDialog.value = false
    installSelection.value = []
    load()
  }
}

/** Single-shot install used by the per-row "upgrade available" chip. */
async function installOne(artifact) {
  const qs = `repository=${repository.value}&javadoc=false`
  await api.post(`rest/system/plugin/${encodeURIComponent(artifact)}?${qs}`)
  load()
}

async function cancelLocal(item) {
  await api.del(`rest/system/plugin/${item.plugin.artifact}/${item.latestLocalVersion}`)
  load()
}

/* ----------------- confirmation dialog plumbing ----------------- */

const confirm = reactive({
  open: false,
  title: '',
  text: '',
  label: 'Confirm',
  color: 'primary',
  busy: false,
  /** @type {() => Promise<void>|void} */
  action: () => {},
})

function ask({ title, text, label, color, action }) {
  confirm.title = title
  confirm.text = text
  confirm.label = label
  confirm.color = color
  confirm.action = action
  confirm.busy = false
  confirm.open = true
}

async function runConfirm() {
  confirm.busy = true
  try {
    await confirm.action()
  } finally {
    confirm.busy = false
    confirm.open = false
  }
}

function askRestart() {
  ask({
    title: 'Restart API container',
    text: 'The API process will restart now. Active sessions and ongoing background jobs may be interrupted.',
    label: 'Restart',
    color: 'error',
    action: async () => {
      restarting.value = true
      try { await api.put('rest/system/plugin/restart') }
      finally { restarting.value = false }
    },
  })
}

function askCheckVersions() {
  ask({
    title: 'Check for new versions',
    text: `Refresh the available plug-in versions from ${repository.value}? The repository cache will be invalidated and a new lookup performed.`,
    label: 'Check',
    color: 'primary',
    action: async () => {
      checking.value = true
      try {
        await api.put(`rest/system/plugin/cache?repository=${repository.value}`)
        await load()
      } finally {
        checking.value = false
      }
    },
  })
}

function askRemove(artifact) {
  ask({
    title: 'Delete plug-in',
    text: `Schedule deletion of ${artifact}? The actual removal happens on the next container restart.`,
    label: 'Delete',
    color: 'error',
    action: async () => {
      await api.del(`rest/system/plugin/${artifact}`)
      await load()
    },
  })
}

onMounted(() => {
  app.setTitle('Plug-ins')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Plug-ins' }])
  load()
})
</script>
