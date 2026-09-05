/*
 * Per-tool search of the subscription cards (SubscriptionGroupCard): a row
 * matches when the query appears, case-insensitively, in its name, its
 * synthetic pills, the name or identifier of its node chain (instance, tool,
 * service) or the value of any NON-secured parameter of the subscription.
 * Secured parameters follow the same rule as the status tooltip masking:
 * their identifier looks like a secret.
 */

/** Parameter identifiers whose value is a secret: never searched, never shown. */
export const SENSITIVE = /secret|key|password|token/i

/**
 * Text searched for a row: name, pills, node chain names/ids and non-secured
 * parameter values, lowercase.
 *
 * @param {{name?: string, pills?: string[], sub?: {node?: object, parameters?: object}}} row A card row.
 * @returns {string}
 */
export function searchableText(row) {
  const parts = [row?.name, ...(row?.pills || [])]
  // Node chain: the subscribed instance, then its refined tool and service
  for (let node = row?.sub?.node, depth = 0; node && typeof node === 'object' && depth < 5; node = node.refined, depth++) {
    parts.push(node.name, node.id)
  }
  const parameters = row?.sub?.parameters
  if (parameters && typeof parameters === 'object') {
    for (const [id, value] of Object.entries(parameters)) {
      if (SENSITIVE.test(id) || value == null) continue
      parts.push(typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }
  return parts.filter((p) => p != null && p !== '').map(String).join('\n').toLowerCase()
}

/**
 * @param {object} row A card row.
 * @param {string} query The typed text; blank matches everything.
 * @returns {boolean}
 */
export function matchesSubscription(row, query) {
  const q = String(query || '').trim().toLowerCase()
  return !q || searchableText(row).includes(q)
}
