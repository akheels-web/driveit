import type { Access, FieldAccess } from 'payload'

/**
 * Access control helpers.
 *
 * Payload users are staff (CMS editors/admins) — customers authenticate with
 * Auth.js and are stored in the `customers` collection, so they never reach
 * these checks.
 *
 * Roles:
 *  - `admin`  → full access, including users, roles and site settings
 *  - `editor` → may manage content, but not users/settings/roles
 *
 * Users created before the `role` field existed have `role == null`. They are
 * treated as admins so an upgrade can never lock the owner out of `/admin`.
 * Assign an explicit role to every user once you have more than one.
 */
export type StaffUser = {
  id?: number | string
  role?: 'admin' | 'editor' | null
} | null

export const isAdminUser = (user?: unknown): boolean => {
  if (!user || typeof user !== 'object') return false
  const role = (user as StaffUser)?.role
  return role === 'admin' || role === null || role === undefined
}

export const isEditorUser = (user?: unknown): boolean => Boolean(user)

/** Public read access (published marketing content). */
export const anyone: Access = () => true

/** Any signed-in Payload staff user. */
export const staffOnly: Access = ({ req: { user } }) => Boolean(user)

/** Admins (and legacy staff without a role) only. */
export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user)

/** Admins can access anything; staff can access their own document. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdminUser(user)) return true
  return { id: { equals: user.id } }
}

/** Only admins may change protected fields (e.g. `role`). */
export const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Read access scoped to the signed-in staff user's own record. */
export const ownUserField: FieldAccess = ({ req: { user }, id }) => {
  if (!user) return false
  if (isAdminUser(user)) return true
  return String(user.id) === String(id)
}
