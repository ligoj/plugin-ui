import { describe, it, expect } from 'vitest'
import { compareVersions, isOutdated } from '../utils/versions.js'

describe('versions', () => {
  it('compares the dotted numbers, a missing one counting as 0', () => {
    expect(compareVersions('2.479.1', '2.480')).toBe(-1)
    expect(compareVersions('10.5', '9.12.3')).toBe(1)
    expect(compareVersions('10.5', '10.5.0')).toBe(0)
    // A build number after the released version: not older
    expect(compareVersions('10.5.0.89998', '10.5')).toBe(1)
  })

  it('reads the version after a prefix and before a suffix', () => {
    expect(compareVersions('v2.479.1-lts', '2.479.1')).toBe(0)
    expect(compareVersions('Jira 9.12.0', '10.3')).toBe(-1)
  })

  it('cannot compare a version without number', () => {
    expect(compareVersions('latest', '1.0')).toBeNull()
    expect(compareVersions('1.0', null)).toBeNull()
    expect(compareVersions(undefined, '1.0')).toBeNull()
  })

  it('flags only a version older than the latest one', () => {
    expect(isOutdated('2.479.1', '2.480')).toBe(true)
    expect(isOutdated('2.480', '2.480')).toBe(false)
    expect(isOutdated('2.481', '2.480')).toBe(false)
    expect(isOutdated('2.479.1', null)).toBe(false)
    expect(isOutdated('n/a', '2.480')).toBe(false)
  })
})
