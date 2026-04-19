<template>
  <div>
    <h1 class="text-h4 mb-4">User manual</h1>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="tonal" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-book-open-page-variant</v-icon>
            Getting started
          </v-card-title>
          <v-card-text>
            <p class="mb-2">
              Ligoj aggregates the tools your projects rely on (source control,
              bug tracking, continuous integration, knowledge base, cloud
              provisioning) behind a single dashboard and API.
            </p>
            <p class="mb-0">
              Create a project, attach subscriptions, and hand your team a
              single entry point for everything.
            </p>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-list lines="two" density="compact">
            <v-list-item
              prepend-icon="mdi-folder-plus"
              title="Create a project"
              subtitle="Name, project key, manager — add subscriptions afterwards."
              to="/home/project"
            />
            <v-list-item
              prepend-icon="mdi-playlist-plus"
              title="Subscribe to a tool"
              subtitle="Pick a service, a tool, and a node for an existing or new instance."
              to="/subscribe"
            />
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Open the dashboard"
              subtitle="Tiles for every project you have access to."
              to="/"
            />
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-api</v-icon>
            Automation
          </v-card-title>
          <v-card-text>
            <p class="mb-3">
              Every screen is backed by a REST endpoint. Browse the full
              catalogue on the
              <router-link to="/api">API reference page</router-link>
              (OpenAPI / Swagger UI), and generate an
              <router-link to="/api/token">API token</router-link>
              to call it from scripts without exposing your password.
            </p>
            <v-code-block v-if="false" />
            <pre class="code-sample">curl "{{ origin }}{{ base }}rest/project?api-key=&lt;token&gt;&amp;api-user={{ userName }}"</pre>
          </v-card-text>
        </v-card>

        <v-card variant="outlined">
          <v-card-title class="d-flex align-center ga-2">
            <v-icon>mdi-help-circle</v-icon>
            More resources
          </v-card-title>
          <v-list lines="one" density="compact">
            <v-list-item
              prepend-icon="mdi-github"
              title="GitHub repository"
              subtitle="Source, issues, release notes"
              href="https://github.com/ligoj/ligoj"
              target="_blank"
              rel="noopener noreferrer"
            />
            <v-list-item
              prepend-icon="mdi-bug"
              title="Report an issue"
              href="https://github.com/ligoj/ligoj/issues"
              target="_blank"
              rel="noopener noreferrer"
            />
            <v-list-item
              prepend-icon="mdi-book"
              title="Wiki"
              href="https://github.com/ligoj/ligoj/wiki"
              target="_blank"
              rel="noopener noreferrer"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore, useAuthStore } from '@ligoj/host'

const app = useAppStore()
const auth = useAuthStore()

const base = import.meta.env.BASE_URL
const origin = typeof window !== 'undefined' ? window.location.origin : ''
const userName = computed(() => auth.userName || '<you>')

onMounted(() => {
  app.setTitle('Manual')
  app.setBreadcrumbs([{ title: 'Home', to: '/' }, { title: 'Manual' }])
})
</script>

<style scoped>
.code-sample {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85em;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>
