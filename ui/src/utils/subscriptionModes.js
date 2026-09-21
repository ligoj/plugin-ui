/**
 * Subscription modes a node accepts, from its `mode` (backend SubscriptionMode: NONE / LINK / CREATE / ALL, any case).
 * A missing mode means `ALL`, the default of the `Node` entity; `none` means nothing can subscribe to the node.
 */
export function subscriptionModes(mode) {
  const m = String(mode || 'all').toLowerCase()
  if (m === 'none') return []
  const out = []
  if (m === 'all' || m === 'create') out.push('create')
  if (m === 'all' || m === 'link') out.push('link')
  return out
}

/**
 * Modes a NEW node may take under a parent node, mirroring the backend rule (`NodeResource#checkMode`): any mode
 * under an `all` parent, the parent's own mode, and always `none`. Most permissive first, so the first one keeps the
 * parent's capability. A missing parent mode means `ALL`, the default of the `Node` entity.
 *
 * @param {string|null|undefined} parentMode Mode of the parent (tool) node, any case.
 * @returns {string[]} The allowed modes among `all`, `create`, `link`, `none`.
 */
export function nodeModes(parentMode) {
  const m = String(parentMode || 'all').toLowerCase()
  if (m === 'all') return ['all', 'create', 'link', 'none']
  return m === 'none' ? ['none'] : [m, 'none']
}

/**
 * Modes a tool supports, derived from the modes of its PARAMETERS. A parameter without an explicit mode is `ALL`
 * (the entity default), so a tool is rarely limited. The API does not expose a parameter's mode, but its per-mode
 * lists do: the list asked for `NONE` holds exactly the `ALL`-mode parameters, and a parameter present only in
 * the `LINK` (or only in the `CREATE`) list is specific to that mode.
 *
 * - any `ALL` parameter → `all`, and implicitly `create` and `link`
 * - any `CREATE`-only parameter → `create`; any `LINK`-only parameter → `link`
 * - no parameter at all → the default, every mode
 *
 * @param {{none?: Array, link?: Array, create?: Array}} lists The parameters returned for each requested mode.
 * @returns {string[]} Among `all`, `create`, `link`, most permissive first.
 */
export function modesFromParameters({ none = [], link = [], create = [] } = {}) {
  const ids = (list) => new Set((Array.isArray(list) ? list : []).map((p) => p?.id).filter(Boolean))
  const all = ids(none), inLink = ids(link), inCreate = ids(create)
  const linkOnly = [...inLink].some((id) => !all.has(id) && !inCreate.has(id))
  const createOnly = [...inCreate].some((id) => !all.has(id) && !inLink.has(id))
  if (all.size > 0 || (!linkOnly && !createOnly)) return ['all', 'create', 'link']
  return [...(createOnly ? ['create'] : []), ...(linkOnly ? ['link'] : [])]
}
