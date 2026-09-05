import { describe, it, expect } from 'vitest'
import { parseUpdates, formatInstant } from '../pluginUpdates.js'

describe('plug-in updates helpers', () => {
  it('parses the session string and the API map, sorted by artifact', () => {
    expect(parseUpdates('plugin-b:2.0, plugin-a:1.5,,broken')).toEqual([{ artifact: 'plugin-a', version: '1.5' }, { artifact: 'plugin-b', version: '2.0' }])
    expect(parseUpdates({ 'plugin-b': '2.0', 'plugin-a': '1.5' })).toEqual([{ artifact: 'plugin-a', version: '1.5' }, { artifact: 'plugin-b', version: '2.0' }])
    expect(parseUpdates('')).toEqual([])
    expect(parseUpdates(undefined)).toEqual([])
  })

  it('formats instants and tolerates absent or invalid values', () => {
    expect(formatInstant(null)).toBe('')
    expect(formatInstant('not a date')).toBe('')
    expect(formatInstant('2026-09-06T01:00:00Z', 'en-US')).toMatch(/2026/)
    expect(formatInstant(Date.UTC(2026, 8, 6), 'en-US')).toMatch(/2026/)
  })
})
