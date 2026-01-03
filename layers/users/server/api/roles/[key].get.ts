import { RoleRepository } from '../../repository/role';
import { UserPermissionRepository } from '../../repository/user';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import {
  assertHasPermissionOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.ROLES,
    PERMISSIONS.ROLES_READ,
    t('server.unauthorizedRead')
  );

  const key = event.context.params?.key;

  if (!key) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidRoleKey') || 'Invalid role key',
    });
  }

  const normalizedKey = decodeURIComponent(key).trim();

  const repo = new RoleRepository();
  const permissionsRepo = new UserPermissionRepository();

  const role = await repo.findByKey(normalizedKey);
  if (!role) {
    throw createError({
      statusCode: 404,
      message: t('server.invalidRoleKey') || 'Invalid role key',
    });
  }

  const rolePermissions = await permissionsRepo.findManyByRole(normalizedKey);
  const byEntity = new Map(
    rolePermissions.map((p) => [p.entity, p.permission])
  );

  return {
    data: {
      key: role.key,
      name: role.name,
      permissions: {
        projects: byEntity.get(ALL_ENTITIES.PROJECTS) ?? 0,
        sprints: byEntity.get(ALL_ENTITIES.SPRINTS) ?? 0,
        tasks: byEntity.get(ALL_ENTITIES.TASKS) ?? 0,
        users: byEntity.get(ALL_ENTITIES.USERS) ?? 0,
        roles: byEntity.get(ALL_ENTITIES.ROLES) ?? 0,
        working: byEntity.get(ALL_ENTITIES.WORKING) ?? 0,
        reports: byEntity.get(ALL_ENTITIES.REPORTS) ?? 0,
      },
    },
  };
});
