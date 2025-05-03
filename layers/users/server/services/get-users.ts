import type { UserRepository } from '../repository/user';

// get userse services
export class GetUsersService {
  constructor(private repo: UserRepository) {}

  async execute() {
    return this.repo.findMany();
  }
}
