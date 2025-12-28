import { UserRepository, UserPermissionRepository } from '../repository/user';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginService {
  constructor(
    private userRepo = new UserRepository(),
    private permRepo = new UserPermissionRepository()
  ) {}

  async execute(
    { email, password }: LoginInput,
    setUserSession: Function,
    event: any
  ) {
    // Get translation function for server-side
    const t = await useTranslation(event);

    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await verifyPassword(user.password, password))) {
      throw createError({
        statusCode: 401,
        message: t('login.error'),
      });
    }
    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        locale: user.locale,
        theme: user.theme,
      },
    });
    return {};
  }
}
