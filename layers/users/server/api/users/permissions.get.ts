import { defineEventHandler } from 'h3';
import { UserPermissionRepository } from '../../repository/user';

export default defineEventHandler(async (event: any) => {
  const { user } = await requireUserSession(event);

  const repo = new UserPermissionRepository();
  const permissions = await repo.findManyByRole(user.role);

  const permissionsRecord = permissions.reduce<Record<string, number>>(
    (acc, perm) => {
      acc[perm.entity] = perm.permission;
      return acc;
    },
    {}
  );

  return {
    permissions: permissionsRecord,
  };
});
