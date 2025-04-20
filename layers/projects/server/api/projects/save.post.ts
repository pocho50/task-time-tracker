import { ProjectRepository } from "../../repository/project";
import { projectSchema } from "#layers/projects/schemas";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // validate schema
  const { id, name, description } = await readValidatedBody(
    event,
    projectSchema.parse
  );
  const projectRepository = new ProjectRepository();

  try {
    const project = await projectRepository.save({
      id,
      name,
      description: description || "",
    });

    return project;
  } catch (error) {
    console.error("Error saving project:", error);
    throw createError({
      statusCode: 500,
      message: "Error saving project",
    });
  }
});
