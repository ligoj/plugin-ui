/*
 * Summary figures of the plugin view (SystemPluginView KPI cards): the
 * distribution of the plug-ins by type, by state (see pluginToggle.js) and
 * by code-signature status. Pure functions over the table rows, so the view
 * only maps them to labels, colors and tooltips.
 */

export const TYPES = ['service', 'tool', 'feature']
export const STATES = ['active', 'enabling', 'disabling', 'disabled', 'pending', 'deleted']
export const SIGNATURES = ['VERIFIED', 'SIGNED', 'UNSIGNED', 'INVALID']

/** Integer percentage of `value` over `total`, 0 when there is no total. */
export function pct(value, total) {
  return total ? Math.round((value / total) * 100) : 0
}

/**
 * @param {Array<object>} rows The table rows (`type`, `statusKey`, `enabled`, `loaded`, `signature`).
 * @returns {{total: number, types: Record<string, number>, states: Record<string, number>, enabled: number, loaded: number, signatures: Record<string, number>}}
 */
export function pluginStats(rows) {
  const count = (fn) => rows.filter(fn).length
  const tally = (keys, of) => Object.fromEntries(keys.map((k) => [k, count((r) => of(r) === k)]))
  return {
    total: rows.length,
    types: tally(TYPES, (r) => r.type),
    states: tally(STATES, (r) => r.statusKey),
    enabled: count((r) => r.enabled),
    loaded: count((r) => r.loaded),
    signatures: tally(SIGNATURES, (r) => r.signature?.status || 'UNSIGNED'),
  }
}
