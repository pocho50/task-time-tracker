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

  async getWorkingTasks() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}/working?${query}`);
  }

  async updateSession(data: {
    id?: string;
    taskId: string;
    start?: string;
    end?: string | null;
    notes?: string | null;
    fullUpdate?: boolean;
  }) {
    return this.fetch(`${this.basePath}/time-tracks`, {
      method: 'POST',
      body: data,
    });
  }

  async startSession(taskId: string, notes?: string) {
    return this.updateSession({
      taskId,
      start: new Date().toISOString(),
      notes,
    });
  }

  async endSession(id: string, taskId: string, notes?: string) {
    return this.updateSession({
      id,
      taskId,
      end: new Date().toISOString(),
      notes,
    });
  }
}
