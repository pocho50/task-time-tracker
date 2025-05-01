import { loginSchema } from '#layers/users/schemas';
import { LoginService } from '../../services/login';

export default defineEventHandler(async (event) => {
  // Get translation function for server-side
  const t = await useTranslation(event);

  try {
    const { email, password } = await readValidatedBody(
      event,
      loginSchema.parse
    );
    const loginService = new LoginService();
    return await loginService.execute(
      { email, password },
      setUserSession,
      event
    );
  } catch (error) {
    console.error('Login error:', error);
    throw createError({
      statusCode: 401,
      message: t('login.error'),
    });
  }
});
