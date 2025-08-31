import { BaseRepo } from '#layers/shared/repository/baseRepo';

export class TaskRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/tasks';

  async getBySprintId(sprintId: string) {
    const query = this.getQueryParams();
    return this.fetch(
      `${this.basePath}/by-sprint?sprintId=${sprintId}&${query}`
    );
  }

  async getTimeTracks(taskId: string) {
    return this.fetch(`${this.basePath}/time-tracks/by-task?taskId=${taskId}`);
  }
}
