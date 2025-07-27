// endpoint for deleting a sprint
import { SprintRepository } from '../../repository/sprint';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ENTITY } from '#layers/projects/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { DeleteSprintService } from '../../services/delete-sprint';

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

  // Permission check - using projects entity since sprints are part of projects
  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorizedDelete')
  );

  const service = new DeleteSprintService(new SprintRepository());

  const deletedSprint = await service.execute(id);

  return {
    message: t('server.succesDeleteSprint') || 'Sprint deleted successfully',
    data: deletedSprint,
  };
});
