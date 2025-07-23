import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class SprintsRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/sprints';

  async getByProjectId(projectId: string) {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}/${projectId}?${query}`);
  }

  async delete(id: string) {
    return this.fetch(`${this.basePath}/${id}`, {
      method: 'DELETE' as any,
    });
  }

  async save(data: any) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST' as any,
      body: data,
    });
  }
}
