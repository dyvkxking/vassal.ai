// Role-based access control
import type { UserRole } from '@/types'

/**
 * Role hierarchy for permission checking
 * Higher index = more permissions
 * A role can perform actions requiring any role at or below its level
 */
export const RoleHierarchy: UserRole[] = [
  'client',    // 0 - Basic user, can use agents
  'creator',   // 1 - Can create agents
  'provider',  // 2 - Can run nodes
  'governor',  // 3 - Can participate in governance
  'admin',     // 4 - Full system access
]

/**
 * Permission definitions per role
 * Maps operations to allowed roles
 */
export const RolePermissions: Record<string, UserRole[]> = {
  // Agent operations
  'agent:create': ['creator', 'admin'],
  'agent:update': ['creator', 'admin'],
  'agent:delete': ['creator', 'admin'],
  'agent:view': ['client', 'creator', 'provider', 'governor', 'admin'],

  // Node operations
  'node:register': ['provider', 'admin'],
  'node:update': ['provider', 'admin'],
  'node:deregister': ['provider', 'admin'],
  'node:view': ['client', 'creator', 'provider', 'governor', 'admin'],

  // Session operations
  'session:create': ['client', 'creator', 'provider', 'governor', 'admin'],
  'session:view': ['client', 'creator', 'provider', 'governor', 'admin'],
  'session:feedback': ['client', 'admin'],

  // Governance operations
  'proposal:create': ['governor', 'admin'],
  'proposal:vote': ['governor', 'admin'],
  'proposal:view': ['client', 'creator', 'provider', 'governor', 'admin'],

  // Skill operations
  'skill:publish': ['creator', 'admin'],
  'skill:update': ['creator', 'admin'],
  'skill:view': ['client', 'creator', 'provider', 'governor', 'admin'],

  // Stake operations
  'stake:delegate': ['client', 'creator', 'provider', 'governor', 'admin'],
  'stake:unstake': ['client', 'creator', 'provider', 'governor', 'admin'],
  'stake:view': ['client', 'creator', 'provider', 'governor', 'admin'],

  // Admin operations
  'admin:moderate': ['admin'],
  'admin:settings': ['admin'],
  'admin:view-all': ['admin'],
}

/**
 * Get the role level (index in hierarchy)
 * @param role - The role to check
 * @returns The role's level (0-4), or -1 if not found
 */
export function getRoleLevel(role: UserRole): number {
  return RoleHierarchy.indexOf(role)
}

/**
 * Check if a user role meets the required role
 * Uses role hierarchy - a role can perform actions requiring any role at or below its level
 * @param userRole - The user's role
 * @param requiredRole - The required role (or array of allowed roles)
 * @returns True if user has sufficient permissions
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const userLevel = getRoleLevel(userRole)

  if (userLevel === -1) {
    return false
  }

  // If requiredRole is an array, check if user has any of the required roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.some((role) => {
      const requiredLevel = getRoleLevel(role)
      return userLevel >= requiredLevel
    })
  }

  // Single role check
  const requiredLevel = getRoleLevel(requiredRole)
  return userLevel >= requiredLevel
}

/**
 * Check if a user has permission for a specific operation
 * @param userRole - The user's role
 * @param operation - The operation to check
 * @returns True if user has permission
 */
export function hasPermission(userRole: UserRole, operation: string): boolean {
  const allowedRoles = RolePermissions[operation]

  if (!allowedRoles) {
    return false
  }

  return allowedRoles.includes(userRole)
}

/**
 * Get all roles that can perform an operation
 * @param operation - The operation to check
 * @returns Array of roles that can perform the operation
 */
export function getRolesForOperation(operation: string): UserRole[] {
  return RolePermissions[operation] || []
}

/**
 * Check if role is admin
 * @param role - The role to check
 * @returns True if admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

/**
 * Check if role is governor or above
 * @param role - The role to check
 * @returns True if governor or higher
 */
export function isGovernorOrAbove(role: UserRole): boolean {
  return hasRole(role, 'governor')
}

/**
 * Check if role is provider or above
 * @param role - The role to check
 * @returns True if provider or higher
 */
export function isProviderOrAbove(role: UserRole): boolean {
  return hasRole(role, 'provider')
}

/**
 * Check if role is creator or above
 * @param role - The role to check
 * @returns True if creator or higher
 */
export function isCreatorOrAbove(role: UserRole): boolean {
  return hasRole(role, 'creator')
}