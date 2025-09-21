import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class TaskRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/tasks';

  async save(data: any) {
    return this.fetch(`${this.basePath}/save`, {
      method: 'POST',
      body: data,
    });
  }

  async delete(id: string) {
    return this.fetch(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  async getBySprintId(sprintId: string) {
    const query = this.getQueryParams();
    return this.fetch(
      `${this.basePath}/by-sprint?sprintId=${sprintId}&${query}`
    );
  }

  async getTimeTracks(taskId: string) {
    return this.fetch(`${this.basePath}/time-tracks/by-task?taskId=${taskId}`);
  }

  async startSession(taskId: string, notes?: string) {
    return this.fetch(`${this.basePath}/time-tracks`, {
      method: 'POST',
      body: {
        taskId,
        start: Date.now(),
        notes,
      },
    });
  }

  async endSession(id: string, taskId: string, notes?: string) {
    return this.fetch(`${this.basePath}/time-tracks`, {
      method: 'POST',
      body: {
        id,
        end: Date.now(),
        taskId,
        notes,
      },
    });
  }
}
