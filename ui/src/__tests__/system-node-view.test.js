import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import SystemNodeView from '../views/SystemNodeView.vue'
import enMessages from '../i18n/en.js'

// A tool node (3 id parts) and an instance node (4 parts) — see nodeType().
const TOOL = { id: 'service:build:jenkins', name: 'Jenkins', mode: 'all', status: 'UP' }
const INSTANCE = { id: 'service:build:jenkins:1', name: 'Jenkins CI', mode: 'all', status: 'UP' }

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

// Stubs render the slots we exercise: the tools cog #tools-extra and the per-row
// #actions. Vuetify is externalized in the plugin build, so v-* need stubs too;
// v-tooltip must render its #activator slot to expose the row refresh button.
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  RowActionsCog: { template: '<div class="cog"><slot /></div>' },
  NodeIcon: { template: '<span />' },
  NodeModeChip: { template: '<span />' },
  SubscriptionStatus: { props: ['node', 'subscription', 'status'], template: '<span class="sst" />' },
  NodeEditDialog: { props: ['modelValue'], template: '<div />' },
  LigojConfirmDialog: { props: ['modelValue'], emits: ['confirm'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' },
  VibrantDataTable: {
    props: ['headers', 'items', 'itemsLength', 'loading'],
    template: '<div class="vdt">'
      + '<div v-for="it in items" :key="it.id" class="row"><slot name="actions" :item="it" /></div>'
      + '<div class="tools"><slot name="tools-extra" /></div></div>',
  },
  'v-tooltip': { template: '<div class="tt"><slot name="activator" :props="{}" /></div>' },
  'v-icon': true,
  'v-progress-circular': true,
}

function mountView() {
  return mount(SystemNodeView, { global: { stubs } })
}

function postCalls() {
  return globalThis.fetch.mock.calls.filter((c) => (c[1]?.method || 'GET') === 'POST')
}

describe('SystemNodeView status refresh', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    // GET returns the node list; POST (a status refresh) just resolves ok.
    globalThis.fetch = vi.fn((url, opts) =>
      Promise.resolve((opts?.method || 'GET') === 'GET' ? jsonResponse([TOOL, INSTANCE]) : jsonResponse('UP')),
    )
  })

  it('gives every row a refresh action in the cog; instances also get edit + delete', async () => {
    const w = mountView()
    await flushPromises()
    const rows = w.findAll('.row')
    expect(rows).toHaveLength(2)
    // Both rows expose a cog whose first item is the status refresh.
    for (const row of rows) {
      const cog = row.find('.cog')
      expect(cog.exists()).toBe(true)
      expect(cog.findAll('button').some((b) => b.text().includes('Refresh'))).toBe(true)
    }
    // Tool row (0): refresh only. Instance row (1): refresh + edit + delete.
    expect(rows[0].findAll('.cog button')).toHaveLength(1)
    expect(rows[1].findAll('.cog button')).toHaveLength(3)
    expect(rows[1].find('.cog button.danger').exists()).toBe(true)
  })

  it('refreshes a single node status (POST status/refresh/{id}) then reloads', async () => {
    const w = mountView()
    await flushPromises()
    // The instance row's refresh menu item.
    const refreshBtn = w.findAll('.row')[1].findAll('.cog button').find((b) => b.text().includes('Refresh'))
    await refreshBtn.trigger('click')
    await flushPromises()

    const refresh = postCalls().map((c) => c[0])
    expect(refresh).toHaveLength(1)
    expect(decodeURIComponent(refresh[0])).toBe('rest/node/status/refresh/service:build:jenkins:1')
    // Reload re-queried the node list after the refresh.
    const getCalls = globalThis.fetch.mock.calls.filter((c) => (c[1]?.method || 'GET') === 'GET')
    expect(getCalls.length).toBeGreaterThanOrEqual(2)
  })

  it('refreshes every node status from the tools cog (POST status/refresh)', async () => {
    const w = mountView()
    await flushPromises()
    await w.find('.tools button').trigger('click')
    await flushPromises()

    const urls = postCalls().map((c) => c[0])
    expect(urls).toContain('rest/node/status/refresh')
  })
})
