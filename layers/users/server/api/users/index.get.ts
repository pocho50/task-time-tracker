import { GetUsersService } from '../../services/get-users';
import { UserRepository } from '../../repository/user';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { DEFAULT_PAGE_SIZE } from '../../constants';
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

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;

  try {
    const service = new GetUsersService(new UserRepository());

    return await service.execute({ page, pageSize });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching users',
    });
  }
});
