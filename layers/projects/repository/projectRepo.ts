import { BaseRepo } from "./baseRepo";

export class ProjectsRepo<T> extends BaseRepo<T> {
  async getAll() {
    const query = this.getQueryParams();
    return this.fetch(`/api/projects?${query}`);
  }
}
