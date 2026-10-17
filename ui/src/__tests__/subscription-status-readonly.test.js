/*
 * SubscriptionStatus `readonly`: the status only, for a dot inside another
 * control (the subscribe wizard's instance select). No refresh, no refresh
 * hint, and the click goes on to the control.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import SubscriptionStatus from '../components/SubscriptionStatus.vue'
import enMessages from '../i18n/en.js'

const NODE = { id: 'service:qa:sonarqube:cloud', name: 'Cloud', status: 'up' }
const stubs = {
  'v-tooltip': { template: '<div class="tt"><slot name="activator" :props="{}" /><div class="tip"><slot /></div></div>' },
  'v-icon': true, NodeIcon: true,
}
// The dot inside a control that reacts to clicks
function mountInHost(readonly) {
  return mount({
    components: { SubscriptionStatus },
    data: () => ({ hits: 0, node: NODE, readonly }),
    template: '<div class="host" @click="hits++"><SubscriptionStatus :node="node" :readonly="readonly" /></div>',
  }, { global: { stubs } })
}
const posts = () => globalThis.fetch.mock.calls.filter((c) => c[1]?.method === 'POST').map((c) => String(c[0]))

describe('SubscriptionStatus — readonly', () => {
  let t
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    t = useI18nStore().t
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200, headers: { get: () => 'text/plain' }, text: () => Promise.resolve('"up"'), json: () => Promise.resolve('up') }))
  })

  it('refreshes an instance on click by default, without reaching the host', async () => {
    const w = mountInHost(false)
    expect(w.find('.sst-dot').classes()).toContain('clickable')
    expect(w.find('.tip').text()).toContain(t('subscription.tip.clickRefresh'))
    await w.find('.sst-dot').trigger('click')
    await flushPromises()
    expect(posts()).toEqual(['rest/node/status/refresh/service%3Aqa%3Asonarqube%3Acloud'])
    expect(w.vm.hits).toBe(0)
  })

  it('refreshes a subscription on click with POST, the GET twin being deprecated', async () => {
    const w = mount(SubscriptionStatus, { props: { subscription: { id: 7, status: 'UP', node: NODE } }, global: { stubs } })
    await w.find('.sst-dot').trigger('click')
    await flushPromises()
    expect(posts()).toEqual(['rest/subscription/status/7/refresh'])
  })

  it('readonly: shows the status only, and the click goes on to the host', async () => {
    const w = mountInHost(true)
    expect(w.find('.sst-dot').classes()).toEqual(expect.arrayContaining(['sst-dot', 'ok']))
    expect(w.find('.sst-dot').classes()).not.toContain('clickable')
    expect(w.find('.sst-dot').attributes('role')).toBeUndefined()
    expect(w.find('.tip').text()).toContain('up')
    expect(w.find('.tip').text()).not.toContain(t('subscription.tip.clickRefresh'))
    await w.find('.sst-dot').trigger('click')
    await flushPromises()
    expect(posts()).toEqual([])
    expect(w.vm.hits).toBe(1)
  })
})
