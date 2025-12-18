import { BaseRepo } from '#layers/shared/repository/baseRepo';

export interface RoleDto {
  id: string;
  key: string;
  name: string;
}

export class RoleRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/roles';

  getAll() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}?${query}`);
  }
}
