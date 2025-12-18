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

  // time tracks
  TIME_TRACKS_READ: 1,
  TIME_TRACKS_WRITE: 2,
  TIME_TRACKS_DELETE: 4,

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
