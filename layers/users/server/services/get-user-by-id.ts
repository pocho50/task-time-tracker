import type { UserRepository } from '../repository/user';

export class GetUserByIdService {
  constructor(private repo: UserRepository) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
