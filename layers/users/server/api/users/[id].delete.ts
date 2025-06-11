// endpoint for deleting a user
import { UserRepository } from '../../repository/user';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { DeleteUserService } from '../../services/delete-user';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidId'),
    });
  }

  // Permission check
  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.USERS_WRITE,
    t('server.unauthorizedDelete')
  );

  const service = new DeleteUserService(new UserRepository());
  try {
    await service.execute(id);
    return { message: t('server.succesDeleteUser') };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorDeleting') || 'Error deleting user',
    });
  }
});
