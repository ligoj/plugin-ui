<!--
  DemoShowcaseView — demonstration/showcase page reachable from the
  Administration menu while the admin-level demo mode (host `useDemoMode`) is
  enabled. Gathers the Ligoj shared components and a spread of Vuetify
  primitives on one page; intended to grow into the reference showcase.
-->
<template>
  <div class="showcase lj-surface">
    <LjPageHeader :title="t('demo.showcase')" :subtitle="t('demo.showcaseSubtitle')">
      <template #actions>
        <LjSearch v-model="search" :placeholder="t('common.search')" />
        <LjButton icon="mdi-flask-outline" @click="confirmOpen = true">{{ t('demo.showcaseConfirm') }}</LjButton>
      </template>
    </LjPageHeader>

    <v-alert v-if="!demo" type="warning" variant="tonal" rounded="lg" class="mb-4">
      {{ t('demo.showcaseDisabled') }}
    </v-alert>

    <!-- ==== Ligoj shared components ==== -->
    <h2 class="sc-title">{{ t('demo.showcaseLigoj') }}</h2>
    <div class="sc-grid">
      <section class="sc-card">
        <h3>LjButton</h3>
        <div class="sc-row">
          <LjButton icon="mdi-content-save">Primary</LjButton>
          <LjButton variant="ghost">Ghost</LjButton>
          <LjButton variant="danger" icon="mdi-delete">Danger</LjButton>
        </div>
      </section>
      <section class="sc-card">
        <h3>LjSegmented</h3>
        <LjSegmented v-model="segment" :items="[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }]" />
      </section>
      <section class="sc-card">
        <h3>LjStatus</h3>
        <div class="sc-row">
          <LjStatus status="ok" tooltip="Everything fine" />
          <LjStatus status="warn" tooltip="Something to check" />
          <LjStatus status="error" tooltip="Something broken" />
        </div>
      </section>
      <section class="sc-card">
        <h3>LigojIcon</h3>
        <div class="sc-row">
          <LigojIcon icon="mdi-rocket-launch-outline" size="22" />
          <LigojIcon icon="mdi-flask-outline" size="22" />
          <LigojIcon icon="mdi-palette-outline" size="22" />
        </div>
      </section>
      <section class="sc-card">
        <h3>LigojAutocomplete</h3>
        <LigojAutocomplete v-model="tool" :items="['Jira', 'Jenkins', 'SonarQube', 'Confluence']" label="Tool" variant="outlined" density="compact" clearable />
      </section>
      <section class="sc-card sc-wide">
        <h3>VibrantDataTable</h3>
        <VibrantDataTable :headers="tableHeaders" :items="tableItems" :items-length="tableItems.length" :loading="false" item-value="id" />
      </section>
    </div>

    <!-- ==== Vuetify primitives ==== -->
    <h2 class="sc-title">{{ t('demo.showcaseVuetify') }}</h2>
    <div class="sc-grid">
      <section class="sc-card">
        <h3>v-alert</h3>
        <v-alert type="info" variant="tonal" density="compact" class="mb-2">Info</v-alert>
        <v-alert type="success" variant="tonal" density="compact" class="mb-2">Success</v-alert>
        <v-alert type="error" variant="tonal" density="compact">Error</v-alert>
      </section>
      <section class="sc-card">
        <h3>v-chip / v-badge</h3>
        <div class="sc-row">
          <v-chip color="primary" size="small" label>Alpha</v-chip>
          <v-chip color="success" size="small" prepend-icon="mdi-check">Ready</v-chip>
          <v-badge :content="demoCounter" color="error"><v-icon size="26">mdi-bell-outline</v-icon></v-badge>
        </div>
      </section>
      <section class="sc-card">
        <h3>v-switch / v-checkbox / v-rating</h3>
        <v-switch v-model="bool1" color="primary" label="Switch" hide-details density="compact" />
        <v-checkbox v-model="bool2" color="primary" label="Checkbox" hide-details density="compact" />
        <v-rating v-model="rating" color="amber" density="compact" size="small" />
      </section>
      <section class="sc-card">
        <h3>v-slider / progress</h3>
        <v-slider v-model="slider" color="primary" hide-details />
        <v-progress-linear :model-value="slider" color="primary" rounded height="8" class="my-3" />
        <v-progress-circular :model-value="slider" color="primary" size="42">{{ Math.round(slider) }}</v-progress-circular>
      </section>
      <section class="sc-card">
        <h3>v-text-field / v-select / v-textarea</h3>
        <v-text-field v-model="text" label="Text" variant="outlined" density="compact" prepend-inner-icon="mdi-form-textbox" class="mb-2" />
        <v-select v-model="select" :items="['Small', 'Medium', 'Large']" label="Size" variant="outlined" density="compact" class="mb-2" />
        <v-textarea v-model="notes" label="Notes" variant="outlined" density="compact" rows="2" />
      </section>
      <section class="sc-card">
        <h3>v-tabs</h3>
        <v-tabs v-model="tab" density="compact" color="primary">
          <v-tab value="a">Tab A</v-tab>
          <v-tab value="b">Tab B</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" class="pt-2">
          <v-tabs-window-item value="a"><p class="sc-text">First tab content.</p></v-tabs-window-item>
          <v-tabs-window-item value="b"><p class="sc-text">Second tab content.</p></v-tabs-window-item>
        </v-tabs-window>
      </section>
      <section class="sc-card sc-wide">
        <h3>v-expansion-panels / v-timeline</h3>
        <v-expansion-panels density="compact" class="mb-3">
          <v-expansion-panel title="Panel one" text="Expandable content one." />
          <v-expansion-panel title="Panel two" text="Expandable content two." />
        </v-expansion-panels>
        <v-timeline direction="horizontal" density="compact" side="end">
          <v-timeline-item dot-color="primary" size="small">Created</v-timeline-item>
          <v-timeline-item dot-color="success" size="small">Subscribed</v-timeline-item>
          <v-timeline-item dot-color="warning" size="small">Audited</v-timeline-item>
        </v-timeline>
      </section>
    </div>

    <!-- Ligoj dialogs -->
    <LjDialog v-model="dialogOpen" :title="t('demo.showcaseDialog')" icon="mdi-flask-outline" :max-width="420">
      <p class="sc-text">{{ t('demo.showcaseDialogText') }}</p>
      <template #footer>
        <LjButton variant="ghost" @click="dialogOpen = false">{{ t('common.cancel') }}</LjButton>
      </template>
    </LjDialog>
    <LigojConfirmDialog v-model="confirmOpen" :title="t('demo.showcaseConfirm')" icon="mdi-flask-outline" :confirm-label="t('demo.showcaseConfirm')" @confirm="dialogOpen = true">
      {{ t('demo.showcaseConfirmText') }}
    </LigojConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore, useDemoMode, useI18nStore, LjPageHeader, LjButton, LjSearch, LjSegmented, LjStatus, LjDialog, LigojIcon, LigojAutocomplete, VibrantDataTable, VibrantConfirmDialog as LigojConfirmDialog } from '@ligoj/host'

const t = useI18nStore().t
const appStore = useAppStore()
const { enabled: demo } = useDemoMode()

const search = ref('')
const segment = ref('one')
const tool = ref('Jira')
const bool1 = ref(true)
const bool2 = ref(false)
const rating = ref(4)
const slider = ref(60)
const text = ref('Sample')
const select = ref('Medium')
const notes = ref('')
const tab = ref('a')
const dialogOpen = ref(false)
const confirmOpen = ref(false)
const demoCounter = ref(3)

const tableHeaders = computed(() => [
  { key: 'name', label: t('common.name'), sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'count', label: 'Count', align: 'center' },
])
const tableItems = [
  { id: 1, name: 'Keycopter', status: 'ok', count: 4 },
  { id: 2, name: 'KYC', status: 'warn', count: 3 },
  { id: 3, name: 'Consoweb', status: 'ok', count: 2 },
]

onMounted(() => {
  appStore.setBreadcrumbs(() => [{ title: t('nav.home'), to: '/' }, { title: t('system.breadcrumb') }, { title: t('demo.showcase') }])
})
</script>

<style scoped>
.sc-title {
  font-family: var(--font);
  font-size: 17px;
  font-weight: 800;
  color: var(--ink-1);
  margin: 20px 0 10px;
}

.sc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.sc-card {
  background: var(--card);
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.sc-card h3 {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-3);
  margin: 0 0 10px;
}

.sc-wide {
  grid-column: 1 / -1;
}

.sc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sc-text {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
}
</style>
