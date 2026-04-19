<template>
  <div>
    <h1 class="text-h4 mb-4">Database bench</h1>

    <v-card variant="tonal" class="mb-4">
      <v-card-text>
        Runs a sequence of <code>INSERT</code> → <code>SELECT</code> →
        <code>SELECT *</code> → <code>UPDATE</code> → <code>DELETE</code>
        calls and reports each step's duration. Handy to validate that
        the backend's persistence layer is responsive.
      </v-card-text>
    </v-card>

    <v-btn color="primary" prepend-icon="mdi-play" :loading="running" @click="run">
      Run bench
    </v-btn>

    <v-alert v-if="error" type="warning" variant="tonal" class="mt-4">{{ error }}</v-alert>

    <v-table v-if="results.length" density="compact" class="mt-4" style="max-width: 600px">
      <thead>
        <tr>
          <th>Step</th>
          <th>Duration (ms)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in results" :key="r.step">
          <td>{{ r.step }}</td>
          <td>
            <v-progress-circular v-if="r.loading" size="16" width="2" indeterminate />
            <span v-else>{{ r.duration ?? '—' }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi, useAppStore } from '@ligoj/host'

const api = useApi()
const app = useAppStore()

const STEPS = [
  { key: 'insert',     step: 'INSERT',     method: 'post', url: 'rest/system/bench/prepare' },
  { key: 'select',     step: 'SELECT',     method: 'get',  url: 'rest/system/bench/read' },
  { key: 'select-all', step: 'SELECT *',   method: 'get',  url: 'rest/system/bench/read/all' },
  { key: 'update',     step: 'UPDATE',     method: 'put',  url: 'rest/system/bench/update' },
  { key: 'delete',     step: 'DELETE',     method: 'del',  url: 'rest/system/bench/delete' },
]

const running = ref(false)
const error = ref(null)
const results = ref(STEPS.map((s) => ({ step: s.step, duration: null, loading: false })))

async function run() {
  running.value = true
  error.value = null
  results.value = STEPS.map((s) => ({ step: s.step, duration: null, loading: false }))

  for (let i = 0; i < STEPS.length; i++) {
    results.value[i].loading = true
    try {
      const payload = STEPS[i].method === 'post' || STEPS[i].method === 'put' ? undefined : null
      const data = payload === null
        ? await api[STEPS[i].method](STEPS[i].url)
        : await api[STEPS[i].method](STEPS[i].url, payload)
      results.value[i].duration = data?.duration ?? '—'
    } catch (e) {
      error.value = `${STEPS[i].step} failed: ${e.message || e}`
      break
    } finally {
      results.value[i].loading = false
    }
  }
  running.value = false
}

onMounted(() => {
  app.setTitle('Bench')
  app.setBreadcrumbs([{ title: 'System', to: '/system' }, { title: 'Bench' }])
})
</script>
