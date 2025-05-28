import type { UserRepository } from '../repository/user';
import { type UserRole } from '@prisma/client';

export class SaveUserService {
  constructor(private repo: UserRepository) {}

  async execute(
    id: string | undefined,
    name: string,
    email: string,
    role: UserRole,
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
