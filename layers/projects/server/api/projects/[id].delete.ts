// endpoint for deleting a project
import { ProjectRepository } from "../../repository/project";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Invalid project id",
    });
  }
  const projectRepository = new ProjectRepository();

  return projectRepository.delete(id);
});
