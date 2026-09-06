/**
 * Roles of a system user (rest/system/user/roles): the roles assigned in Ligoj (`roles`, with an id) and the
 * federated roles obtained at login from the identity provider groups (`federatedRoles`: `id` is the granting
 * group, `name` is the system role name).
 */
export function federatedRoles(user) {
  return Array.isArray(user?.federatedRoles) ? user.federatedRoles : []
}

export function hasAnyRole(user) {
  return (user?.roles || []).length > 0 || federatedRoles(user).length > 0
}

/** Every role name, assigned first then federated (CSV export). */
export function roleNames(user) {
  return [...(user?.roles || []).map((r) => r.name), ...federatedRoles(user).map((r) => r.name)]
}

/** Whether a role of the catalogue (id + name) applies to the user, assigned or federated. */
export function appliesTo(role, user) {
  const ids = new Set((user?.roles || []).map((r) => r.id))
  const names = new Set(federatedRoles(user).map((r) => r.name))
  return ids.has(role.id) || names.has(role.name)
}
