import { SaveMeService } from '../../services/save-me';
import { UserRepository } from '../../repository/user';

// endpoint to save me
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Read the updated user profile from the request body
  const userData: SettingsDataForm = await readBody(event);

  try {
    const service = new SaveMeService(new UserRepository());
    const updatedUser = await service.execute(user.id, userData);
    await setUserSession(event, {
      user: {
        id: user.id,
        name: updatedUser.name,
        email: user.email,
        role: user.role,
        locale: updatedUser.locale,
        theme: updatedUser.theme,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error saving user:', error);
    throw createError({
      statusCode: 500,
      message: 'Error saving user',
    });
  }
});
