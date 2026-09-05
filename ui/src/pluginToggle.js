/*
 * Enable/disable switch of the plugin view (SystemPluginView).
 *
 * The backend has NO persisted "enabled" flag: `NodeVo.enabled` is a derived
 * availability (the plug-in is loaded — false when a resource such as the jar
 * is missing) and the node update API rejects an `enabled` property. The only
 * persisted per-node switch is the subscription `mode` (ALL / LINK / CREATE /
 * NONE), and `NONE` makes the backend refuse any new subscription while the
 * existing ones keep working. The switch therefore drives the mode of the
 * plugin's node: ON = subscriptions open (any mode but NONE), OFF = NONE;
 * enabling restores the mode of the refined (parent) node — a node's mode
 * cannot exceed its parent's (the backend answers 400 "invalid-mode") — ALL
 * when there is no parent, and is impossible while the parent is NONE. An
 * unavailable plug-in cannot be toggled.
 */

/** @returns {boolean} Whether the node accepts new subscriptions (mode other than NONE). */
export function isSubscriptionOpen(node) {
  return String(node?.mode ?? 'all').toLowerCase() !== 'none'
}

/** @returns {boolean} Whether the plug-in backing the node is loaded (derived `NodeVo.enabled`). */
export function isAvailable(node) {
  return !node || node.enabled !== false
}

/**
 * Mode restored when enabling: the refined node's one (lowercase), ALL without
 * parent, `null` when the parent is NONE (enabling is then impossible).
 *
 * @param {object} node The plugin's node (`NodeVo`, `refined` nested).
 * @returns {string | null}
 */
export function restoreMode(node) {
  const parentMode = String(node?.refined?.mode ?? 'all').toLowerCase()
  return parentMode === 'none' ? null : parentMode
}

/**
 * Payload of `PUT rest/node` toggling the subscription mode, the parameters
 * being left untouched.
 *
 * @param {object} node The plugin's node (`NodeVo`).
 * @param {boolean} enable `true` to open subscriptions (see {@link restoreMode}), `false` to close them (mode NONE).
 */
export function toggleModePayload(node, enable) {
  return { id: node.id, node: node.refined?.id, name: node.name, mode: enable ? restoreMode(node) : 'none', untouchedParameters: true }
}
