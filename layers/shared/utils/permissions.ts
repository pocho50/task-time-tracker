// Global permissions constants for use in both backend and frontend
// Each entity type (projects, users, etc.) has its own bitmask range
export const PERMISSIONS = {
  // projects
  PROJECTS_WRITE: 2,
  PROJECTS_DELETE: 4,

  // sprints
  SPRINTS_READ: 1,
  SPRINTS_WRITE: 2,
  SPRINTS_DELETE: 4,

  // tasks
  TASKS_READ: 1,
  TASKS_WRITE: 2,
  TASKS_DELETE: 4,

  // working
  WORKING_READ: 1,

  // users
  USERS_READ: 1,
  USERS_WRITE: 2,
  USERS_DELETE: 4,

  // roles
  ROLES_READ: 1,
  ROLES_WRITE: 2,
  ROLES_DELETE: 4,
};

type PermissionArray = { entity: string; permission: number }[];
type PermissionRecord = Record<string, number>;
export type UserPermissions = PermissionArray | PermissionRecord;

// Helper to check if a user has a specific permission
export function hasPermission(
  userPermission: UserPermissions,
  permission: { entity: string; permission: number }
): boolean {
  const userPerm = Array.isArray(userPermission)
    ? userPermission.find((perm) => perm.entity === permission.entity)
        ?.permission
    : userPermission[permission.entity];

  if (userPerm)
    return (userPerm & permission.permission) === permission.permission;
  return false;
}
