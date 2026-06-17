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
      stubs: { 'v-icon': true, 'v-expand-transition': true, PluginFeatures: true },
      directives: { appear: {} },
    },
  })
}

describe('SubscriptionGroupCard — global node status', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('renders the 3-state bar from group.nodeStatus', () => {
    const w = mountCard(makeGroup({ nodeStatus: { total: 10, up: 7, down: 2, noStatus: 1 } }))
    expect(w.find('.nbar').exists()).toBe(true)
    // The legacy health bar is replaced by the status bar.
    expect(w.find('.barh').exists()).toBe(false)
    // Segment widths are proportional to the totals (7/10, 1/10, 2/10).
    expect(w.find('.seg.up').attributes('style')).toContain('width: 70%')
    expect(w.find('.seg.nost').attributes('style')).toContain('width: 10%')
    expect(w.find('.seg.down').attributes('style')).toContain('width: 20%')
    expect(w.find('.ncount').text()).toBe('7/10')
  })

  it('emits refresh-node with the group key and node ids on button click', async () => {
    const w = mountCard(makeGroup({ nodeStatus: { total: 10, up: 7, down: 2, noStatus: 1 } }))
    await w.find('.nrefresh').trigger('click')
    expect(w.emitted('refresh-node')).toBeTruthy()
    expect(w.emitted('refresh-node')[0][0]).toEqual({
      key: 'service:prov:aws',
      nodeIds: ['service:prov:aws:enedis'],
    })
  })

  it('falls back to the health bar when no nodeStatus is present', () => {
    const w = mountCard(makeGroup())
    expect(w.find('.nbar').exists()).toBe(false)
    expect(w.find('.barh').exists()).toBe(true)
  })
})
