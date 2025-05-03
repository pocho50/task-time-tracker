import { GetUsersService } from '../../services/get-users';
import { UserRepository } from '../../repository/user';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // TODO: Permission check

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
