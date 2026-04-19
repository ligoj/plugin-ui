/*
 * Framework-agnostic helpers ported from the legacy webjars/main.js.
 *
 * Intentionally small: only pure functions that don't depend on jQuery,
 * Handlebars, $cascade, or any of the legacy global singletons. Things that
 * rendered HTML strings (getUserLink, getProjectLink, toIcon, …) are
 * deliberately omitted — their Vue-idiomatic replacement is a component
 * (e.g. <UserLink :user="…" />), not a string builder.
 */

/** Strip undefined/null/''/false entries from a plain object (non-recursive). */
export function trimObject(data) {
  if (!data || typeof data !== 'object') return data
  for (const key of Object.keys(data)) {
    const v = data[key]
    if (v === undefined || v === null || v === '' || v === false) {
      delete data[key]
    }
  }
  return data
}

/** HTML-escape a string; returns '' for non-strings. */
export function htmlEscape(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Inverse of htmlEscape. */
export function htmlUnescape(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Return the two letters representing a user for an avatar badge.
 * Prefers first+last initials, falls back on fullName splits, then on id.
 */
export function toUser2Letters(user) {
  if (!user) return '??'
  if (user.firstName && user.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0)
  }
  if (user.fullName) {
    const parts = user.fullName.split(' ')
    if (parts.length === 1) {
      return user.fullName.charAt(0) + (user.fullName.length >= 2 ? user.fullName.charAt(1) : '')
    }
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  }
  const id = (user.id || user || '??').toString()
  return (id.length === 1 ? id + id : id).slice(0, 2)
}

/**
 * Build a user's full name from available fields; falls back on id-derived
 * initials if neither first nor last name is known.
 */
export function getFullName(user) {
  if (!user) return ''
  if (user.fullName) return user.fullName
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  if (user.firstName) return `${user.firstName} ${(user.id || '').substring(1)}`
  if (user.lastName) return `${capitalize((user.id || '').charAt(0))}. ${user.lastName}`
  const id = (user.id || user || '??').toString()
  return `${capitalize(id.charAt(0))}. ${capitalize(id.substring(1))}`
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

/* ---------- node identifier helpers ----------
 * Legacy Ligoj node IDs follow the colon-separated pattern
 *   service:{service}:{tool}(:whatever)
 * The helpers below walk that pattern.
 */

/** `service:scm:git:project` → `service-scm-git`. */
export function getToolFromId(id) {
  if (!id) return null
  const parts = id.split(':')
  return parts.length > 2 ? parts.slice(0, 3).join('-') : null
}

/** `service:scm:git:project` → `service-scm`. */
export function getServiceFromId(id) {
  if (!id) return null
  const parts = id.split(':')
  return parts.length > 1 ? parts.slice(0, 2).join('-') : null
}

export function getServiceNameFromId(id) {
  return (id || '').split(':')[1] || null
}

export function getToolNameFromId(id) {
  return (id || '').split(':')[2] || null
}

/**
 * Return an array of hierarchy identifiers from the service level down to
 * the given node. E.g. `service:scm:git:project` →
 *   ['service-scm', 'service-scm-git', 'service-scm-git-project']
 */
export function getHierarchyIds(id) {
  if (!id) return []
  const parts = id.split(':')
  const result = []
  for (let i = 2; i <= parts.length; i++) {
    result.push(parts.slice(0, i).join('-'))
  }
  return result
}

/**
 * Resolve the root service for a node (walks `refined` up the hierarchy).
 * Caches on the node object, matching the legacy behaviour.
 */
export function getService(node) {
  if (!node) return null
  if (node.service) return node.service
  node.service = (node.refined && getService(node.refined)) || node
  return node.service
}

/**
 * Resolve the first-level tool for a node (walks `refined` once from root).
 * Caches on the node object.
 */
export function getTool(node) {
  if (!node) return null
  if (node.tool) return node.tool
  if (!node.refined) return null
  node.tool = node.refined.refined ? getTool(node.refined) : node
  return node.tool
}

/* ---------- diacritics + normalization ----------
 * Condensed map compared to the legacy one: a few hundred codepoints were
 * enumerated individually; NFD + combining-mark stripping covers the same
 * ground in five lines and stays in sync with future Unicode additions.
 */

const STOPWORDS = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi

/** Remove diacritics and lower-case; cleans up common French stopwords. */
export function normalize(str) {
  if (!str) return ''
  return str
    .replace(/[-[()\]${},;_:]/g, ' ')
    .replace(STOPWORDS, ' ')
    .replace(/ {2,}/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Static mapping from Ligoj resource type → MDI icon id. */
export const TARGET_TYPE_ICON = {
  company: 'mdi-domain',
  group:   'mdi-account-group',
  project: 'mdi-folder',
  user:    'mdi-account',
  tree:    'mdi-source-branch',
  node:    'mdi-wrench',
}
