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
      <v-btn variant="outlined" prepend-icon="mdi-magnify-plus" @click="checkNewVersions" :loading="checking">
        Check versions
      </v-btn>
      <v-btn color="error" variant="outlined" prepend-icon="mdi-restart" @click="restart" :loading="restarting">
        Restart
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="installDialog = true">Install</v-btn>
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
          @click="install(item.plugin.artifact, true)"
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
          @click="remove(item.plugin.artifact)"
          title="Delete plug-in"
        >
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Install dialog -->
    <v-dialog v-model="installDialog" max-width="520">
      <v-card>
        <v-card-title>Install plug-in</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="installArtifact"
            label="Artifact id (e.g. plugin-prov-aws)"
            variant="outlined"
            :hint="`Repository: ${repository}`"
            persistent-hint
            class="mb-2"
            autofocus
          />
          <v-checkbox v-model="installJavadoc" label="Install Javadoc bundle" density="compact" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="installDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="installing"
            :disabled="!installArtifact"
            @click="doInstall"
          >Install</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const installDialog = ref(false)
const installArtifact = ref('')
const installJavadoc = ref(false)
const installing = ref(false)

const headers = [
  { title: '',             key: 'type',          sortable: false, width: '40px' },
  { title: 'Artifact',     key: 'id',            sortable: true },
  { title: 'Name',         key: 'name',          sortable: true },
  { title: 'Vendor',       key: 'vendor',        sortable: true,  width: '160px' },
  { title: 'Version',      key: 'version',       sortable: false, width: '280px' },
  { title: 'Nodes',        key: 'nodes',         sortable: true,  width: '80px',  align: 'center' },
  { title: 'Subs',         key: 'subscriptions', sortable: true,  width: '80px',  align: 'center' },
  { title: '',             key: 'actions',       sortable: false, width: '60px',  align: 'end' },
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

async function checkNewVersions() {
  checking.value = true
  await api.put(`rest/system/plugin/cache?repository=${repository.value}`)
  checking.value = false
  load()
}

async function restart() {
  restarting.value = true
  await api.put('rest/system/plugin/restart')
  restarting.value = false
}

async function install(artifact, upgrade = false) {
  installing.value = true
  const qs = `repository=${repository.value}&javadoc=${upgrade ? false : installJavadoc.value}`
  await api.post(`rest/system/plugin/${encodeURIComponent(artifact)}?${qs}`)
  installing.value = false
  installDialog.value = false
  installArtifact.value = ''
  installJavadoc.value = false
  load()
}

function doInstall() {
  if (installArtifact.value) install(installArtifact.value.trim())
}

async function cancelLocal(item) {
  await api.del(`rest/system/plugin/${item.plugin.artifact}/${item.latestLocalVersion}`)
  load()
}

async function remove(artifact) {
  if (!confirm(`Delete plug-in ${artifact}?`)) return
  await api.del(`rest/system/plugin/${artifact}`)
  load()
}

onMounted(() => {
  app.setTitle('Plug-ins')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Plug-ins' }])
  load()
})
</script>
