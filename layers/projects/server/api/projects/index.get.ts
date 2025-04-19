import { Project } from "../../repositories/project";
import { GetProjectsService } from "../../services/get-projects";
import { DEFAULT_PAGE_SIZE } from "../../constants";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;

  const repo = new Project();
  const service = new GetProjectsService(repo);
  return service.execute({
    userId: user.id,
    page,
    pageSize,
  });
});
