// endpoint for deleting a project
import { ProjectRepository } from '../../repository/project';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ENTITY } from '#layers/projects/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidId'),
    });
  }

  // Permission check
  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorizedDelete')
  );

  const projectRepository = new ProjectRepository();

  return projectRepository.delete(id);
});
