import type { UserRepository } from '../repository/user';

export class SaveUserService {
  constructor(private repo: UserRepository) {}

  async execute(
    id: string | undefined,
    name: string,
    email: string,
    role: string,
    password?: string
  ) {
    return this.repo.save({
      id,
      name,
      email,
      role,
      password,
    });
  }
}
