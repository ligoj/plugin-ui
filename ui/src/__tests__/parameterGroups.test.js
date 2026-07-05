import { describe, it, expect } from 'vitest'
import { groupParameters } from '../utils/parameterGroups.js'

// Display-name accessor used by the wizard (translated label, else id).
const name = (p) => p.name || p.id

describe('groupParameters', () => {
  it('default (no layout): a single unlabeled group ordered by name ascending', () => {
    const params = [{ id: 'c', name: 'Zoo' }, { id: 'a', name: 'Alpha' }, { id: 'b', name: 'Mid' }]
    const groups = groupParameters(params, [], { name })
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBeNull()
    expect(groups[0].params.map((p) => p.id)).toEqual(['a', 'b', 'c']) // Alpha, Mid, Zoo
  })

  it('labeled group keeps its declared order; the rest trails, ordered by name (the ldap case)', () => {
    const params = [
      { id: 'url', name: 'URL' }, { id: 'user-dn', name: 'User DN' }, { id: 'password', name: 'Password' },
      { id: 'zeta', name: 'Zeta' }, { id: 'alpha', name: 'Alpha' },
    ]
    const layout = [{ label: 'grp.conn', parameters: ['url', 'user-dn', 'password'] }]
    const groups = groupParameters(params, layout, { name, label: (l) => (l === 'grp.conn' ? 'Connection Settings' : l) })
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe('Connection Settings')
    expect(groups[0].params.map((p) => p.id)).toEqual(['url', 'user-dn', 'password'])
    expect(groups[1].label).toBeNull()
    expect(groups[1].params.map((p) => p.id)).toEqual(['alpha', 'zeta']) // name ascending
  })

  it('ordering-only unlabeled group with no remaining params (the nexus case)', () => {
    const params = [{ id: 'registry', name: 'Registry' }, { id: 'type', name: 'Artifact type' }]
    const groups = groupParameters(params, [{ parameters: ['type', 'registry'] }], { name })
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBeNull()
    expect(groups[0].params.map((p) => p.id)).toEqual(['type', 'registry']) // forced order, not alphabetical
  })

  it('skips absent ids and empty groups, and never duplicates a param across groups', () => {
    const params = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
    const layout = [
      { label: 'g0', parameters: ['nope'] },     // all missing → group dropped
      { parameters: [] },                         // no parameters → dropped
      { label: 'g1', parameters: ['a', 'missing', 'a'] }, // 'missing' skipped, 'a' once
      { label: 'g2', parameters: ['a', 'b'] },    // 'a' already used → only 'b'
    ]
    const groups = groupParameters(params, layout, { name })
    expect(groups.map((g) => [g.label, g.params.map((p) => p.id)])).toEqual([
      ['g1', ['a']],
      ['g2', ['b']],
    ])
  })

  it('expands glob patterns (name-sorted), mixing them with exact ids (the ldap groups case)', () => {
    const params = [
      { id: 's:groups-dn', name: 'Groups DN' }, { id: 's:groups-class', name: 'Groups classes' },
      { id: 's:people-dn', name: 'People DN' }, { id: 's:people-class', name: 'People classes' },
      { id: 's:quarantine-dn', name: 'Quarantine DN' }, { id: 's:department-attribute', name: 'Department attribute' },
      { id: 's:companies-dn', name: 'Companies DN' }, { id: 's:company-pattern', name: 'Company pattern' },
      { id: 's:base-dn', name: 'Base DN' },
    ]
    const layout = [
      { label: 'g.groups', parameters: ['s:groups-*'] },
      { label: 'g.people', parameters: ['s:people-*', 's:quarantine-dn', 's:department-attribute'] },
      { label: 'g.compan', parameters: ['s:compan*'] },
    ]
    const groups = groupParameters(params, layout, { name })
    expect(groups.map((g) => g.label)).toEqual(['g.groups', 'g.people', 'g.compan', null])
    expect(groups[0].params.map((p) => p.id)).toEqual(['s:groups-class', 's:groups-dn']) // glob → name ascending
    // people-* (name-sorted) then the two exact ids, in declared order
    expect(groups[1].params.map((p) => p.id)).toEqual(['s:people-class', 's:people-dn', 's:quarantine-dn', 's:department-attribute'])
    expect(groups[2].params.map((p) => p.id)).toEqual(['s:companies-dn', 's:company-pattern']) // compan* spans companies-* and company-*
    expect(groups[3].params.map((p) => p.id)).toEqual(['s:base-dn']) // leftover → trailing default group
  })

  it('is defensive about non-array inputs and a missing/empty label resolver', () => {
    expect(groupParameters(null, null, { name })).toEqual([])
    // No resolver → raw label used verbatim.
    expect(groupParameters([{ id: 'a', name: 'A' }], [{ label: 'Raw', parameters: ['a'] }], { name })[0].label).toBe('Raw')
    // Resolver returning nothing → falls back to the raw label.
    expect(groupParameters([{ id: 'a', name: 'A' }], [{ label: 'raw.key', parameters: ['a'] }], { name, label: () => null })[0].label).toBe('raw.key')
    // No name accessor → default group sorts by id.
    expect(groupParameters([{ id: 'b' }, { id: 'a' }], [], {}).flatMap((g) => g.params.map((p) => p.id))).toEqual(['a', 'b'])
  })
})
