// endpoint for deleting a project
import { ProjectRepository } from '../../repository/project';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { DeleteProjectsService } from '../../services/delete-projects';

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
    ALL_ENTITIES.PROJECTS,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorizedDelete')
  );

  const service = new DeleteProjectsService(new ProjectRepository());

  const deletedProject = await service.execute(id);

  return {
    message: t('server.succesDeleteProject') || 'Project deleted successfully',
    data: deletedProject,
  };
});
