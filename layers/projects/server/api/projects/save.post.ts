import { ProjectRepository } from '../../repository/project';
import { projectSchema } from '#layers/projects/schemas';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { ENTITY } from '#layers/projects/utils/constants';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { SaveProjectsService } from '../../services/save-projects';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorized')
  );

  // validate schema
  const { id, name, description, usersId } = await readValidatedBody(
    event,
    projectSchema.parse
  );

  try {
    const service = new SaveProjectsService(new ProjectRepository());
    const allUsersId = usersId ?? [];
    if (!usersId?.includes(user.id)) allUsersId.push(user.id);
    return service.execute(id, name, description, allUsersId);
  } catch (error) {
    console.error('Error saving project:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving'),
    });
  }
});
