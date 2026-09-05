/*
 * Plug-in updates known by the backend (last scheduled or manual check, see
 * app-api `PluginScheduleResource`): exposed to the session as the
 * `plugin-updates` application data, an `artifact:version,...` string, and
 * returned by `GET rest/system/plugin/schedule` as `availableUpdates`.
 */

/**
 * @param {string | Record<string, string> | null | undefined} raw The stored string, or the map from the schedule API.
 * @returns {Array<{artifact: string, version: string}>} Sorted by artifact.
 */
export function parseUpdates(raw) {
  if (!raw) return []
  const entries = typeof raw === 'string'
    ? raw.split(',').map((e) => e.trim()).filter((e) => e.includes(':')).map((e) => [e.slice(0, e.indexOf(':')), e.slice(e.indexOf(':') + 1)])
    : Object.entries(raw)
  return entries.map(([artifact, version]) => ({ artifact, version })).sort((a, b) => a.artifact.localeCompare(b.artifact))
}

/**
 * Human date of an instant returned by the schedule API (ISO string or epoch milliseconds), '' when absent.
 */
export function formatInstant(value, locale) {
  if (value == null || value === '') return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(locale || undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
