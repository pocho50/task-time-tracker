import { ProjectRepository } from "../../repository/project";
import { projectSchema } from "#layers/projects/schemas";
import { PERMISSIONS } from "#layers/shared/utils/permissions";
import { ENTITY } from "#layers/projects/utils/constants";
import { assertHasPermissionOrThrow } from "#layers/shared/server/utils";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Permission check (reusable helper)
  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorized')
  );

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
      userId: user.id,
    });

    return project;
  } catch (error) {
    console.error("Error saving project:", error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving'),
    });
  }
});
