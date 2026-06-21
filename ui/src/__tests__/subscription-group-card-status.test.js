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
    ...extra,
  }
}

function mountCard(group) {
  return mount(SubscriptionGroupCard, {
    props: { group },
    global: {
      // The bar/segment/count/refresh chrome lives in the child StatusStatBar
      // (mounted deeply); v-tooltip / v-icon are stubbed away.
      stubs: { 'v-icon': true, 'v-tooltip': true, 'v-expand-transition': true, PluginFeatures: true },
      directives: { appear: {} },
    },
  })
}

describe('SubscriptionGroupCard — status statistics bars', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('renders the subscription bar from group.nodeStatus', () => {
    const w = mountCard(makeGroup({ nodeStatus: { total: 10, up: 7, down: 2, noStatus: 1 } }))
    expect(w.find('.sb-bar').exists()).toBe(true)
    // The legacy health bar is replaced by the status bar.
    expect(w.find('.barh').exists()).toBe(false)
    // Segment widths are proportional to the totals (7/10, 1/10, 2/10).
    expect(w.find('.seg.up').attributes('style')).toContain('width: 70%')
    expect(w.find('.seg.nost').attributes('style')).toContain('width: 10%')
    expect(w.find('.seg.down').attributes('style')).toContain('width: 20%')
    expect(w.find('.sb-count').text()).toBe('7/10')
  })

  it('emits refresh-node {kind:subscription} when the subscription bar button is clicked', async () => {
    const w = mountCard(makeGroup({ nodeStatus: { total: 10, up: 7, down: 2, noStatus: 1 } }))
    await w.find('.sb-refresh').trigger('click')
    expect(w.emitted('refresh-node')).toBeTruthy()
    expect(w.emitted('refresh-node')[0][0]).toEqual({
      key: 'service:prov:aws',
      nodeIds: ['service:prov:aws:enedis'],
      kind: 'subscription',
    })
  })

  it('renders the instance bar from group.instanceStatus and emits {kind:node}', async () => {
    const w = mountCard(makeGroup({ instanceStatus: { total: 4, up: 3, down: 1, noStatus: 0 } }))
    expect(w.find('.sb-bar').exists()).toBe(true)
    expect(w.find('.barh').exists()).toBe(false)
    expect(w.find('.seg.up').attributes('style')).toContain('width: 75%')
    expect(w.find('.sb-count').text()).toBe('3/4')
    await w.find('.sb-refresh').trigger('click')
    expect(w.emitted('refresh-node')[0][0]).toEqual({
      key: 'service:prov:aws',
      nodeIds: ['service:prov:aws:enedis'],
      kind: 'node',
    })
  })

  it('renders BOTH bars when both stats are present', () => {
    const w = mountCard(makeGroup({
      nodeStatus: { total: 10, up: 7, down: 2, noStatus: 1 },
      instanceStatus: { total: 4, up: 3, down: 1, noStatus: 0 },
    }))
    expect(w.findAll('.sb-bar')).toHaveLength(2)
    expect(w.findAll('.sb-refresh')).toHaveLength(2)
  })

  it('falls back to the health bar when no stats are present', () => {
    const w = mountCard(makeGroup())
    expect(w.find('.sb-bar').exists()).toBe(false)
    expect(w.find('.barh').exists()).toBe(true)
  })
})
