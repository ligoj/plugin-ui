/*
 * Loading indicator of the subscription rows while their live details
 * (`rest/subscription/status/refresh`) are being fetched: the status dot
 * blinks with a "loading" tooltip line and the details cell shows a skeleton,
 * in both the list and the cards views; ProjectDetailView flags its rows
 * while the refresh is in flight.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useI18nStore } from '@ligoj/host'
import SubscriptionStatus from '../components/SubscriptionStatus.vue'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'
import SubscriptionGroupCard from '../components/SubscriptionGroupCard.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import enMessages from '../i18n/en.js'

const SUB = { id: 1, status: 'UP', node: { id: 'service:build:jenkins:1', name: 'CI', refined: { id: 'service:build:jenkins', name: 'Jenkins' } } }

// The status dot stub exposes its `loading` prop for the panel/card tests
const StatusStub = { props: ['subscription', 'status', 'loading'], template: '<span class="sst" :data-loading="String(!!loading)" />' }
const TableStub = {
  props: ['headers', 'items'],
  template: '<div class="vdt"><div v-for="it in items" :key="it.id" class="row">'
    + '<slot name="cell.status" :item="it" /><span class="details"><slot name="cell.details" :item="it" /></span></div></div>',
}
const rows = [
  { name: 'a', status: 'ok', pills: [], sub: { id: 1 }, loading: true },
  { name: 'b', status: 'ok', pills: [], sub: { id: 2 }, loading: false },
]
const GROUPS = [{ key: 'tool-1', name: 'Tool 1', kind: 'kind', color: '#123456', icon: 'div', health: 1, rows }]

describe('SubscriptionStatus — loading', () => {
  beforeEach(() => { setActivePinia(createPinia()); useI18nStore().merge(enMessages, 'en') })
  const stubs = {
    'v-tooltip': { template: '<div class="tt"><slot name="activator" :props="{}" /><div class="tip"><slot /></div></div>' },
    'v-icon': true, NodeIcon: true,
  }

  it('blinks the dot and explains it in the tooltip while loading', () => {
    const w = mount(SubscriptionStatus, { props: { subscription: SUB, loading: true }, global: { stubs } })
    expect(w.find('.sst-dot').classes()).toContain('loading')
    expect(w.find('.tip').text()).toContain('Loading')
  })

  it('renders the plain dot otherwise', () => {
    const w = mount(SubscriptionStatus, { props: { subscription: SUB }, global: { stubs } })
    expect(w.find('.sst-dot').classes()).not.toContain('loading')
    expect(w.find('.tip').text()).not.toContain('Loading')
  })
})

describe('SubscriptionsPanel / SubscriptionGroupCard — loading rows', () => {
  beforeEach(() => { setActivePinia(createPinia()); useI18nStore().merge(enMessages, 'en') })

  it('list view: passes loading to the status dot and shows a details skeleton', () => {
    const w = mount(SubscriptionsPanel, {
      props: { groups: GROUPS, defaultView: 'list' },
      global: { stubs: { LjSearch: true, LjSegmented: true, PluginFeatures: true, SubscriptionStatus: StatusStub, VibrantDataTable: TableStub } },
    })
    const [r1, r2] = w.findAll('.row')
    expect(r1.find('.sst').attributes('data-loading')).toBe('true')
    expect(r1.find('.details .lsum-skel').exists()).toBe(true)
    expect(r2.find('.sst').attributes('data-loading')).toBe('false')
    expect(r2.find('.details .lsum-skel').exists()).toBe(false)
  })

  it('cards view: same on the mini rows', () => {
    const w = mount(SubscriptionGroupCard, {
      props: { group: GROUPS[0] },
      global: { stubs: { PluginFeatures: true, SubscriptionStatus: StatusStub, 'v-icon': true, 'v-expand-transition': { template: '<div><slot /></div>' } }, directives: { appear: {} } },
    })
    const [r1, r2] = w.findAll('.mrow')
    expect(r1.find('.sst').attributes('data-loading')).toBe('true')
    expect(r1.find('.m-sum .lsum-skel').exists()).toBe(true)
    expect(r2.find('.sst').attributes('data-loading')).toBe('false')
    expect(r2.find('.m-sum .lsum-skel').exists()).toBe(false)
  })
})

describe('ProjectDetailView — rows load their details', () => {
  beforeEach(() => { setActivePinia(createPinia()); useI18nStore().merge(enMessages, 'en') })

  it('flags every row as loading while the status refresh is in flight, then clears', async () => {
    const project = { id: 401, name: 'P', subscriptions: [SUB, { ...SUB, id: 2, node: { ...SUB.node, id: 'service:build:jenkins:2' } }] }
    let resolveRefresh
    const refresh = new Promise((r) => { resolveRefresh = r })
    globalThis.fetch = vi.fn((url) => {
      const json = (body) => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) })
      if (String(url).includes('status/refresh')) return refresh.then(json)
      return Promise.resolve(json(project))
    })
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/project/:id', component: { template: '<div />' } }] })
    await router.push('/project/401')
    const w = mount(ProjectDetailView, { shallow: true, global: { plugins: [router] } })
    await flushPromises()

    const panel = () => w.findComponent(SubscriptionsPanel)
    const rowsOf = () => panel().props('groups').flatMap((g) => g.rows)
    expect(rowsOf()).toHaveLength(2)
    expect(rowsOf().every((r) => r.loading === true)).toBe(true)

    resolveRefresh({ 1: { status: 'UP', data: { x: 1 }, parameters: {} }, 2: { status: 'DOWN', data: {}, parameters: {} } })
    await flushPromises()
    expect(rowsOf().every((r) => r.loading === false)).toBe(true)
    expect(rowsOf().map((r) => r.status)).toEqual(['ok', 'err'])
  })
})
