export function useUser() {
  const { user } = useUserSession();

  const userIsAllowedToWrite = (entity: string) => {
    return hasPermission(user?.value?.permissions ?? [], {
      entity: entity,
      permission: PERMISSIONS.PROJECTS_WRITE,
    });
  };

  return {
    userIsAllowedToWrite,
    user,
  };
}
