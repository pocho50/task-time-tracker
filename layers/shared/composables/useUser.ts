import { ROLES } from '#layers/shared/utils/constants';

export function useUser() {
  const { user } = useUserSession();

  const userIsAllowedToWrite = (entity: string) => {
    return hasPermission(user?.value?.permissions ?? [], {
      entity: entity,
      permission: PERMISSIONS.PROJECTS_WRITE, // permision 2
    });
  };

  const userIsAdmin = computed(() => user.value?.role === ROLES.ADMIN);

  return {
    userIsAllowedToWrite,
    user,
    userIsAdmin,
  };
}
