import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SubscriptionGroupCard from '../components/SubscriptionGroupCard.vue'

function makeGroup(extra = {}) {
  return {
    key: 'service:prov:aws',
    name: 'Provisioning AWS',
    kind: 'cloud',
    color: '#ff7a18',
    icon: () => null,
    health: 0.5,
    rows: [{ name: 'p1', status: 'ok', pills: [], sub: { id: 1, node: { id: 'service:prov:aws:enedis' } } }],
    nodeIds: ['service:prov:aws:enedis'],
    subIds: [1],
    ...extra,
  }
}

function mountCard(group) {
  return mount(SubscriptionGroupCard, {
    props: { group },
    global: {
      // The status dot lives inside a v-tooltip #activator slot; the stub renders
      // just that slot so `.nsb-dot` is present without the tooltip bodies.
      stubs: {
        'v-icon': true,
        'v-tooltip': { template: '<div><slot name="activator" :props="{}" /></div>' },
        'v-expand-transition': true,
        PluginFeatures: true,
      },
      directives: { appear: {} },
    },
  })
}

describe('SubscriptionGroupCard — status badge', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('renders the badge when node status is present', () => {
    const w = mountCard(makeGroup({ instanceStatus: { total: 4, up: 3, down: 1, unknown: 0 } }))
    expect(w.find('.nsb-dot').exists()).toBe(true)
    expect(w.find('.barh').exists()).toBe(false)
  })

  it('renders the badge when only subscription status is present', () => {
    const w = mountCard(makeGroup({ subStatus: { total: 4, up: 4, down: 0, unknown: 0 } }))
    expect(w.find('.nsb-dot').exists()).toBe(true)
  })

  it('click emits refresh-node {kind:node}; shift+click emits {kind:subscription}', async () => {
    const w = mountCard(makeGroup({ instanceStatus: { total: 4, up: 3, down: 1, unknown: 0 } }))
    await w.find('.nsb-dot').trigger('click')
    await w.find('.nsb-dot').trigger('click', { shiftKey: true })
    expect(w.emitted('refresh-node')[0][0]).toEqual({
      key: 'service:prov:aws', nodeIds: ['service:prov:aws:enedis'], subIds: [1], kind: 'node',
    })
    expect(w.emitted('refresh-node')[1][0]).toEqual({
      key: 'service:prov:aws', nodeIds: ['service:prov:aws:enedis'], subIds: [1], kind: 'subscription',
    })
  })

  it('falls back to the health bar when no stats are present', () => {
    const w = mountCard(makeGroup())
    expect(w.find('.nsb-dot').exists()).toBe(false)
    expect(w.find('.barh').exists()).toBe(true)
  })
})
