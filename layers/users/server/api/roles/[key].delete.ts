import { RoleRepository } from '../../repository/role';
import { DeleteRoleService } from '../../services/delete-role';
import { ALL_ENTITIES, ROLES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import {
  assertHasPermissionOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';
import { PrismaClient } from '@prisma/client';
import { UserPermissionRepository } from '../../repository/user';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.ROLES,
    PERMISSIONS.ROLES_DELETE,
    t('server.unauthorizedDelete')
  );

  const key = event.context.params?.key;

  if (!key) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidRoleKey') || 'Invalid role key',
    });
  }

  const normalizedKey = decodeURIComponent(key).trim();

  if (normalizedKey === ROLES.ADMIN) {
    throw createError({
      statusCode: 403,
      message:
        t('server.roleAdminCannotBeDeleted') || 'ADMIN role cannot be deleted',
    });
  }

  const prisma = new PrismaClient();
  const repo = new RoleRepository(prisma);

  const role = await repo.findByKey(normalizedKey);
  if (!role) {
    throw createError({
      statusCode: 404,
      message: t('server.invalidRoleKey') || 'Invalid role key',
    });
  }

  const usersCount = await repo.countUsersByRoleKey(normalizedKey);
  if (usersCount > 0) {
    throw createError({
      statusCode: 409,
      message:
        t('server.roleAssignedToUsers') ||
        'Role is assigned to one or more users',
    });
  }

  try {
    const deletedRole = await prisma.$transaction(async (tx) => {
      const permissionsRepoTx = new UserPermissionRepository(tx);
      const roleRepoTx = new RoleRepository(tx);

      await permissionsRepoTx.deleteManyByRole(normalizedKey);
      const serviceTx = new DeleteRoleService(roleRepoTx);
      return await serviceTx.execute(normalizedKey);
    });
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
