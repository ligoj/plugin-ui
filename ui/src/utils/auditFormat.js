/*
 * Audit data display of an auditable entity (createdDate, createdBy, lastModifiedDate, lastModifiedBy), as sent by
 * the API: the dates are epoch milliseconds or ISO strings, the users are logins.
 */
import { userLabel } from '@ligoj/host'

// Login of the changes made by the application itself, such as the initial data
const SYSTEM_USER = '_system'

// Units of a relative time, the largest first, with their length in seconds
const UNITS = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]]

/** The date of an audit value, or null when absent or invalid. */
export function auditTime(value) {
  if (value == null || value === '') return null
  const date = new Date(typeof value === 'number' ? value : String(value))
  return Number.isNaN(date.getTime()) ? null : date
}

/** The full date and time in the given locale, '' when absent. */
export function formatAuditDate(value, locale) {
  const date = auditTime(value)
  return date ? date.toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short' }) : ''
}

/** The time relative to `now`, such as "3 days ago", in the given locale, '' when absent. Under a minute is "now". */
export function relativeAuditTime(value, locale, now = Date.now()) {
  const date = auditTime(value)
  if (!date) return ''
  const seconds = Math.round((date.getTime() - now) / 1000)
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size)
  return unit ? format.format(Math.trunc(seconds / unit[1]), unit[0]) : format.format(0, 'second')
}

/**
 * The displayed user of an audit value, a login or a user object depending on the endpoint: its visual identifier,
 * a label for the application itself.
 */
export function auditUser(user, t) {
  if (!user) return ''
  const login = typeof user === 'string' ? user : user.id
  return login === SYSTEM_USER ? t('audit.systemUser') : userLabel(user)
}

/** "date · user" of the creation and of the last modification, the absent parts dropped. */
export function auditLines(item, t, locale) {
  const line = (date, user) => [formatAuditDate(date, locale), auditUser(user, t)].filter(Boolean).join(' · ')
  return { created: line(item?.createdDate, item?.createdBy), modified: line(item?.lastModifiedDate, item?.lastModifiedBy) }
}

/** Whether an entity carries audit data: the entries defined outside the database have none. */
export function hasAudit(item) {
  return !!(auditTime(item?.createdDate) || auditTime(item?.lastModifiedDate))
}
