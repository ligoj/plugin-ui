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
      + '<div v-for="it in items" :key="it.id" class="row">'
      + '<span class="subs-cell"><slot name="cell.subscriptions" :item="it" /></span>'
      + '<slot name="actions" :item="it" /></div>'
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
    // Tool row (0): refresh + create-instance. Instance row (1): refresh + edit + delete.
    expect(rows[0].findAll('.cog button')).toHaveLength(2)
    expect(rows[0].findAll('.cog button').some((b) => b.text().includes('Create instance'))).toBe(true)
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

  it('shows a computed health dot + bi-colour bar per stat card', async () => {
    // Two instances — one up, one down → the instance/total cards are mixed.
    globalThis.fetch = vi.fn((url, opts) =>
      Promise.resolve((opts?.method || 'GET') === 'GET'
        ? jsonResponse([
          { id: 'service:build:jenkins:1', name: 'up', status: 'UP' },
          { id: 'service:build:jenkins:2', name: 'down', status: 'DOWN' },
        ])
        : jsonResponse('UP')))
    const w = mountView()
    await flushPromises()

    // One LjStatus dot per stat card (total / service / tool / instance / subscriptions).
    expect(w.findAll('.stat .lj-status')).toHaveLength(5)
    // Instance card (last): 1 up + 1 down → warn dot, red segment at 50%.
    const instanceCard = w.findAll('.stat')[3]
    expect(instanceCard.find('.lj-status--warn').exists()).toBe(true)
    expect(instanceCard.find('.sbar .up').attributes('style')).toContain('width: 50%')
    expect(instanceCard.find('.sbar .down').attributes('style')).toContain('width: 50%')
    // Service card: no such nodes → idle dot, empty bar.
    expect(w.findAll('.stat')[1].find('.lj-status--idle').exists()).toBe(true)
  })

  it('derives tool/service health from instances; no-status is never an error', async () => {
    // jenkins (tool) has a healthy instance; git (tool) has NO instances but a
    // failed direct probe. build (service) covers jenkins; scm covers git.
    globalThis.fetch = vi.fn((url, opts) =>
      Promise.resolve((opts?.method || 'GET') === 'GET'
        ? jsonResponse([
          { id: 'service:build' },
          { id: 'service:build:jenkins' },
          { id: 'service:build:jenkins:1', name: 'inst', status: 'UP', refined: { id: 'service:build:jenkins', refined: { id: 'service:build' } } },
          { id: 'service:scm' },
          { id: 'service:scm:git', status: 'DOWN' },
        ])
        : jsonResponse('UP')))
    const w = mountView()
    await flushPromises()
    const cards = w.findAll('.stat') // total · service · tool · instance

    // Tool card: jenkins healthy (via its instance) + git "no status data"
    // (its own DOWN probe is ignored) → GREEN, not error; red segment empty.
    const tool = cards[2]
    expect(tool.find('.lj-status--ok').exists()).toBe(true)
    expect(tool.find('.lj-status--error').exists()).toBe(false)
    expect(tool.find('.sbar .down').attributes('style')).toContain('width: 0%')
    const tip = tool.find('.lj-status').attributes('aria-label')
    expect(tip).toContain('1 healthy')
    expect(tip).toContain('1 no status data')

    // Service card: build healthy (descendant instance) + scm no-status → green.
    expect(cards[1].find('.lj-status--ok').exists()).toBe(true)
    expect(cards[1].find('.lj-status').attributes('aria-label')).toContain('1 no status data')
  })

  it('shows attached-subscription counts per node and a Subscriptions KPI', async () => {
    globalThis.fetch = vi.fn((url, opts) => {
      const method = opts?.method || 'GET'
      if (method !== 'GET') return Promise.resolve(jsonResponse('UP'))
      if (String(url).includes('status/subscription')) {
        return Promise.resolve(jsonResponse([
          { node: 'service:build:jenkins:1', values: { total: 3, UP: 2, DOWN: 1 } },
          { node: 'service:build:jenkins', values: { total: 1, UP: 1 } },
        ]))
      }
      return Promise.resolve(jsonResponse([TOOL, INSTANCE]))
    })
    const w = mountView()
    await flushPromises()

    // Per-node counts in the subscriptions column (row 0 = tool, row 1 = instance).
    const rows = w.findAll('.row')
    expect(rows[0].find('.subs-cell').text()).toBe('1')
    expect(rows[1].find('.subs-cell').text()).toBe('3')
    // A fifth, non-clickable KPI card totals the attached subscriptions (3 + 1).
    const cards = w.findAll('.stat')
    expect(cards).toHaveLength(5)
    expect(cards[4].find('.snum').text()).toBe('4')
    expect(cards[4].classes()).toContain('static')
    // The async fetch hit the statistics endpoint.
    expect(globalThis.fetch.mock.calls.some((c) => String(c[0]).includes('rest/node/status/subscription'))).toBe(true)
  })
})
