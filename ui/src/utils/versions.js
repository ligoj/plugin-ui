/*
 * Comparison of the version a tool instance runs with the latest released version of its tool, both as read by the
 * plug-in: only their first dotted numbers are compared ("v2.479.1-lts" reads 2.479.1), a missing one counting as 0.
 */

// The first dotted numbers of a version, null without any
function numbers(version) {
  const match = /\d+(?:\.\d+)*/.exec(String(version ?? ''))
  return match ? match[0].split('.').map(Number) : null
}

/**
 * @returns {-1|0|1|null} The sign of a - b, null when one of them has no number.
 */
export function compareVersions(a, b) {
  const x = numbers(a)
  const y = numbers(b)
  if (!x || !y) return null
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const diff = (x[i] || 0) - (y[i] || 0)
    if (diff) return Math.sign(diff)
  }
  return 0
}

/** True when the version is older than the latest one; false when they cannot be compared. */
export function isOutdated(version, latest) {
  return compareVersions(version, latest) === -1
}
