// endpoint for deleting a sprint
import { SprintRepository } from '../../repository/sprint';
import {
  assertHasPermissionOrThrow,
  assertUserInProjectOrAdminOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
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

  const repo = new SprintRepository();

  const permissions = await getRolePermissions(event, user.role);

  // Permission check
  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.SPRINTS,
    PERMISSIONS.SPRINTS_DELETE,
    t('server.unauthorizedDelete')
  );

  const sprint = await repo.getById(id);
  if (!sprint) {
    throw createError({
      statusCode: 404,
      message: t('server.sprintNotFound'),
    });
  }

  await assertUserInProjectOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    projectId: sprint.projectId,
    isUserInProject: repo.isUserInProject.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  const service = new DeleteSprintService(repo);

  const deletedSprint = await service.execute(id);

  return {
    message: t('server.succesDeleteSprint') || 'Sprint deleted successfully',
    data: deletedSprint,
  };
});
