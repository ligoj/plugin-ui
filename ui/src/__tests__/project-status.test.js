/*
 * Status summaries of a project for the status badge: UP / DOWN / unknown counts of its subscriptions and instances.
 */
import { describe, it, expect } from 'vitest'
import { statusCounts, nodeStatusValues } from '../utils/projectStatus.js'

describe('statusCounts', () => {
  it('counts the UP and DOWN statuses, whatever their shape, the others are unknown', () => {
    expect(statusCounts(['UP', { status: 'down' }, { value: 'UP' }, null, 'BLOCKED'])).toEqual({ total: 5, up: 2, down: 1, unknown: 2 })
  })

  it('counts the statuses not given yet as unknown', () => {
    expect(statusCounts(['UP'], 3)).toEqual({ total: 3, up: 1, down: 0, unknown: 2 })
    expect(statusCounts([], 0)).toEqual({ total: 0, up: 0, down: 0, unknown: 0 })
  })
})

describe('nodeStatusValues', () => {
  it('reads the own status of every node of the status tree', () => {
    const tree = [{ node: { id: 'service:qa' }, specifics: [
      { node: { id: 'service:qa:sonarqube' }, specifics: [
        { node: { id: 'service:qa:sonarqube:local' }, value: 'up' },
        { node: { id: 'service:qa:sonarqube:other' }, value: 'DOWN' },
      ] },
    ] }]
    expect([...nodeStatusValues(tree)]).toEqual([['service:qa:sonarqube:local', 'UP'], ['service:qa:sonarqube:other', 'DOWN']])
    expect(nodeStatusValues(null).size).toBe(0)
  })
})
