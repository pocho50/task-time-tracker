import { ALL_ENTITIES, ROLES } from '#layers/shared/utils/constants';
import { PERMISSIONS, hasPermission } from '#layers/shared/utils/permissions';

export function useUser() {
  const { user } = useUserSession();

  const userIsAllowedToWrite = (entity: string) => {
    const writePermissionByEntity: Record<string, number> = {
      [ALL_ENTITIES.PROJECTS]: PERMISSIONS.PROJECTS_WRITE,
      [ALL_ENTITIES.SPRINTS]: PERMISSIONS.SPRINTS_WRITE,
      [ALL_ENTITIES.TASKS]: PERMISSIONS.TASKS_WRITE,
      [ALL_ENTITIES.USERS]: PERMISSIONS.USERS_WRITE,
      [ALL_ENTITIES.ROLES]: PERMISSIONS.ROLES_WRITE,
    };

    return hasPermission(user?.value?.permissions ?? [], {
      entity: entity,
      permission: writePermissionByEntity[entity] ?? 0,
    });
  };

  const userIsAllowedToDelete = (entity: string) => {
    const deletePermissionByEntity: Record<string, number> = {
      [ALL_ENTITIES.PROJECTS]: PERMISSIONS.PROJECTS_DELETE,
      [ALL_ENTITIES.SPRINTS]: PERMISSIONS.SPRINTS_DELETE,
      [ALL_ENTITIES.TASKS]: PERMISSIONS.TASKS_DELETE,
      [ALL_ENTITIES.USERS]: PERMISSIONS.USERS_DELETE,
      [ALL_ENTITIES.ROLES]: PERMISSIONS.ROLES_DELETE,
    };

    return hasPermission(user?.value?.permissions ?? [], {
      entity: entity,
      permission: deletePermissionByEntity[entity] ?? 0,
    });
  };

  const userIsAdmin = computed(() => user.value?.role === ROLES.ADMIN);

  return {
    userIsAllowedToWrite,
    userIsAllowedToDelete,
    user,
    userIsAdmin,
  };
}
