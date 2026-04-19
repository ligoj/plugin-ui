<template>
  <div class="plugin-ui-shell">
    <v-alert
      type="warning"
      variant="tonal"
      density="compact"
      class="mb-4"
    >
      plugin-ui is being migrated from the legacy Cascade.js implementation
      — most views below are placeholders and link back to their legacy
      sources.
    </v-alert>

    <v-list density="compact" class="mb-4">
      <v-list-subheader>Dashboard</v-list-subheader>
      <v-list-item to="/home" prepend-icon="mdi-view-dashboard" title="Overview" />
      <v-list-item to="/home/project" prepend-icon="mdi-folder-multiple" title="Projects" />
      <v-list-item to="/home/manual" prepend-icon="mdi-book-open-page-variant" title="Manual" />

      <v-list-subheader>System</v-list-subheader>
      <v-list-item to="/system" prepend-icon="mdi-cog" title="System administration" />

      <v-list-subheader>API</v-list-subheader>
      <v-list-item to="/api" prepend-icon="mdi-api" title="API reference" />
      <v-list-item to="/api/token" prepend-icon="mdi-key-variant" title="API tokens" />

      <v-list-subheader>Onboarding</v-list-subheader>
      <v-list-item to="/subscribe" prepend-icon="mdi-playlist-plus" title="Subscribe wizard" />
    </v-list>
  </div>
</template>

<script setup>
// Plugin shell. Renders a plain index when the user hits /ui directly
// (unrouted); the real views are reached through the nav items above
// or the host's sidebar.
</script>

<style scoped>
.plugin-ui-shell {
  padding: 1rem;
}
</style>
