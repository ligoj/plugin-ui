/*
 * Tool colour of the plugin-ui views (plugin manager tiles, home / project
 * subscription glyphs): ONE reactive lookup over the host's brand helper.
 *
 * `toolColor(node, name)` answers synchronously with the name-based colour
 * and, the first time a tool is seen, resolves the colour of its SVG icon
 * (`resolveToolColor`): the reactive map then updates every computed that
 * read it. Resolved colours are shared by every view for the session.
 */
import { reactive } from 'vue'
import { resolveToolColor, fallbackToolColor } from '@ligoj/host'

const colors = reactive({})
const pending = new Set()

/**
 * @param {string|{id?: string, name?: string}} node The tool / instance node (or its id).
 * @param {string} [name] The display name for the fallback colour, `node.name` then the id by default.
 * @returns {string} The colour to use now (updated reactively once the icon colour is known).
 */
export function toolColor(node, name) {
  const key = (typeof node === 'object' ? node?.id : node) || name || ''
  if (colors[key]) return colors[key]
  const label = name ?? (typeof node === 'object' ? (node?.name || node?.id) : node) ?? ''
  if (key && !pending.has(key)) {
    pending.add(key)
    resolveToolColor(node, label).then((c) => { colors[key] = c }).catch(() => { /* fallback stays */ })
  }
  return fallbackToolColor(label)
}

/** Test hook: forget every resolved colour. */
export function _resetToolColors() {
  for (const k of Object.keys(colors)) delete colors[k]
  pending.clear()
}
