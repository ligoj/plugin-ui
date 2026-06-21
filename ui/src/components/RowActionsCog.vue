<!--
  RowActionsCog — shared row-action menu used by every plugin-ui table.

  A cog icon button (`.lj-iconbtn`) that opens a popmenu (`.lj-popmenu`); the
  caller supplies the action items through the default slot as plain <button>
  elements (with `class="danger"` for destructive ones and `<div class="sep" />`
  separators), exactly like the host's global popmenu pattern. Both classes are
  the host's GLOBAL classes (defined in vuetify-overrides.css), so the menu —
  which `v-menu` teleports outside the view's scope — is styled consistently
  with no scoped CSS here. The trigger stops row-click propagation so opening
  the menu never also opens the row. Vuetify's `close-on-content-click` (on by
  default) closes the menu after an item is clicked.
-->
<template>
  <v-menu location="bottom end">
    <template #activator="{ props }">
      <button class="lj-iconbtn" v-bind="props" :aria-label="label || t('common.actions')" @click.stop>
        <v-icon size="18">{{ icon }}</v-icon>
      </button>
    </template>
    <div class="lj-popmenu">
      <slot />
    </div>
  </v-menu>
</template>

<script setup>
import { useI18nStore } from '@ligoj/host'

defineProps({
  icon: { type: String, default: 'mdi-cog' },
  label: { type: String, default: '' },
})

const t = useI18nStore().t
</script>
