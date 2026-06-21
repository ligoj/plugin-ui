import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import NodeStatusBadge from '../components/NodeStatusBadge.vue'

// Render both the activator (the dot) and the default slot (the tooltip body).
const vtooltip = { template: '<div><slot name="activator" :props="{}" /><slot /></div>' }
function mountBadge(props) {
  return mount(NodeStatusBadge, {
    props,
    global: { stubs: { 'v-icon': true, 'v-tooltip': vtooltip } },
  })
}

describe('NodeStatusBadge', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('is ok (green) when every node AND subscription item is up', () => {
    const w = mountBadge({ nodeStats: { total: 2, up: 2, down: 0, unknown: 0 }, subStats: { total: 3, up: 3, down: 0, unknown: 0 } })
    expect(w.find('.nsb-dot').classes()).toContain('ok')
  })
  it('is error (red) when everything is down', () => {
    const w = mountBadge({ nodeStats: { total: 2, up: 0, down: 2, unknown: 0 }, subStats: { total: 1, up: 0, down: 1, unknown: 0 } })
    expect(w.find('.nsb-dot').classes()).toContain('error')
  })
  it('is warn when some are ko (mixed across node + subscription)', () => {
    const w = mountBadge({ nodeStats: { total: 2, up: 2, down: 0, unknown: 0 }, subStats: { total: 2, up: 1, down: 1, unknown: 0 } })
    expect(w.find('.nsb-dot').classes()).toContain('warn')
  })
  it('is idle when nothing is known', () => {
    const w = mountBadge({ nodeStats: { total: 0, up: 0, down: 0, unknown: 0 }, subStats: null })
    expect(w.find('.nsb-dot').classes()).toContain('idle')
  })

  it('shows BOTH sections, each row with value + percentage, hiding 0%/100%', () => {
    const w = mountBadge({
      subStats: { total: 4, up: 3, down: 1, unknown: 0 },  // up 75%, down 25%
      nodeStats: { total: 2, up: 2, down: 0, unknown: 0 }, // up 100% → hidden
    })
    expect(w.findAll('.nsb-title')).toHaveLength(2) // Subscriptions + Instances headers
    // Each section keeps a full progress bar (segments sum to 100%).
    expect(w.findAll('.nsb-bar')).toHaveLength(2)
    const firstUp = w.findAll('.nsb-bar')[0].find('.seg.up')
    expect(firstUp.attributes('style')).toContain('width: 75%')
    const rows = w.findAll('.nsb-row')
    expect(rows).toHaveLength(2) // subscriptions up+down; instances all-up → no rows
    expect(rows[0].find('.nsb-val').text()).toBe('3')
    expect(rows[0].find('.nsb-pct').text()).toBe('75%')
    expect(rows[1].find('.nsb-val').text()).toBe('1')
    expect(rows[1].find('.nsb-pct').text()).toBe('25%')
  })

  it('emits refresh(false) on click and refresh(true) on shift+click', async () => {
    const w = mountBadge({ nodeStats: { total: 1, up: 1, down: 0, unknown: 0 }, subStats: null })
    await w.find('.nsb-dot').trigger('click')
    await w.find('.nsb-dot').trigger('click', { shiftKey: true })
    expect(w.emitted('refresh')[0]).toEqual([false])
    expect(w.emitted('refresh')[1]).toEqual([true])
  })
})
