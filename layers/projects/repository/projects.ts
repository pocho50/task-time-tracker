import type { NitroFetchRequest, $Fetch } from "nitropack";
export const projectsRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getAll() {
    return fetch("/api/projects");
  },
});
