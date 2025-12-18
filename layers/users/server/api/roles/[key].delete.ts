import { RoleRepository } from '../../repository/role';
import { DeleteRoleService } from '../../services/delete-role';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ROLES } from '#layers/shared/utils/constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.USERS_WRITE,
    t('server.unauthorizedDelete')
  );

  const key = event.context.params?.key;

  if (!key) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidRoleKey') || 'Invalid role key',
    });
  }

  if (key === ROLES.ADMIN) {
    throw createError({
      statusCode: 403,
      message:
        t('server.roleAdminCannotBeDeleted') || 'ADMIN role cannot be deleted',
    });
  }

  const repo = new RoleRepository();
  const usersCount = await repo.countUsersByRoleKey(key);
  if (usersCount > 0) {
    throw createError({
      statusCode: 409,
      message:
        t('server.roleAssignedToUsers') ||
        'Role is assigned to one or more users',
    });
  }

  const service = new DeleteRoleService(repo);

  try {
    const deletedRole = await service.execute(key);
    return {
      message: t('server.succesDeleteRole') || 'Role deleted successfully',
      data: deletedRole,
    };
  } catch (error) {
    console.error('Error deleting role:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorDeletingRole') || 'Error deleting role',
    });
  }
});
