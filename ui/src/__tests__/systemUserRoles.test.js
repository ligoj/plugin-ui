import { describe, it, expect } from 'vitest'
import { appliesTo, federatedRoles, hasAnyRole, roleNames } from '../systemUserRoles.js'

const user = { login: 'u', roles: [{ id: 1, name: 'ADMIN' }], federatedRoles: [{ id: 'hr-api', name: 'HR-API' }] }

describe('systemUserRoles', () => {
  it('reads the federated roles defensively', () => {
    expect(federatedRoles(user)).toEqual([{ id: 'hr-api', name: 'HR-API' }])
    expect(federatedRoles({})).toEqual([])
    expect(federatedRoles(null)).toEqual([])
  })

  it('knows whether a user holds any role, assigned or federated', () => {
    expect(hasAnyRole(user)).toBe(true)
    expect(hasAnyRole({ roles: [], federatedRoles: [{ id: 'g', name: 'R' }] })).toBe(true)
    expect(hasAnyRole({ roles: [] })).toBe(false)
  })

  it('lists the assigned names first, then the federated ones', () => {
    expect(roleNames(user)).toEqual(['ADMIN', 'HR-API'])
  })

  it('matches a catalogue role by id (assigned) or by name (federated)', () => {
    expect(appliesTo({ id: 1, name: 'ADMIN' }, user)).toBe(true)
    expect(appliesTo({ id: 7, name: 'HR-API' }, user)).toBe(true)
    expect(appliesTo({ id: 9, name: 'USER' }, user)).toBe(false)
  })
})
