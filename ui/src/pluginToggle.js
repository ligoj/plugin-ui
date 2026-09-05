/*
 * Enable/disable switch of the plugin view (SystemPluginView).
 *
 * A disabled plug-in is NOT loaded at all: the backend renames its jar
 * (`*.jar.disabled`, `PUT rest/system/plugin/{artifact}/disable`) so the
 * plug-ins class-loader skips it at the next restart, and renames it back on
 * enable. Like an installation or a removal, the change is applied by a
 * restart: until then the plug-in keeps its current class-path state. Its
 * configuration (nodes, subscriptions, parameters) is kept while disabled.
 * Each plugin row carries both facts: `disabled` (the persisted switch) and
 * `loaded` (the class-path state), from which the status is derived.
 */

/**
 * State of a plugin row.
 *
 * @param {object} it A plugin entry of `GET rest/system/plugin`.
 * @returns {{pending: boolean, disabled: boolean, enabled: boolean, loaded: boolean, restartRequired: boolean,
 *   key: 'active'|'disabled'|'disabling'|'enabling'|'pending'|'deleted', status: 'ok'|'idle'|'warn'}}
 *   `key` names the status (i18n `system.plugin.status.<key>`), `status` is the LjStatus level.
 */
export function pluginState(it) {
  const disabled = it.disabled === true
  // Older backend without the class-path state: fall back to the node availability
  const loaded = typeof it.loaded === 'boolean' ? it.loaded : (it.node ? it.node.enabled !== false : true)
  // Staged jar never installed (no persisted plugin yet): loaded at the next restart
  const pending = !it.plugin?.version && !disabled
  // Disabled but still loaded, or enabled but not loaded yet: waiting for a restart
  const restartRequired = !pending && !!it.plugin?.version && loaded === disabled
  let key
  if (it.deleted) key = 'deleted'
  else if (pending) key = 'pending'
  else if (restartRequired) key = disabled ? 'disabling' : 'enabling'
  else key = disabled ? 'disabled' : 'active'
  const status = key === 'active' ? 'ok' : key === 'disabled' ? 'idle' : 'warn'
  return { pending, disabled, enabled: !disabled, loaded, restartRequired, key, status }
}

/**
 * API path toggling a plug-in.
 *
 * @param {string} artifact The plug-in artifact, e.g. 'plugin-build-jenkins'.
 * @param {boolean} enable `true` to enable, `false` to disable.
 */
export function togglePath(artifact, enable) {
  return `rest/system/plugin/${encodeURIComponent(artifact)}/${enable ? 'enable' : 'disable'}`
}
