/*
 * Shared parameter-form logic for the two node/subscription dialogs
 * (SubscribeWizardView + NodeEditDialog). Kept here — pure or with its
 * dependencies passed in — so neither dialog carries a private copy.
 *
 * The dialogs still own their reactive state, i18n-bound labels and submit
 * flow; this module holds the parts that were byte-identical between them:
 * parameter typing, wire building, owning-plugin feature resolution and the
 * lazy tool-bundle loader.
 */
import { pluginRegistry, pluginIdFromKey, loadPlugin } from '@ligoj/host'

/* ---- parameter value typing ---- */

/** Lower-cased parameter type discriminator (`text`, `integer`, `bool`, …). */
export function typeKind(p) { return String(p?.type || '').toLowerCase() }

/** Whether a parameter renders as a single-line text/password/node field. */
export function isTextParam(p) { const k = typeKind(p); return !k || ['text', 'password', 'node', 'project'].includes(k) }

/** Whether a parameter's value must be masked. */
export function isPassword(p) { return !!p?.secured || typeKind(p) === 'password' }

/** Coerce a parameter's raw default value to the type its field expects. A
 *  SELECT is edited in the form as its option VALUE (see buildParamWire); if the
 *  default is stored as an option index, resolve it back to the value. */
export function coerce(p) {
  const k = typeKind(p)
  if (k === 'integer') return Number(p.defaultValue)
  if (k === 'bool') return p.defaultValue === true || p.defaultValue === 'true'
  if (k === 'select') return selectValue(p, p.defaultValue)
  return p.defaultValue
}

/** Resolve a SELECT raw value (which may be an option INDEX or the option value
 *  itself) to the option VALUE the form fields bind to. */
export function selectValue(p, raw) {
  const values = p?.values || []
  const i = Number(raw)
  return (Number.isInteger(i) && String(i) === String(raw) && i >= 0 && i < values.length) ? values[i] : raw
}

/**
 * Build the REST wire object for one parameter value, or `null` when an
 * optional parameter is left empty (so it is not persisted).
 * @param {object} p     Parameter definition.
 * @param {*}      value Current form value for `p`.
 */
export function buildParamWire(p, value) {
  if ((value === '' || value == null || (Array.isArray(value) && !value.length)) && !p.mandatory && !p.required) return null
  const base = { parameter: p.id }
  const k = typeKind(p)
  if (k === 'integer') return { ...base, integer: Number(value) }
  if (k === 'bool') return { ...base, bool: !!value }
  if (['multiple', 'multiselect', 'tags'].includes(k)) return { ...base, selections: value || [] }
  // A SELECT is persisted by its option INDEX (the backend's checkSelect reads
  // vo.getIndex()); the form binds the option value, so map it back here.
  if (k === 'select') {
    const values = p.values || []
    const idx = values.indexOf(value)
    return { ...base, index: idx >= 0 ? idx : Number(value) }
  }
  return { ...base, text: value }
}

/* ---- owning-plugin resolution ---- */

/**
 * Candidate plugin ids that may own a node: its tool plugin first, then the
 * parent service plugin. e.g. `service:id:ldap` → `['id-ldap', 'id']`.
 */
export function candidatePluginIds(nodeId) {
  const candidates = []
  const sub = pluginIdFromKey(nodeId)
  if (sub) candidates.push(sub)
  const parts = String(nodeId).split(':').filter(Boolean)
  if (parts.length >= 2 && parts[1] && parts[1] !== sub) candidates.push(parts[1])
  return candidates
}

/** Registered candidate plugins for a node that expose a `feature()` fn. */
function owningPlugins(nodeId) {
  return candidatePluginIds(nodeId)
    .map((id) => [id, pluginRegistry.get(id)])
    .filter(([, plugin]) => typeof plugin?.feature === 'function')
}

/** True when a feature() error is just "this plugin doesn't implement it". */
function isMissingFeature(err, action) {
  return new RegExp(`no feature ["']${action}["']`).test(err?.message || '')
}

/**
 * Plugin-supplied custom field component for parameter `ctx.parameter`, or
 * `null` — the caller then renders the default type-based field. Tries the
 * tool plugin, then the parent service plugin.
 */
export function resolveParameterField(nodeId, ctx, tag = 'params') {
  if (!nodeId) return null
  for (const [id, plugin] of owningPlugins(nodeId)) {
    try {
      const comp = plugin.feature('parameterField', ctx)
      if (comp) return comp
    } catch (err) {
      if (!isMissingFeature(err, 'parameterField')) console.warn(`[${tag}] parameterField from ${id} threw`, err)
    }
  }
  return null
}

/**
 * Plugin-supplied parameter layout (`[{ label?, parameters:[id|glob,...] }]`),
 * or `[]` — the caller then applies the default name-ascending order. Tries
 * the tool plugin, then the parent service plugin.
 */
export function resolveParameterLayout(nodeId, ctx, tag = 'params') {
  if (!nodeId) return []
  for (const [id, plugin] of owningPlugins(nodeId)) {
    try {
      const layout = plugin.feature('parameterLayout', ctx)
      if (Array.isArray(layout) && layout.length) return layout
    } catch (err) {
      if (!isMissingFeature(err, 'parameterLayout')) console.warn(`[${tag}] parameterLayout from ${id} threw`, err)
    }
  }
  return []
}

/* ---- lazy tool-bundle loading ---- */

/**
 * Lazy-load a node's tool sub-plugin bundle (best effort) so its i18n labels
 * and custom parameter fields are registered before the form first renders.
 * e.g. `service:id:ldap` → loads `id-ldap`.
 */
export async function ensureToolPluginLoaded(nodeId) {
  if (typeof nodeId !== 'string') return
  const pluginId = pluginIdFromKey(nodeId.split(':').filter(Boolean).slice(0, 3).join(':'))
  if (!pluginId || pluginRegistry.has(pluginId)) return
  try {
    await loadPlugin(pluginId)
  } catch {
    // The browser module-map permanently caches a failed dynamic import by
    // URL — so if the bundle 404'd once early (e.g. before the session was
    // ready), the host loader keeps re-importing the same poisoned URL and
    // keeps failing. Retry with a cache-busting query and register the
    // freshly-loaded definition ourselves so its custom parameter fields and
    // i18n resolve. (requires/parents are already loaded at boot.)
    if (pluginRegistry.has(pluginId)) return
    try {
      const url = `${import.meta.env.BASE_URL}main/${pluginId}/vue/index.js?cb=${Date.now()}`
      const def = (await import(/* @vite-ignore */ url))?.default
      if (def && typeof def === 'object') {
        if (!def.id) def.id = pluginId
        pluginRegistry.register(def.id, def)
        if (typeof def.install === 'function') await def.install({ pluginId })
      }
    } catch { /* give up — default fields render */ }
  }
}
