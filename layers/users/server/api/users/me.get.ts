import { GetUserByIdService } from '../../services/get-user-by-id';
import { UserRepository } from '../../repository/user';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  try {
    const service = new GetUserByIdService(new UserRepository());
    return await service.execute(user.id);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching user',
    });
  }
});
