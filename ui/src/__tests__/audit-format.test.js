/*
 * Audit data display: the dates are epoch milliseconds (or ISO strings), the users are logins, "_system" being the
 * application itself.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { auditTime, formatAuditDate, relativeAuditTime, auditUser, auditLines, hasAudit } from '../utils/auditFormat.js'

const t = (key) => ({ 'audit.systemUser': 'System' })[key] ?? key
const NOW = Date.UTC(2026, 9, 10, 12, 0, 0)
const DAY = 86400000

beforeEach(() => { setActivePinia(createPinia()) })

describe('audit data display', () => {
  it('reads epoch milliseconds and ISO dates, ignores the absent and invalid ones', () => {
    expect(auditTime(NOW).getTime()).toBe(NOW)
    expect(auditTime('2026-10-10T12:00:00Z').getTime()).toBe(NOW)
    for (const value of [null, undefined, '', 'not a date']) expect(auditTime(value)).toBeNull()
    expect(formatAuditDate('not a date', 'en')).toBe('')
    expect(formatAuditDate(null, 'en')).toBe('')
  })

  it('formats the full date in the active locale', () => {
    expect(formatAuditDate(NOW, 'en')).toContain('October')
    expect(formatAuditDate(NOW, 'en')).toContain('2026')
    expect(formatAuditDate(NOW, 'fr')).toContain('octobre')
  })

  it('tells the time relative to now, in the active locale', () => {
    expect(relativeAuditTime(NOW - 3 * DAY, 'en', NOW)).toBe('3 days ago')
    expect(relativeAuditTime(NOW - 3 * DAY, 'fr', NOW)).toBe('il y a 3 jours')
    expect(relativeAuditTime(NOW - 5 * 60000, 'en', NOW)).toBe('5 minutes ago')
    expect(relativeAuditTime(NOW - 400 * DAY, 'en', NOW)).toBe('last year')
    // A server clock slightly ahead of the browser is "now", not "in 20 seconds"
    expect(relativeAuditTime(NOW + 20000, 'en', NOW)).toBe('now')
    expect(relativeAuditTime(null, 'en', NOW)).toBe('')
  })

  it('names the application itself, shows a login as is', () => {
    expect(auditUser('_system', t)).toBe('System')
    expect(auditUser('ligoj-admin', t)).toBe('ligoj-admin')
    // Some endpoints, such as the project one, send the user as an object
    expect(auditUser({ id: '_system' }, t)).toBe('System')
    expect(auditUser(null, t)).toBe('')
  })

  it('summarizes the creation and the last modification', () => {
    const item = { createdDate: NOW, createdBy: '_system', lastModifiedDate: NOW, lastModifiedBy: 'ligoj-admin' }
    const lines = auditLines(item, t, 'en')
    expect(lines.created).toContain('2026')
    expect(lines.created).toContain(' · System')
    expect(lines.modified).toContain(' · ligoj-admin')
    expect(auditLines({}, t, 'en')).toEqual({ created: '', modified: '' })
    expect(hasAudit(item)).toBe(true)
    expect(hasAudit({ name: 'from.env' })).toBe(false)
  })
})
