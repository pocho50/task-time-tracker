// Global permissions constants for use in both backend and frontend
// Each entity type (projects, users, etc.) has its own bitmask range
export const PERMISSIONS = {
  // projects
  PROJECTS_READ: 1,
  PROJECTS_WRITE: 2,
  PROJECTS_DELETE: 4,

  // users
  USERS_READ: 1,
  USERS_WRITE: 2,
  USERS_DELETE: 4,
};

// Helper to check if a user has a specific permission
export function hasPermission(
  userPermission: { entity: string; permission: number }[],
  permission: { entity: string; permission: number }
): boolean {
  const userPerm = userPermission.find(
    (perm) => perm.entity === permission.entity
  )?.permission;

  if (userPerm)
    return (userPerm & permission.permission) === permission.permission;
  return false;
}
