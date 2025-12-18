import type { RoleRepository } from '../repository/role';

export class SaveRoleService {
  constructor(private repo: RoleRepository) {}

  async execute(key: string, name: string) {
    return this.repo.save({ key, name });
  }
}
