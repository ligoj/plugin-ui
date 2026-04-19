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
    <v-number-input controlVariant="default" label="nb" v-model="nb"></v-number-input>

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
import { useApi, useAppStore, APP_BASE } from '@ligoj/host'

const api = useApi()
const app = useAppStore()
const nb = ref(1000)

// `prepare` is declared on the Java side as
//   @Consumes({ APPLICATION_FORM_URLENCODED, MULTIPART_FORM_DATA })
//   @Produces(TEXT_HTML)
// so posting it with useApi (which ships an empty body and no
// Content-Type) returns 415. Send a FormData body — fetch picks the
// multipart boundary for us — and parse the text response ourselves.
// The other four steps are well-behaved JSON endpoints and go through
// useApi normally.
const STEPS = [
  { key: 'insert', step: 'INSERT', form: true, url: 'rest/system/bench/prepare' },
  { key: 'select', step: 'SELECT', method: 'get', url: 'rest/system/bench/read' },
  { key: 'select-all', step: 'SELECT *', method: 'get', url: 'rest/system/bench/read/all' },
  { key: 'update', step: 'UPDATE', method: 'put', url: 'rest/system/bench/update' },
  { key: 'delete', step: 'DELETE', method: 'del', url: 'rest/system/bench/delete' },
]

/**
 * Run a single bench step and return an object with `duration`.
 * Form steps POST a FormData so the server's Consumes constraint is
 * satisfied; we parse the (text/html) response as either JSON or a plain
 * number, matching the legacy UI's intent.
 */
async function runStep(step) {
  if (step.form) {
    const form = new FormData();
    form.append('nb', 1000);
    const resp = await fetch(`${APP_BASE}${step.url}`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    })
    if (!resp.ok) throw new Error(`${step.step} HTTP ${resp.status}`)
    const text = (await resp.text()).trim()
    if (!text) return { duration: '' }
    try { return JSON.parse(text) } catch { /* fall through */ }
    const n = Number(text)
    return { duration: Number.isFinite(n) ? n : text }
  }
  return api[step.method](step.url)
}

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
      const data = await runStep(STEPS[i])
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
