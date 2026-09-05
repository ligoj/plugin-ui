import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SubscriptionGroupCard from '../components/SubscriptionGroupCard.vue'

const group = {
  key: 'service:build:jenkins', name: 'Jenkins', kind: 'ci', color: '#ff7a18', icon: () => null, health: 1,
  rows: [
    { name: 'Bank — KYC', status: 'ok', pills: ['#1842'], sub: { id: 1, parameters: { 'service:build:jenkins:job': 'kyc-nightly', 'service:build:jenkins:api-token': 'SECRET' } } },
    { name: 'Datasync', status: 'ok', pills: [], sub: { id: 2, parameters: { 'service:build:jenkins:job': 'datasync-release' } } },
  ],
  nodeIds: [], subIds: [1, 2],
}

function mountCard() {
  return mount(SubscriptionGroupCard, {
    props: { group },
    global: {
      stubs: { 'v-icon': true, 'v-tooltip': { template: '<div><slot name="activator" :props="{}" /></div>' }, 'v-expand-transition': { template: '<div><slot /></div>' }, PluginFeatures: true },
      directives: { appear: {} },
    },
  })
}

describe('SubscriptionGroupCard — per-tool search', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('expands on click and filters the rows by name, pills and non-secured parameters', async () => {
    const w = mountCard()
    expect(w.find('.csearch-box').exists()).toBe(false)
    expect(w.findAll('.mrow:not(.mempty)')).toHaveLength(2)
    await w.find('.csearch-btn').trigger('click')
    expect(w.find('.csearch-box').exists()).toBe(true)

    w.vm.query = 'NIGHTLY' // parameter value, case-insensitive
    await nextTick()
    expect(w.findAll('.mrow:not(.mempty)')).toHaveLength(1)
    expect(w.find('.mlabel').text()).toBe('Bank — KYC')
    expect(w.find('.count').text()).toBe('1/2')

    w.vm.query = '1842' // pill
    await nextTick()
    expect(w.findAll('.mrow:not(.mempty)')).toHaveLength(1)

    w.vm.query = 'secret' // secured parameter: never matched
    await nextTick()
    expect(w.findAll('.mrow:not(.mempty)')).toHaveLength(0)
    expect(w.find('.mempty').exists()).toBe(true)

    // Closing clears the query and restores every row
    await w.find('.csearch-btn').trigger('click')
    expect(w.find('.csearch-box').exists()).toBe(false)
    expect(w.findAll('.mrow:not(.mempty)')).toHaveLength(2)
    expect(w.find('.count').text()).toBe('2')
  })
})
