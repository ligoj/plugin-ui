/*
 * The KPI cards of the node view filter its table, the Subscriptions card included: it lists the nodes having
 * subscriptions, and the type menu shows that filter.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import SystemNodeView from '../views/SystemNodeView.vue'
import enMessages from '../i18n/en.js'

const NODES = [
  { id: 'service:build', name: 'Build' },
  { id: 'service:build:jenkins', name: 'Jenkins' },
  { id: 'service:build:jenkins:a', name: 'A', status: 'UP' },
  { id: 'service:build:jenkins:b', name: 'B', status: 'DOWN' },
]
const SUB_STATS = [{ node: 'service:build:jenkins:a', values: { total: 3, UP: 3 } }]

function jsonResponse(body) {
  return { ok: true, status: 200, headers: { get: () => 'application/json' }, clone() { return jsonResponse(body) }, json: async () => body, text: async () => JSON.stringify(body) }
}
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjButton: true, RowActionsCog: true, NodeIcon: true, NodeModeChip: true, SubscriptionStatus: true, NodeEditDialog: true, LigojConfirmDialog: true,
  LjStatus: true, NodeStatusBadge: true,
  LjDataTable: { props: ['items'], template: '<div class="vdt"><div v-for="it in items" :key="it.id" class="row">{{ it.id }}</div></div>' },
  'v-tooltip': true, 'v-icon': true, 'v-progress-circular': true,
}
const rows = (w) => w.findAll('.row').map((r) => r.text())
const card = (w, label) => w.findAll('.stat').find((s) => s.find('.slabel').text() === label)

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useAuthStore().session = { admin: true }
  globalThis.fetch = vi.fn(async (url) => jsonResponse(String(url).includes('rest/node/status/subscription') ? SUB_STATS : NODES))
})

describe('SystemNodeView filters', () => {
  it('lists the nodes having subscriptions from the Subscriptions card, and the menu shows it', async () => {
    const w = mount(SystemNodeView, { global: { stubs } })
    await flushPromises()
    expect(rows(w)).toHaveLength(4)
    await card(w, enMessages['system.node.subscriptions']).trigger('click')
    expect(rows(w)).toEqual(['service:build:jenkins:a'])
    expect(card(w, enMessages['system.node.subscriptions']).classes()).toContain('active')
    expect(w.find('.vsel-btn').text()).toContain(enMessages['system.node.filterSubscribed'])
    // The total card lists every node again
    await card(w, enMessages['system.node.statTotal']).trigger('click')
    expect(rows(w)).toHaveLength(4)
  })
})
