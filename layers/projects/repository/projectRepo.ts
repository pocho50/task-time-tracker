import { BaseRepo } from "./baseRepo";

export class ProjectsRepo<T> extends BaseRepo<T> {
  readonly basePath = "/api/projects";
  async getAll() {
    const query = this.getQueryParams();
    return this.fetch(`${this.basePath}?${query}`);
  }

  async save(data: ProjectFormData) {
    return this.fetch(`${this.basePath}/save`, {
      method: "POST",
      body: data,
    });
  }
}
