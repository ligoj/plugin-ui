<!--
  TeamLeaderTooltip — the details of a project team leader, in a tooltip on its parent element: only the details the
  identity provider returned. Shared by the project page leader chip and the project list leader pill.
-->
<template>
  <v-tooltip activator="parent" :location="location">
    <div class="leader-tip">
      <div class="lt-head">{{ t('project.teamLeader') }}</div>
      <div v-for="line in details" :key="line.label" class="lt-row">
        <span class="lt-k">{{ line.label }}</span>
        <span v-if="line.chips" class="lt-v lt-chips"><v-chip v-for="chip in line.chips" :key="chip" size="x-small" variant="tonal" label>{{ chip }}</v-chip></span>
        <span v-else class="lt-v">{{ line.value }}</span>
      </div>
    </div>
  </v-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore, userFullName, userVisualId } from '@ligoj/host'

const props = defineProps({
  // The leader: login in `id`, with the attributes the identity provider returned.
  user: { type: Object, required: true },
  location: { type: String, default: 'top' },
})
const { t } = useI18nStore()

const details = computed(() => {
  const u = props.user
  const custom = Object.entries(u.customAttributes || {}).map(([label, value]) => ({ label, value }))
  return [
    { label: t('project.leader.name'), value: userFullName(u) },
    { label: t('project.leader.id'), value: userVisualId(u) },
    { label: t('project.leader.login'), value: userVisualId(u) !== u.id ? u.id : '' },
    { label: t('project.leader.mail'), value: (u.mails || []).join(', ') },
    { label: t('project.leader.company'), value: u.company },
    // One chip per group
    { label: t('project.leader.groups'), value: (u.groups || []).length, chips: u.groups },
    ...custom,
  ].filter((line) => line.value)
})
</script>

<style scoped>
.leader-tip { display: grid; gap: 3px; min-width: 200px; }
.leader-tip .lt-head { font-weight: 700; margin-bottom: 3px; }
.leader-tip .lt-row { display: flex; gap: 10px; font-size: 12.5px; }
.leader-tip .lt-k { opacity: .7; min-width: 78px; }
.leader-tip .lt-v { font-family: var(--mono); overflow-wrap: anywhere; }
.leader-tip .lt-chips { display: flex; flex-wrap: wrap; gap: 4px; }
</style>
