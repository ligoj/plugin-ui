import { describe, it, expect } from 'vitest'
import { isAvailable, isSubscriptionOpen, restoreMode, toggleModePayload } from '../pluginToggle.js'

describe('plugin view enable/disable switch (subscription mode of the node)', () => {
  it('reads the switch state from the subscription mode, ALL by default', () => {
    expect(isSubscriptionOpen({ mode: 'all' })).toBe(true)
    expect(isSubscriptionOpen({ mode: 'LINK' })).toBe(true)
    expect(isSubscriptionOpen({})).toBe(true)
    expect(isSubscriptionOpen(null)).toBe(true)
    expect(isSubscriptionOpen({ mode: 'none' })).toBe(false)
    expect(isSubscriptionOpen({ mode: 'NONE' })).toBe(false)
  })

  it('reads the availability from the derived NodeVo.enabled', () => {
    expect(isAvailable({ enabled: true })).toBe(true)
    expect(isAvailable({})).toBe(true)
    expect(isAvailable(null)).toBe(true)
    expect(isAvailable({ enabled: false })).toBe(false)
  })

  it('restores the refined node mode when enabling: a node mode cannot exceed its parent one', () => {
    expect(restoreMode({ refined: { id: 'service:build', mode: 'link' } })).toBe('link')
    expect(restoreMode({ refined: { id: 'service:build', mode: 'ALL' } })).toBe('all')
    expect(restoreMode({ refined: { id: 'service:build' } })).toBe('all')
    expect(restoreMode({ id: 'service:id' })).toBe('all')
    // A NONE parent blocks enabling
    expect(restoreMode({ refined: { id: 'service:build', mode: 'none' } })).toBeNull()
  })

  it('builds a PUT rest/node payload toggling only the mode, without any `enabled` property', () => {
    const node = { id: 'service:build:jenkins', name: 'Jenkins', mode: 'all', refined: { id: 'service:build', mode: 'link' }, parameters: { x: 1 } }
    expect(toggleModePayload(node, false)).toEqual({ id: 'service:build:jenkins', node: 'service:build', name: 'Jenkins', mode: 'none', untouchedParameters: true })
    expect(toggleModePayload(node, true)).toEqual({ id: 'service:build:jenkins', node: 'service:build', name: 'Jenkins', mode: 'link', untouchedParameters: true })
    expect(toggleModePayload({ id: 'service:id', name: 'Identity' }, true)).toEqual({ id: 'service:id', node: undefined, name: 'Identity', mode: 'all', untouchedParameters: true })
  })
})
