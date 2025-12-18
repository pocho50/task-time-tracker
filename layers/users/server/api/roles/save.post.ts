import { RoleRepository } from '../../repository/role';
import { SaveRoleService } from '../../services/save-role';
import { roleSchema } from '#layers/users/schemas';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.USERS_WRITE,
    t('server.unauthorized')
  );

  const { key, name } = await readValidatedBody(event, roleSchema.parse);

  const service = new SaveRoleService(new RoleRepository());

  try {
    const savedRole = await service.execute(key, name);

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
