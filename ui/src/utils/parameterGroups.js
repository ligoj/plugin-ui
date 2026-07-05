/*
 * groupParameters — arrange subscribe-wizard parameters for display.
 *
 * Pure (DOM-free) so it can be unit-tested without mounting the wizard.
 * Used by SubscribeWizardView's `parameterGroups` computed.
 *
 * Rules:
 *   - Each plugin-declared group (from a plugin's `parameterLayout` hook) is
 *     emitted first, in declaration order. A group's `parameters` entries are
 *     matched against the actual parameters, in the declared order:
 *       · an exact id contributes that parameter (kept in the declared order);
 *       · a glob (an entry containing `*`, e.g. `svc:ldap:groups-*`) contributes
 *         every not-yet-used parameter whose id matches, in display-name order.
 *     A listed parameter absent from `params` is skipped; a parameter is never
 *     placed in more than one group.
 *   - Every remaining parameter is emitted last, in a single unlabeled group,
 *     ordered by display name (ascending) — the default.
 *
 * @param {Array}    params  The parameter definitions (each with an `id`).
 * @param {Array}    layout  Plugin layout: `[{ label?, parameters: [id|glob,...] }]`.
 * @param {object}   fns
 * @param {Function} [fns.name]  `(p) => string` display name used for sorting.
 *                                Defaults to the parameter id.
 * @param {Function} [fns.label] `(rawLabel) => string` group-label resolver
 *                                (e.g. i18n). Defaults to identity.
 * @returns {Array} `[{ label: string|null, params: [...] }]`
 */
export function groupParameters(params, layout, { name, label } = {}) {
  const list = Array.isArray(params) ? params : []
  const nameOf = typeof name === 'function' ? name : (p) => String(p?.id ?? '')
  const resolveLabel = typeof label === 'function' ? label : (l) => l
  const byName = (a, b) => nameOf(a).localeCompare(nameOf(b))
  const byId = new Map(list.map((p) => [p.id, p]))
  const used = new Set()
  const take = (p) => { used.add(p.id); return p }
  const groups = []
  for (const g of (Array.isArray(layout) ? layout : [])) {
    const groupParams = []
    for (const pid of (g?.parameters || [])) {
      if (String(pid).includes('*')) {
        const re = globToRegExp(pid)
        for (const p of list.filter((q) => !used.has(q.id) && re.test(q.id)).sort(byName)) groupParams.push(take(p))
      } else {
        const p = byId.get(pid)
        if (p && !used.has(pid)) groupParams.push(take(p))
      }
    }
    if (groupParams.length) {
      groups.push({ label: g.label ? (resolveLabel(g.label) ?? g.label) : null, params: groupParams })
    }
  }
  const rest = list.filter((p) => !used.has(p.id)).sort(byName)
  if (rest.length) {
    groups.push({ label: null, params: rest })
  }
  return groups
}

/** Compile a glob (only `*` is special, matching any run of characters) into an
 *  anchored RegExp. All other regex metacharacters are treated literally. */
function globToRegExp(glob) {
  const escaped = String(glob).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`)
}
