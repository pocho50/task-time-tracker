import type { RoleRepository } from '../repository/role';

export class DeleteRoleService {
  constructor(private repo: RoleRepository) {}

  async execute(key: string) {
    return this.repo.deleteByKey(key);
  }
}
