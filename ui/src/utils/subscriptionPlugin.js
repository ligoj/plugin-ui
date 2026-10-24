/**
 * Whether the backend plugin of a subscription's tool is installed. The tool plugin owns the data a subscription
 * created on the tool: without it, the API only removes the subscription, even when asked to delete these data.
 *
 * @param {object} subscription A subscription with its `node.id`, such as `service:build:jenkins:1`.
 * @param {string[]|null|undefined} plugins The keys of the installed plugins, from the session `applicationSettings.plugins`.
 * @returns {boolean} `false` only when the tool plugin is known to be missing: an older API without the list, or a
 *   node without a tool, count as installed.
 */
export function isToolPluginInstalled(subscription, plugins) {
  const parts = String(subscription?.node?.id || '').split(':')
  if (!Array.isArray(plugins) || parts.length < 3) return true
  return plugins.includes(parts.slice(0, 3).join(':'))
}
