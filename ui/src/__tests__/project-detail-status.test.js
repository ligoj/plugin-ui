/*
 * The status badge of the project page, in the status column header of its subscriptions: the statuses of the
 * subscriptions and of the instances they use, refreshed like the badge of a home page tool card.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'
import enMessages from '../i18n/en.js'

const SONAR = { id: 'service:qa:sonarqube:local', name: 'Sonar', refined: { id: 'service:qa:sonarqube', name: 'SonarQube' } }
const JENKINS = { id: 'service:build:jenkins:local', name: 'Jenkins', refined: { id: 'service:build:jenkins', name: 'Jenkins' } }
const PROJECT = { id: 401, name: 'P', subscriptions: [
  { id: 1, status: 'UP', node: SONAR },
  { id: 2, status: 'DOWN', node: SONAR },
  { id: 3, node: JENKINS },
] }
// GET rest/node/status: service → tool → instance, the own status of each node in `value`
const NODE_STATUS = [{ node: { id: 'service:qa' }, specifics: [{ node: { id: 'service:qa:sonarqube' }, specifics: [{ node: { id: SONAR.id }, value: 'UP' }] }] }]

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
let release
function mockApi() {
  const refreshed = new Promise((resolve) => { release = resolve })
  globalThis.fetch = vi.fn((url, opts) => {
    const u = String(url)
    if (u.includes('subscription/status/refresh')) return refreshed.then(() => json({ 3: { id: 3, status: 'UP' } }))
    if ((opts?.method || 'GET') === 'POST') return Promise.resolve({ ok: true, status: 204, headers: { get: () => null }, json: () => Promise.resolve(null), text: () => Promise.resolve('') })
    if (u.includes('rest/node/status')) return Promise.resolve(json(NODE_STATUS))
    return Promise.resolve(json(PROJECT))
  })
}
async function mountPage() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/project/:id', component: { template: '<div />' } }] })
  await router.push('/project/401')
  const w = mount(ProjectDetailView, { shallow: true, global: { plugins: [router] } })
  await flushPromises()
  return w
}
const calls = (method) => globalThis.fetch.mock.calls.filter(([, o]) => (o?.method || 'GET') === method).map(([u]) => String(u))
// The subscription refresh calls the tools and stores the statuses: POST, the GET twin is deprecated
const subRefreshes = () => calls('POST').filter((u) => u.includes('subscription/status/refresh')).length
const nodeRefreshes = () => calls('POST').filter((u) => u.includes('node/status/refresh'))
const REFRESH = { method: 'POST', pattern: '^rest/subscription/status/([0-9]+/)?refresh$' }

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  mockApi()
})

describe('ProjectDetailView status badge', () => {
  it('counts the statuses of the subscriptions and of their instances, refreshing while the subscriptions refresh', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountPage()
    const panel = w.findComponent(SubscriptionsPanel)
    expect(panel.props('status')).toEqual({
      subStats: { total: 3, up: 1, down: 1, unknown: 1 },
      nodeStats: { total: 2, up: 1, down: 0, unknown: 1 },
      refreshing: true, hint: null, readonly: false,
    })
    release()
    await flushPromises()
    expect(panel.props('status')).toMatchObject({ subStats: { total: 3, up: 2, down: 1, unknown: 0 }, refreshing: false })
  })

  it('refreshes the instances on click and the subscriptions on Shift+click', async () => {
    useAuthStore().session = { admin: true }
    const w = await mountPage()
    release()
    await flushPromises()
    const panel = w.findComponent(SubscriptionsPanel)
    const nodeLoads = () => calls('GET').filter((u) => u.endsWith('rest/node/status')).length
    const loadsBefore = nodeLoads()

    panel.vm.$emit('refresh-status', false)
    await flushPromises()
    expect(nodeRefreshes()).toEqual([`rest/node/status/refresh/${encodeURIComponent(SONAR.id)}`, `rest/node/status/refresh/${encodeURIComponent(JENKINS.id)}`])
    expect(nodeLoads()).toBe(loadsBefore + 1)

    const before = subRefreshes()
    panel.vm.$emit('refresh-status', true)
    await flushPromises()
    expect(subRefreshes()).toBe(before + 1)
    expect(calls('GET').filter((u) => u.includes('status/refresh'))).toEqual([])
  })

  it('refreshes the subscriptions on any click for a user who may not refresh the instances', async () => {
    useAuthStore().session = { roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/.*' }, REFRESH] }
    const w = await mountPage()
    release()
    await flushPromises()
    const panel = w.findComponent(SubscriptionsPanel)
    expect(panel.props('status')).toMatchObject({ hint: 'Click: subscriptions', readonly: false })
    const before = subRefreshes()
    panel.vm.$emit('refresh-status', false)
    await flushPromises()
    expect(nodeRefreshes()).toEqual([])
    expect(subRefreshes()).toBe(before + 1)
  })

  it('shows the statuses only to a user who may refresh nothing', async () => {
    useAuthStore().session = { roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/(project|node).*' }] }
    const w = await mountPage()
    expect(w.findComponent(SubscriptionsPanel).props('status')).toMatchObject({ readonly: true })
    // Reading the subscriptions does not allow refreshing them
    useAuthStore().session = { roles: ['USER'], apiAuthorizations: [{ method: 'GET', pattern: '^rest/.*' }] }
    const read = await mountPage()
    expect(read.findComponent(SubscriptionsPanel).props('status')).toMatchObject({ readonly: true })
  })
})
