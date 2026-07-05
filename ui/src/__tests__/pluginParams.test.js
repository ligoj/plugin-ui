import { describe, it, expect } from 'vitest'
import { buildParamWire, coerce, selectValue } from '../utils/pluginParams.js'

const selectParam = { id: 'p', type: 'SELECT', values: ['docker', 'maven', 'nuget'] }

describe('pluginParams SELECT handling', () => {
  it('buildParamWire persists a SELECT by its option index', () => {
    expect(buildParamWire(selectParam, 'maven')).toEqual({ parameter: 'p', index: 1 })
    expect(buildParamWire(selectParam, 'docker')).toEqual({ parameter: 'p', index: 0 })
    // Already an index (defensive) → kept.
    expect(buildParamWire(selectParam, '2')).toEqual({ parameter: 'p', index: 2 })
    // Optional + empty → omitted from the wire.
    expect(buildParamWire(selectParam, '')).toBeNull()
  })

  it('buildParamWire keeps the other wire shapes intact', () => {
    expect(buildParamWire({ id: 'i', type: 'INTEGER' }, '5')).toEqual({ parameter: 'i', integer: 5 })
    expect(buildParamWire({ id: 'b', type: 'BOOL' }, true)).toEqual({ parameter: 'b', bool: true })
    expect(buildParamWire({ id: 'm', type: 'MULTIPLE' }, ['a'])).toEqual({ parameter: 'm', selections: ['a'] })
    expect(buildParamWire({ id: 't', type: 'TEXT' }, 'x')).toEqual({ parameter: 't', text: 'x' })
  })

  it('selectValue resolves an option index to its value, passing values through', () => {
    expect(selectValue(selectParam, '1')).toBe('maven')
    expect(selectValue(selectParam, 'docker')).toBe('docker') // already a value
    expect(selectValue(selectParam, '9')).toBe('9')           // out of range → unchanged
  })

  it('coerce maps a SELECT default (index or value) to the option value', () => {
    expect(coerce({ type: 'SELECT', values: ['docker', 'maven'], defaultValue: '1' })).toBe('maven')
    expect(coerce({ type: 'SELECT', values: ['docker', 'maven'], defaultValue: 'docker' })).toBe('docker')
    expect(coerce({ type: 'INTEGER', defaultValue: '3' })).toBe(3)
    expect(coerce({ type: 'BOOL', defaultValue: 'true' })).toBe(true)
  })
})
