import type { RoleRepository } from '../repository/role';

export class GetRolesService {
  constructor(private repo: RoleRepository) {}

  async execute() {
    return {
      data: await this.repo.findMany(),
    };
  }
}
