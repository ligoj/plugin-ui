import { describe, it, expect } from 'vitest'
import { matchesSubscription, searchableText, SENSITIVE } from '../utils/subscriptionSearch.js'

const row = {
  name: 'Bank — KYC', pills: ['12 open', '3 closed'],
  sub: { id: 1, node: { id: 'service:build:jenkins:corp', name: 'Jenkins Corp', refined: { id: 'service:build:jenkins', name: 'Jenkins', refined: { id: 'service:build', name: 'Build' } } }, parameters: { 'service:build:jenkins:job': 'kyc-Nightly', 'service:build:jenkins:url': 'https://ci.sample.com', 'service:build:jenkins:api-token': 'SECRET-VALUE', 'service:x:count': 42, 'service:x:opts': { region: 'eu-west' }, 'service:x:empty': null } },
}

describe('subscription card search', () => {
  it('matches the name, the pills and the non-secured parameters, case-insensitively', () => {
    expect(matchesSubscription(row, 'kyc')).toBe(true)
    expect(matchesSubscription(row, 'NIGHTLY')).toBe(true)
    expect(matchesSubscription(row, '3 closed')).toBe(true)
    expect(matchesSubscription(row, 'ci.sample')).toBe(true)
    expect(matchesSubscription(row, '42')).toBe(true)
    expect(matchesSubscription(row, 'eu-west')).toBe(true)
    expect(matchesSubscription(row, 'nothing here')).toBe(false)
  })

  it('matches the node chain: instance, tool and service names or identifiers', () => {
    expect(matchesSubscription(row, 'jenkins corp')).toBe(true)
    expect(matchesSubscription(row, 'service:build:jenkins:corp')).toBe(true)
    expect(matchesSubscription(row, 'build')).toBe(true)
    expect(matchesSubscription({ name: 'x', sub: { node: { id: 'service:id:ldap', name: 'LDAP' } } }, 'ldap')).toBe(true)
    // A cyclic or missing chain never loops
    const cyclic = { id: 'a', name: 'A' }; cyclic.refined = cyclic
    expect(matchesSubscription({ name: 'x', sub: { node: cyclic } }, 'zzz')).toBe(false)
  })

  it('never searches secured parameters', () => {
    expect(SENSITIVE.test('service:build:jenkins:api-token')).toBe(true)
    expect(matchesSubscription(row, 'secret-value')).toBe(false)
    expect(searchableText(row)).not.toContain('secret-value')
  })

  it('a blank query matches everything, even rows without subscription', () => {
    expect(matchesSubscription({ name: 'x' }, '')).toBe(true)
    expect(matchesSubscription({ name: 'x' }, '   ')).toBe(true)
    expect(matchesSubscription({}, 'x')).toBe(false)
    expect(matchesSubscription({ name: 'Only name' }, 'only')).toBe(true)
  })
})
