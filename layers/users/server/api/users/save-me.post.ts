import { SaveMeService } from '../../services/save-me';
import { UserRepository } from '../../repository/user';

// endpoint to save me
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Read the updated user profile from the request body
  const userData: UserDataForm = await readBody(event);

  try {
    const service = new SaveMeService(new UserRepository());
    await service.execute(user.id, userData);
    return await setUserSession(event, {
      user: {
        id: user.id,
        name: userData.name,
        email: userData.email,
        role: user.role,
        locale: userData.locale,
        theme: userData.theme,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error('Error saving user:', error);
    throw createError({
      statusCode: 500,
      message: 'Error saving user',
    });
  }
});
