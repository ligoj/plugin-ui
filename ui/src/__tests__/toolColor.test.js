import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { _resetToolColorCache, fallbackToolColor } from '@ligoj/host'
import { toolColor, _resetToolColors } from '../toolColor.js'

const COGNITO = '<svg><path fill="url(#a)"/><path fill="#ffffff"/><defs><linearGradient id="a"><stop stop-color="#ff5252"/><stop offset="1" stop-color="#bd0816"/></linearGradient></defs></svg>'

describe('toolColor() — shared reactive tool colour', () => {
  beforeEach(() => { _resetToolColors(); _resetToolColorCache() })

  it('answers the name colour first, then the icon colour once the SVG is read', async () => {
    globalThis.fetch = vi.fn(async (url) => ({ ok: String(url).endsWith('/cognito.svg'), text: async () => COGNITO }))
    const node = { id: 'service:id:cognito', name: 'AWS Cognito' }
    expect(toolColor(node)).toBe(fallbackToolColor('AWS Cognito'))
    await flushPromises(); await nextTick()
    expect(toolColor(node)).toBe('#bd0816')
    // Same tool through an instance node: no second fetch
    expect(toolColor({ id: 'service:id:cognito:saas', name: 'AWS Cognito' })).toBe(fallbackToolColor('AWS Cognito'))
    await flushPromises()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('keeps the known brand colour when the icon has no usable colour', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, text: async () => '<svg><path fill="#000"/></svg>' }))
    const node = { id: 'service:build:jenkins', name: 'Jenkins' }
    expect(toolColor(node)).toBe('#d33833')
    await flushPromises()
    expect(toolColor(node)).toBe('#d33833')
  })
})
