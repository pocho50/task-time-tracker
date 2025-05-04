import { GetUsersService } from '../../services/get-users';
import { UserRepository } from '../../repository/user';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const t = await useTranslation(event);

  // Permission check
  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.USERS_READ,
    t('server.unauthorizedRead')
  );

  // return all users
  try {
    const service = new GetUsersService(new UserRepository());
    return (await service.execute()).filter((u) => u.id !== user.id);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching users',
    });
  }
});
