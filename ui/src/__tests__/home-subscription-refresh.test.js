/*
 * HomeView: the live details of a subscription, read when its row appears, and the Shift+click refresh of the
 * subscriptions of a group. Both call the tools and store the statuses: POST, the GET twins are deprecated.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import enMessages from '../i18n/en.js'
import HomeView from '../views/HomeView.vue'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const calls = (method) => globalThis.fetch.mock.calls.filter(([, o]) => (o?.method || 'GET') === method).map(([u]) => String(u))

async function mountHome() {
  const w = mount(HomeView, { shallow: true })
  await flushPromises()
  return w
}

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  globalThis.fetch = vi.fn((url) => Promise.resolve(json(String(url).includes('status/refresh') ? { 1: { id: 1, status: 'UP' } } : {})))
})
afterEach(() => vi.useRealTimers())

describe('HomeView subscription refresh', () => {
  it('reads the details of the appearing rows with POST', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const w = await mountHome()
    w.findComponent(SubscriptionsPanel).vm.$emit('row-appear', { id: 1 })
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    expect(calls('POST')).toEqual(['rest/subscription/status/refresh?id=1'])
    expect(calls('GET').filter((u) => u.includes('status/refresh'))).toEqual([])
  })

  it('refreshes the subscriptions of a group with POST on Shift+click', async () => {
    const w = await mountHome()
    w.findComponent(SubscriptionsPanel).vm.$emit('refresh-node', { key: 'service:bt:jira', kind: 'subscription', subIds: [1, 2] })
    await flushPromises()
    expect(calls('POST').sort()).toEqual(['rest/subscription/status/1/refresh', 'rest/subscription/status/2/refresh'])
  })
})
