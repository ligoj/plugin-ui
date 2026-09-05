import { describe, it, expect } from 'vitest'
import { pluginStats, pct } from '../pluginStats.js'

const rows = [
  { type: 'service', statusKey: 'active', enabled: true, loaded: true, signature: { status: 'VERIFIED' } },
  { type: 'tool', statusKey: 'active', enabled: true, loaded: true, signature: { status: 'SIGNED' } },
  { type: 'tool', statusKey: 'disabling', enabled: false, loaded: true, signature: null },
  { type: 'feature', statusKey: 'disabled', enabled: false, loaded: false, signature: { status: 'INVALID' } },
  { type: 'feature', statusKey: 'enabling', enabled: true, loaded: false },
]

describe('plugin view summary figures', () => {
  it('tallies the distributions by type, state and signature, plus the enabled/loaded rates', () => {
    const s = pluginStats(rows)
    expect(s.total).toBe(5)
    expect(s.types).toEqual({ service: 1, tool: 2, feature: 2 })
    expect(s.states).toEqual({ active: 2, enabling: 1, disabling: 1, disabled: 1, pending: 0, deleted: 0 })
    expect(s.enabled).toBe(3)
    expect(s.loaded).toBe(3)
    // Missing signature counts as unsigned
    expect(s.signatures).toEqual({ VERIFIED: 1, SIGNED: 1, UNSIGNED: 2, INVALID: 1 })
  })

  it('computes safe percentages', () => {
    expect(pct(3, 5)).toBe(60)
    expect(pct(1, 3)).toBe(33)
    expect(pct(0, 0)).toBe(0)
    expect(pluginStats([]).total).toBe(0)
  })
})
