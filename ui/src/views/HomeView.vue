<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4 ga-2">
      <h1 class="text-h4">Dashboard</h1>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Filter projects or tools"
        variant="outlined"
        density="compact"
        hide-details
        class="search-field"
        clearable
      />
      <v-btn-toggle v-model="tilesSize" mandatory density="compact" color="primary">
        <v-btn value="sm" title="Small tiles"><v-icon>mdi-view-comfy</v-icon></v-btn>
        <v-btn value="md" title="Medium tiles"><v-icon>mdi-view-grid</v-icon></v-btn>
        <v-btn value="lg" title="List"><v-icon>mdi-view-list</v-icon></v-btn>
      </v-btn-toggle>
      <v-btn variant="outlined" prepend-icon="mdi-folder-multiple" to="/home/project">
        All projects
      </v-btn>
    </div>

    <!-- Service-type tag filter chips -->
    <div v-if="tags.length" class="d-flex flex-wrap ga-1 mb-4">
      <v-chip
        v-for="tag in tags"
        :key="tag.id"
        :color="selectedTag === tag.id ? 'primary' : undefined"
        :variant="selectedTag === tag.id ? 'elevated' : 'tonal'"
        size="small"
        @click="selectedTag = selectedTag === tag.id ? null : tag.id"
      >
        <v-icon start size="small">{{ tag.icon }}</v-icon>
        {{ tag.label }}
        <span class="ml-1 text-caption">{{ tag.count }}</span>
      </v-chip>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-alert
      v-if="!loading && filteredProjects.length === 0 && !error"
      type="info"
      variant="tonal"
      density="compact"
    >
      No projects match the current filter.
    </v-alert>

    <div :class="['tile-grid', `size-${tilesSize}`]">
      <v-card
        v-for="p in filteredProjects"
        :key="p.id"
        class="tile"
        hover
        :to="`/home/project/${p.id}`"
      >
        <v-card-text class="pa-3">
          <div class="d-flex align-start mb-2">
            <div class="flex-grow-1 truncate">
              <div class="text-subtitle-1 font-weight-medium truncate">{{ p.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ p.pkey }}</div>
            </div>
            <v-chip size="x-small" variant="tonal">{{ p.subscriptions.length }}</v-chip>
          </div>

          <div v-if="tilesSize !== 'lg'" class="sub-strip">
            <v-tooltip
              v-for="s in p.subscriptions.slice(0, tilesSize === 'sm' ? 4 : 8)"
              :key="s.id"
              :text="`${s.node?.refined?.name || '—'} → ${s.node?.name || s.node?.id}`"
              location="top"
            >
              <template #activator="{ props: tipProps }">
                <v-icon
                  v-bind="tipProps"
                  size="small"
                  :color="serviceColor(s)"
                  class="mr-1"
                >{{ serviceIcon(s) }}</v-icon>
              </template>
            </v-tooltip>
            <span
              v-if="p.subscriptions.length > (tilesSize === 'sm' ? 4 : 8)"
              class="text-caption text-medium-emphasis ml-1"
            >
              +{{ p.subscriptions.length - (tilesSize === 'sm' ? 4 : 8) }}
            </span>
          </div>

          <v-table
            v-else
            density="compact"
            class="mt-2"
            style="background: transparent"
          >
            <tbody>
              <tr v-for="s in p.subscriptions" :key="s.id">
                <td style="width: 28px">
                  <v-icon size="small" :color="serviceColor(s)">{{ serviceIcon(s) }}</v-icon>
                </td>
                <td class="truncate">{{ s.node?.refined?.name || '—' }}</td>
                <td class="truncate text-medium-emphasis">{{ s.node?.name || s.node?.id }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi, useAppStore } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const loading = ref(false)
const error = ref(null)
const subscriptions = ref([])

const search = ref('')
const selectedTag = ref(null)
const tilesSize = ref('md')

/** Group the flat subscriptions list into projects keyed by id. */
const projects = computed(() => {
  const byId = new Map()
  for (const s of subscriptions.value) {
    const pid = s.project?.id ?? s.project
    if (pid == null) continue
    let proj = byId.get(pid)
    if (!proj) {
      proj = {
        id: pid,
        name: s.project?.name || String(pid),
        pkey: s.project?.pkey || '',
        subscriptions: [],
      }
      byId.set(pid, proj)
    }
    proj.subscriptions.push(s)
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
})

/** Tag buckets built from the service id of each subscription. */
const tags = computed(() => {
  const counts = new Map()
  for (const s of subscriptions.value) {
    const id = s.node?.refined?.refined?.id || ''
    if (!id) continue
    counts.set(id, (counts.get(id) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({
      id,
      count,
      icon: serviceIconById(id),
      label: id.split(':').slice(-1)[0],
    }))
})

const filteredProjects = computed(() => {
  const needle = search.value?.trim().toLowerCase()
  return projects.value.filter((p) => {
    if (selectedTag.value) {
      const hasTag = p.subscriptions.some(
        (s) => s.node?.refined?.refined?.id === selectedTag.value,
      )
      if (!hasTag) return false
    }
    if (!needle) return true
    if (p.name.toLowerCase().includes(needle)) return true
    if (p.pkey.toLowerCase().includes(needle)) return true
    return p.subscriptions.some(
      (s) =>
        (s.node?.name || '').toLowerCase().includes(needle) ||
        (s.node?.id || '').toLowerCase().includes(needle) ||
        (s.node?.refined?.name || '').toLowerCase().includes(needle),
    )
  })
})

function serviceIconById(id) {
  if (id.includes(':scm:')) return 'mdi-source-branch'
  if (id.includes(':build:')) return 'mdi-hammer-wrench'
  if (id.includes(':bt')) return 'mdi-bug'
  if (id.includes(':km:')) return 'mdi-book-open-variant'
  if (id.includes(':vm')) return 'mdi-server'
  if (id.includes(':prov')) return 'mdi-cloud'
  if (id.includes(':id')) return 'mdi-account-group'
  if (id.includes(':inbox:')) return 'mdi-email'
  return 'mdi-puzzle'
}

function serviceIcon(sub) {
  return serviceIconById(sub.node?.refined?.refined?.id || '')
}

function serviceColor(sub) {
  const id = sub.node?.refined?.refined?.id || ''
  const palette = ['primary', 'teal', 'indigo', 'purple', 'orange', 'blue-grey', 'green']
  let n = 0
  for (const ch of id) n += ch.charCodeAt(0)
  return palette[n % palette.length]
}

async function load() {
  loading.value = true
  error.value = null
  const data = await api.get('rest/subscription')
  if (Array.isArray(data)) {
    subscriptions.value = data
  } else if (Array.isArray(data?.data)) {
    subscriptions.value = data.data
  } else {
    subscriptions.value = []
  }
  loading.value = false
}

onMounted(() => {
  app.setTitle('Dashboard')
  app.setBreadcrumbs([{ title: 'Home' }])
  load()
})
</script>

<style scoped>
.search-field {
  min-width: 220px;
  max-width: 340px;
  flex: 1 1 240px;
}

.tile-grid {
  display: grid;
  gap: 1rem;
}
.tile-grid.size-sm { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
.tile-grid.size-md { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.tile-grid.size-lg { grid-template-columns: 1fr; }

.tile {
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.tile:hover {
  transform: translateY(-2px);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
