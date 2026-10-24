<!--
  UnsubscribeMenu — the host row menu of a subscription, opened from its vertical dots on the project page and on
  the home page: `open(event, subscription)`, then `unsubscribed` once the subscription is removed.

  Unsubscribing asks an important confirmation like the other deletions. A subscription created by Ligoj (CREATE
  mode) may also destroy what it created on the tool (job / folder tree on Jenkins, ...): opt-in, explained, off by
  default, and offered only when the tool plugin is installed, since that plugin deletes these data. Without it,
  only the subscription is removed, and the dialog says so: the removal fails when the plugin left its own data
  linked to the subscription. A linked subscription only detaches the project, the API ignores the flag.
-->
<template>
  <div v-if="menu.open" class="rowmenu-bg" @click="close">
    <div class="rowmenu" :style="{ top: menu.y + 'px', left: (menu.x - 180) + 'px' }" @click.stop>
      <!-- Host-owned action. Per-subscription "Configure" is NOT a generic route: it is a plugin concern surfaced
           through the plugin's own `renderFeatures` button, rendered inline on the row. -->
      <button v-if="auth.isAllowedApi('rest/subscription', 'DELETE')" class="danger" @click="ask"><v-icon size="16">mdi-delete-outline</v-icon>{{ t('project.detail.unsubscribe') }}</button>
    </div>
  </div>

  <LigojConfirmDialog v-model="unsubscribe.open" :title="t('project.detail.unsubscribe')" icon="mdi-delete-outline" icon-color="error"
    :confirm-label="t('project.detail.unsubscribe')" confirm-color="error" :loading="unsubscribe.busy" @confirm="confirm">
    <p class="unsub-text">{{ t('project.detail.unsubscribeConfirm', { name: unsubscribe.name }) }}</p>
    <p v-if="!unsubscribe.installed" class="unsub-missing">{{ t('project.detail.unsubscribePluginMissing') }}</p>
    <template v-else-if="unsubscribe.created">
      <v-checkbox v-model="unsubscribe.remote" class="unsub-remote" color="error" density="compact" hide-details :label="t('project.detail.unsubscribeData')" />
      <p class="unsub-hint">{{ t('project.detail.unsubscribeDataHint') }}</p>
    </template>
  </LigojConfirmDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useApi, useAuthStore, useErrorStore, useI18nStore, LjConfirmDialog as LigojConfirmDialog } from '@ligoj/host'
import { isToolPluginInstalled } from '../utils/subscriptionPlugin.js'

const emit = defineEmits(['unsubscribed'])
const { t } = useI18nStore()
const api = useApi()
const auth = useAuthStore()
const errorStore = useErrorStore()

const menu = ref({ open: false, x: 0, y: 0, sub: null })
/** Open the menu under the clicked dots of the subscription row. */
function open(event, sub) {
  const r = event.currentTarget.getBoundingClientRect()
  menu.value = { open: true, x: r.right, y: r.bottom + 4, sub }
}
function close() { menu.value.open = false }

// The confirmation: the subscription, whether Ligoj created it and its tool plugin can delete what it created, and
// the user's choice. The mode is unknown on the home page, whose subscriptions are light: no remote-data option there.
const unsubscribe = ref({ open: false, busy: false, sub: null, name: '', created: false, installed: true, remote: false })
function ask() {
  const s = menu.value.sub
  close()
  if (!s?.id) return
  const node = s.node || {}
  unsubscribe.value = {
    open: true, busy: false, sub: s,
    name: node.name || node.id || ('#' + s.id),
    created: String(s.mode || '').toUpperCase() === 'CREATE',
    installed: isToolPluginInstalled(s, auth.appSettings?.plugins),
    remote: false,
  }
}
async function confirm() {
  const u = unsubscribe.value
  if (!u.sub?.id) return
  u.busy = true
  const remote = u.installed && u.created && u.remote
  try {
    const res = await api.del(`rest/subscription/${u.sub.id}${remote ? '?deleteRemoteData=true' : ''}`, { raw: true })
    if (res?.ok) {
      unsubscribe.value.open = false
      // Confirm what happened: the plain detachment, or the deletion of the remote data too
      errorStore.success(t(remote ? 'project.detail.unsubscribedData' : 'project.detail.unsubscribed', { name: u.name }), { node: u.sub.node })
      emit('unsubscribed', u.sub)
    }
  } finally {
    u.busy = false
  }
}

defineExpose({ open })
</script>

<style scoped>
.rowmenu-bg {
  position: fixed;
  inset: 0;
  z-index: 70;
}

.rowmenu {
  position: fixed;
  min-width: 180px;
  padding: 5px;
  border-radius: var(--radius);
  background: rgb(var(--v-theme-surface));
  border: var(--border-w) var(--lj-border-style, solid) var(--border-c);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rowmenu button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--ink);
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
}

.rowmenu button:hover {
  background: rgba(var(--v-theme-on-surface), .07);
}

.rowmenu button.danger {
  color: rgb(var(--v-theme-error));
}

.rowmenu button.danger:hover {
  background: rgba(var(--v-theme-error), .08);
}

.unsub-text { margin: 0 0 12px; color: var(--ink-2); }
.unsub-remote { margin-top: 4px; }
.unsub-hint { margin: 2px 0 0 40px; font-size: 12.5px; color: var(--ink-3); }
.unsub-missing { margin: 0; font-size: 12.5px; color: rgb(var(--v-theme-warning)); }
</style>
