import type { UserRepository } from '../repository/user';

export class DeleteUserService {
  constructor(private repo: UserRepository) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
