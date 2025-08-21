import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class SprintsRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/sprints';

  async getByProjectId(projectId: string) {
    const query = this.getQueryParams();
    return this.fetch(
      `${this.basePath}/by-project?id_project=${projectId}&${query}`
    );
  }

  async getById(id: string): Promise<Sprint | null> {
    // @ts-ignore
    return this.fetch(`${this.basePath}/${id}`);
  }

  async delete(id: string) {
    return this.fetch(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  async save(data: any) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST',
      body: data,
    });
  }
}
