import { BaseRepo } from '#layers/shared/repository/baseRepo';

export interface RoleDto {
  id: string;
  key: string;
  name: string;
}

export interface RoleSavePayload {
  key: string;
  name: string;
  permissions: {
    projects: number;
    sprints: number;
    tasks: number;
    users: number;
    roles: number;
    working: number;
    reports: number;
  };
}

export interface RoleWithPermissionsDto {
  key: string;
  name: string;
  permissions: RoleSavePayload['permissions'];
}

export class RoleRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/roles';

  getAll() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}?${query}`);
  }

  save(data: RoleSavePayload) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST',
      body: data,
    });
  }

  getByKey(key: string) {
    const safeKey = encodeURIComponent(key.trim());
    return this.fetch(`${this.basePath}/${safeKey}`);
  }

  delete(key: string) {
    const safeKey = encodeURIComponent(key.trim());
    return this.fetch(`${this.basePath}/${safeKey}`, {
      method: 'DELETE',
    });
  }
}
