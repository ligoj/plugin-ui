/*
 * The status column header of the node view: instead of an icon, the status badge of a home page tool card, over the
 * instances the table lists (every page) and their subscriptions; a click refreshes the statuses of the instances.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import SystemNodeView from '../views/SystemNodeView.vue'
import enMessages from '../i18n/en.js'

const NODES = [
  { id: 'service:build', name: 'Build' },
  { id: 'service:build:jenkins', name: 'Jenkins', status: 'DOWN' },
  { id: 'service:build:jenkins:a', name: 'A', status: 'UP', enabled: true },
  { id: 'service:build:jenkins:b', name: 'B', status: 'DOWN', enabled: true },
  { id: 'service:build:jenkins:c', name: 'C', enabled: true },
  // A disabled instance counts as down, as on the KPI cards
  { id: 'service:build:jenkins:d', name: 'D', status: 'UP', enabled: false },
]
// Subscriptions by instance (rest/node/status/subscription)
const SUB_STATS = [
  { node: 'service:build:jenkins:a', values: { total: 3, UP: 2, DOWN: 1 } },
  { node: 'service:build:jenkins:b', values: { total: 2, DOWN: 1 } },
]

function jsonResponse(body) {
  return { ok: true, status: 200, headers: { get: () => 'application/json' }, clone() { return jsonResponse(body) }, json: async () => body, text: async () => JSON.stringify(body) }
}
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjButton: true, RowActionsCog: true, NodeIcon: true, NodeModeChip: true, SubscriptionStatus: true, NodeEditDialog: true, LigojConfirmDialog: true,
  LjStatus: true,
  LjDataTable: {
    props: ['headers', 'items'],
    template: '<div class="vdt"><div class="head"><slot name="header.status" :header="headers[0]" /></div></div>',
  },
  NodeStatusBadge: { name: 'NodeStatusBadge', props: ['projectStats', 'subStats', 'nodeStats', 'refreshing', 'hint', 'readonly'], emits: ['refresh'], template: '<i class="badge" />' },
  'v-tooltip': true, 'v-icon': true, 'v-progress-circular': true,
}

async function mountView() {
  const w = mount(SystemNodeView, { global: { stubs } })
  await flushPromises()
  return w
}
const badge = (w) => w.find('.head').findComponent({ name: 'NodeStatusBadge' })
const posts = () => globalThis.fetch.mock.calls.filter(([, o]) => (o?.method || 'GET') === 'POST').map(([u]) => String(u))

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  globalThis.fetch = vi.fn(async (url, opts) => {
    if ((opts?.method || 'GET') === 'POST') return { ok: true, status: 204, headers: { get: () => null }, json: async () => null, text: async () => '' }
    if (String(url).includes('rest/node/status/subscription')) return jsonResponse(SUB_STATS)
    return jsonResponse(NODES)
  })
})

describe('SystemNodeView status header', () => {
  it('summarizes the listed instances and their subscriptions', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountView()
    expect(badge(w).props()).toMatchObject({
      nodeStats: { total: 4, up: 1, down: 2, unknown: 1 },
      subStats: { total: 5, up: 2, down: 2, unknown: 1 },
      refreshing: false, hint: 'Click: instances', readonly: false,
    })
  })

  it('refreshes the statuses of the instances on click', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountView()
    badge(w).vm.$emit('refresh', false)
    await flushPromises()
    expect(posts()).toEqual(['rest/node/status/refresh'])
  })

  it('shows the statuses only to a user who may not refresh them', async () => {
    useAuthStore().session = { roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/node.*' }] }
    const w = await mountView()
    expect(badge(w).props('readonly')).toBe(true)
  })

  it('keeps the header icon when the table lists no instance', async () => {
    useAuthStore().session = { admin: true }
    globalThis.fetch = vi.fn(async () => jsonResponse(NODES.slice(0, 2)))
    const w = await mountView()
    expect(badge(w).exists()).toBe(false)
  })
})
