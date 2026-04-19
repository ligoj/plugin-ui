<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4">API reference</h1>
      <v-spacer />
      <v-btn
        variant="outlined"
        prepend-icon="mdi-code-tags"
        :href="`${base}rest/openapi.json`"
        target="_blank"
      >
        Download OpenAPI
      </v-btn>
    </div>

    <v-alert v-if="error" type="warning" variant="tonal" class="mb-4">
      {{ error }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Swagger-UI mounts itself into this div once its bundle loads. -->
    <div id="swagger-ui" class="swagger-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAppStore, APP_BASE } from '@ligoj/host'

const app = useAppStore()

const loading = ref(true)
const error = ref(null)

// The backend serves the Swagger UI bundle + CSS at /ligoj/rest/* — use
// the host-exported base so dev-proxy and prod hit the same place (the
// plugin's own import.meta.env.BASE_URL is `/` because the library build
// has no base).
const base = APP_BASE

const SWAGGER_BUNDLE_URL   = `${base}rest/swagger-ui-bundle.js`
const SWAGGER_PRESET_URL   = `${base}rest/swagger-ui-standalone-preset.js`
const SWAGGER_CSS_URL      = `${base}rest/swagger-ui.css`
const SWAGGER_EXTRA_CSS    = `${base}rest/index.css`
const OPENAPI_URL          = `${base}rest/openapi.json`

/** Advanced filter plug-in ported from the legacy home.js — matches operation
 *  summary / description / path against the filter phrase and hides whole
 *  tag groups that end up empty. */
function buildAdvancedFilterPlugin() {
  return () => ({
    fn: {
      opsFilter(taggedOps, phrase) {
        const needle = phrase.toLowerCase()
        const filtered = taggedOps.map((tag) => {
          tag._root.entries[1][1] = tag._root.entries[1][1].filter((op) => {
            const json = JSON.parse(JSON.stringify(op))
            const summary = (json.operation.summary || '').toString().toLowerCase()
            const description = (json.operation.description || '').toString().toLowerCase()
            return json.path.toLowerCase().includes(needle)
              || summary.includes(needle)
              || description.includes(needle)
          })
          return tag
        })
        return filtered.filter((tag) => tag._root.entries[1][1].size > 0)
      },
    },
  })
}

function injectStylesheet(href, id) {
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function removeElement(id) {
  document.getElementById(id)?.remove()
}

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id)
    if (existing) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.id = id
    s.src = src
    s.async = true
    s.onload = resolve
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

function mount() {
  const { SwaggerUIBundle, SwaggerUIStandalonePreset } = window
  if (!SwaggerUIBundle) {
    error.value = 'Swagger UI bundle is unavailable.'
    return
  }
  window.ui = SwaggerUIBundle({
    url: OPENAPI_URL,
    dom_id: '#swagger-ui',
    displayRequestDuration: true,
    deepLinking: false,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.FiltrePreset, buildAdvancedFilterPlugin()].filter(Boolean),
    filter: true,
    layout: 'StandaloneLayout',
    validatorUrl: 'https://validator.swagger.io/validator',
  })
}

onMounted(async () => {
  app.setTitle('API')
  app.setBreadcrumbs([{ title: 'API' }])

  injectStylesheet(SWAGGER_CSS_URL, 'swagger-ui-css')
  injectStylesheet(SWAGGER_EXTRA_CSS, 'swagger-ui-extra-css')

  try {
    await Promise.all([
      loadScript(SWAGGER_BUNDLE_URL, 'swagger-ui-bundle'),
      loadScript(SWAGGER_PRESET_URL, 'swagger-ui-preset'),
    ])
    mount()
  } catch (e) {
    error.value = e.message || 'Unable to load Swagger UI.'
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  // Swagger UI pollutes the global namespace; remove the extra stylesheets
  // we injected so other views don't inherit their heavy resets. Scripts
  // stay cached — no point yanking the bundle.
  removeElement('swagger-ui-css')
  removeElement('swagger-ui-extra-css')
  delete window.ui
})
</script>

<style scoped>
.swagger-container {
  /* Swagger UI ships its own typography and spacing — leave a plain host. */
  min-height: 60vh;
}
</style>
