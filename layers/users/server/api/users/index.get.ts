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

    const result = await service.execute({ page, pageSize });
    // Filter out current user from the data
    return {
      ...result,
      data: result.data.filter((u: { id: string }) => u.id !== user.id),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching users',
    });
  }
});
