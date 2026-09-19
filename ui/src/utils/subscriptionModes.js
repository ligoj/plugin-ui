/**
 * Subscription modes a node accepts, from its `mode` (backend SubscriptionMode: NONE / LINK / CREATE / ALL, any case).
 * A missing mode means link, the historical default; `none` means nothing can subscribe to the node.
 */
export function subscriptionModes(mode) {
  const m = String(mode || '').toLowerCase()
  if (m === 'none') return []
  const out = []
  if (m === 'all' || m === 'create') out.push('create')
  if (m === 'all' || m === 'link' || !m) out.push('link')
  return out
}
