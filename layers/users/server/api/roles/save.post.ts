import { RoleRepository } from '../../repository/role';
import { SaveRoleService } from '../../services/save-role';
import { roleSchema } from '#layers/users/schemas';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { PrismaClient } from '@prisma/client';
import { UserPermissionRepository } from '../../repository/user';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ALL_ENTITIES.ROLES,
    PERMISSIONS.ROLES_WRITE,
    t('server.unauthorized')
  );

  const { key, name, permissions } = await readValidatedBody(
    event,
    roleSchema.parse
  );

  const prisma = new PrismaClient();

  try {
    const savedRole = await prisma.$transaction(
      async (tx) => {
        const roleRepo = new RoleRepository(tx);
        const permissionsRepo = new UserPermissionRepository(tx);
        const service = new SaveRoleService(roleRepo);

        const saved = await service.execute(key, name);

        if (permissions) {
          await Promise.all([
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.PROJECTS,
              permission: permissions.projects,
            }),
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.SPRINTS,
              permission: permissions.sprints,
            }),
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.TASKS,
              permission: permissions.tasks,
            }),
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.USERS,
              permission: permissions.users,
            }),
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.ROLES,
              permission: permissions.roles,
            }),
            permissionsRepo.upsertByRoleAndEntity({
              role: key,
              entity: ALL_ENTITIES.WORKING,
              permission: permissions.working,
            }),
          ]);
        }

        return saved;
      },
      {
        timeout: 15000,
      }
    );

    return {
      message: t('server.succesSaveRole') || 'Role saved successfully',
      data: savedRole,
    };
  } catch (error) {
    console.error('Error saving role:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSavingRole') || 'Error saving role',
    });
  }
});
