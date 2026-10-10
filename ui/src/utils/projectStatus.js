/*
 * Status summaries for the NodeStatusBadge of a project (project page and project list): the UP / DOWN / unknown
 * counts of its subscriptions and of the instances they use.
 */

/**
 * The `{ total, up, down, unknown }` counts of the given statuses: a string (`UP`, `DOWN`...), or an object carrying
 * it as `status` (subscription) or `value` (event). `total` defaults to the number of statuses; the statuses not
 * given (never checked) count as unknown.
 */
export function statusCounts(statuses, total = statuses.length) {
  let up = 0
  let down = 0
  for (const s of statuses) {
    const value = String((typeof s === 'object' ? (s?.status ?? s?.value) : s) ?? '').toUpperCase()
    if (value === 'UP') up++
    else if (value === 'DOWN') down++
  }
  return { total, up, down, unknown: Math.max(0, total - up - down) }
}

/**
 * The own status of every node of the `GET rest/node/status` tree (service → tool → instance, children in
 * `specifics`): node id → `UP` | `DOWN`.
 */
export function nodeStatusValues(list, result = new Map()) {
  for (const e of list || []) {
    const id = e?.node?.id
    if (id && e.value) result.set(id, String(e.value).toUpperCase())
    if (Array.isArray(e?.specifics)) nodeStatusValues(e.specifics, result)
  }
  return result
}
