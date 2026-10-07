import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'reservations' | 'editor'

type MaybeUser = { roles?: string[] | null } | null | undefined

const userHas = (user: MaybeUser, roles: Role[]) =>
  Boolean(user?.roles?.some((r) => roles.includes(r as Role)))

const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) =>
    userHas(user as MaybeUser, roles)

export const isAdmin = hasRole('admin')
export const isStaff = hasRole('admin', 'reservations', 'editor')
export const canManageContent = hasRole('admin', 'editor')
export const canManageBookings = hasRole('admin', 'reservations')
export const anyone: Access = () => true

export const isAdminField: FieldAccess = ({ req: { user } }) => userHas(user as MaybeUser, ['admin'])
