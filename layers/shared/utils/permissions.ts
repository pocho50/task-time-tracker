// Global permissions constants for use in both backend and frontend
// Each entity type (projects, tasks, etc.) has its own bitmask range
export const PERMISSIONS = {
  PROJECTS_READ: 1,
  PROJECTS_WRITE: 2,
  PROJECTS_DELETE: 4,
  // Reserve next bits for other entities
  TASKS_READ: 8,
  TASKS_WRITE: 16,
  TASKS_DELETE: 32,
  // Add more as needed
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
