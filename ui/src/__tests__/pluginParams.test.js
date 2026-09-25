import { describe, it, expect } from 'vitest'
import { buildParamWire, coerce, selectValue, isDeprecated, deprecationNotice, missingMandatory } from '../utils/pluginParams.js'

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

describe('pluginParams deprecation', () => {
  it('isDeprecated reads the definition flag only', () => {
    expect(isDeprecated({ id: 'p', deprecated: true })).toBe(true)
    expect(isDeprecated({ id: 'p', deprecated: false })).toBe(false)
    expect(isDeprecated({ id: 'p' })).toBe(false)
    expect(isDeprecated(null)).toBe(false)
  })

  it('deprecationNotice prefers the plugin <id>-deprecated key, else the generic text', () => {
    const t = (key) => (key === 'service:id:ldap:people-custom-attributes-deprecated' ? 'Use the service parameter' : null)
    expect(deprecationNotice({ id: 'service:id:ldap:people-custom-attributes', deprecated: true }, t, 'Deprecated parameter')).toBe('Use the service parameter')
    expect(deprecationNotice({ id: 'service:id:ldap:other', deprecated: true }, t, 'Deprecated parameter')).toBe('Deprecated parameter')
    expect(deprecationNotice({ id: 'service:id:ldap:other' }, t, 'Deprecated parameter')).toBeNull()
  })
})

describe('missingMandatory — mandatory parameters without an effective value', () => {
  const job = { id: 'service:build:jenkins:job', type: 'TEXT', mandatory: true }
  const folder = { id: 'service:build:jenkins:template-folder', type: 'TEXT', mandatory: false }
  const count = { id: 'p:count', type: 'INTEGER', required: true }
  const tags = { id: 'p:tags', type: 'TAGS', mandatory: true }

  it('reports a mandatory parameter left blank, whatever the input rendering it', () => {
    expect(missingMandatory([job, folder], { [job.id]: '', [folder.id]: '{}' })).toEqual([job])
    expect(missingMandatory([job, folder], { [job.id]: '   ' })).toEqual([job])
    expect(missingMandatory([job, folder], {})).toEqual([job])
    expect(missingMandatory([job, count, tags], { [job.id]: 'Admin', [count.id]: 0, [tags.id]: [] })).toEqual([tags])
  })

  it('is empty when every mandatory parameter carries a value', () => {
    expect(missingMandatory([job, folder], { [job.id]: 'Admin' })).toEqual([])
    expect(missingMandatory([count, tags], { [count.id]: 3, [tags.id]: ['a'] })).toEqual([])
    expect(missingMandatory([], {})).toEqual([])
  })
})
