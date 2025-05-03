import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class ProjectsRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/projects';
  async getAll() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}?${query}`);
  }

  async delete(id: string) {
    return this.fetch(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  async save(data: ProjectFormData) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST',
      body: data,
    });
  }
}
