<!--
  ProjectEditDialog — 2026 "Vibrant" create/edit popup for a project. Same
  `.vmodal` chrome as UserEditDialog / DelegateEditDialog (gradient icon head,
  rounded fields, Vibrant footer). Wires to rest/project: POST on create, PUT
  on edit. The pkey is auto-derived from the name (lowercase-dash) until the
  user hand-edits it, and is locked once the project has subscriptions —
  mirrors plugin-ui's ProjectListView rules. Team leader is a user
  autocomplete hitting rest/service/id/user.
-->
<template>
  <LjDialog :model-value="modelValue" :title="isEdit ? t('project.edit') : t('project.new')" icon="mdi-folder-outline" :max-width="600" @update:model-value="onDialogModel">
      <v-form ref="formRef" @submit.prevent="save">
        <v-text-field v-model="form.name" :label="t('project.name')" :rules="[rules.required]" prepend-inner-icon="mdi-form-textbox" variant="outlined" class="mb-2" autofocus @update:model-value="onNameChanged" />
        <v-text-field v-model="form.pkey" :label="t('project.pkey')" :rules="[rules.required, rules.pkey]" :disabled="pkeyLocked" :hint="pkeyLocked ? t('project.pkeyLocked') : t('project.pkeyHint')" persistent-hint
          prepend-inner-icon="mdi-key" variant="outlined" class="mb-2" />
        <LigojAutocomplete v-model="form.teamLeader" v-model:search="leaderSearch" :label="t('project.teamLeader')" :items="leaderDisplayItems" item-title="label" item-value="id" :loading="leaderLoading"
          :rules="[rules.required]" :hint="t('project.teamLeaderHint')" persistent-hint prepend-inner-icon="mdi-account-star" no-filter clearable auto-select-first variant="outlined" class="mb-2"
          autocomplete="off" @update:search="onLeaderSearch" @update:menu="onLeaderMenu" />
        <v-textarea v-model="form.description" :label="t('project.description')" rows="3" prepend-inner-icon="mdi-text-long" variant="outlined" class="mb-2" />
      </v-form>
      <template #footer>
        <LjButton variant="ghost" @click="requestClose">{{ t('common.cancel') }}</LjButton>
        <LjButton icon="mdi-content-save" :loading="saving" @click="save">{{ t('common.save') }}</LjButton>
      </template>
  </LjDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useApi, useI18nStore, LjDialog, LjButton, LigojAutocomplete } from '@ligoj/host'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // Existing project to edit (with id/name/pkey/teamLeader/description and
  // nbSubscriptions for the pkey lock); null/absent means create mode.
  project: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'saved'])

const api = useApi()
const i18n = useI18nStore()
const t = i18n.t

const formRef = ref(null)
const saving = ref(false)

const isEdit = computed(() => !!props.project?.id)
const pkeyLocked = computed(() => isEdit.value && (props.project?.nbSubscriptions || 0) > 0)

const form = ref({ name: '', pkey: '', teamLeader: '', description: '' })
let lastPkeyAuto = ''

const rules = {
  required: (v) => !!v || t('common.required'),
  pkey: (v) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(v || '') || t('project.pkeyRule'),
}

/* Slugify a name into a candidate pkey: strip accents, lowercase, collapse
   non-alphanumerics into single dashes. Mirrors plugin-ui's `normalize`. */
function slugify(name) {
  return (name || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
function onNameChanged() {
  if (pkeyLocked.value) return
  // Only auto-fill while the user hasn't hand-edited the pkey.
  if (!form.value.pkey || form.value.pkey === lastPkeyAuto) {
    const pk = slugify(form.value.name)
    form.value.pkey = pk
    lastPkeyAuto = pk
  }
}

/* ---- Team-leader autocomplete (users) ---- */
const leaderItems = ref([])
const leaderSearch = ref('')
const leaderLoading = ref(false)
let leaderTimer = null

const leaderDisplayItems = computed(() => {
  const cur = form.value.teamLeader
  const items = leaderItems.value
  if (cur && !items.find((i) => i.id === cur)) return [{ id: cur, label: cur }, ...items]
  return items
})

async function loadLeaders() {
  leaderLoading.value = true
  try {
    const q = (leaderSearch.value || '').trim()
    const qp = q ? `q=${encodeURIComponent(q)}&` : ''
    const data = await api.get(`rest/service/id/user?${qp}rows=20`)
    const rows = Array.isArray(data) ? data : (data?.data || [])
    leaderItems.value = rows.map((r) => {
      const full = [r.firstName, r.lastName].filter(Boolean).join(' ')
      return { id: r.id, label: full ? `${r.id} — ${full}` : r.id }
    })
  } finally { leaderLoading.value = false }
}
function onLeaderSearch(q) {
  if (leaderDisplayItems.value.some((i) => i.label === q)) return
  clearTimeout(leaderTimer)
  leaderTimer = setTimeout(loadLeaders, 250)
}
function onLeaderMenu(open) {
  if (open && leaderItems.value.length === 0) loadLeaders()
}

function resetForm() {
  const p = props.project
  form.value = {
    name: p?.name || '',
    pkey: p?.pkey || '',
    teamLeader: p?.teamLeader?.id || p?.teamLeader || '',
    description: p?.description || '',
  }
  lastPkeyAuto = p?.pkey || ''
  leaderItems.value = []
  leaderSearch.value = ''
  formRef.value?.resetValidation()
}

watch(() => props.modelValue, (val) => { if (val) resetForm() })

function onDialogModel(val) { if (!val) requestClose() }
function requestClose() { emit('update:modelValue', false) }

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    const payload = {
      id: props.project?.id,
      name: form.value.name,
      pkey: form.value.pkey,
      teamLeader: form.value.teamLeader,
      description: form.value.description,
    }
    const id = await api[isEdit.value ? 'put' : 'post']('rest/project', payload)
    emit('saved', { id: isEdit.value ? props.project.id : id, created: !isEdit.value })
    emit('update:modelValue', false)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Dialog chrome (card, header, footer, buttons, base field rounding) now
   comes from <LjDialog> / <LjButton> + the global `.lj-surface` on the card,
   which supplies the --font/--radius-sm tokens these field refinements read.
   Only the form-field tweaks specific to this dialog remain; they scope onto
   the slotted content via :deep(). */
:deep(.v-field) { border-radius: var(--radius-sm); font-family: var(--font); }
:deep(.v-field__prepend-inner .v-icon) { opacity: .55; }
:deep(.v-label) { font-weight: 600; }
</style>
