import { SprintRepository } from '../../repository/sprint';
import { sprintSchema } from '#layers/sprints/schemas';
import { SaveSprintService } from '../../services/save-sprint';
import {
  assertHasPermissionOrThrow,
  assertUserInProjectOrAdminOrThrow,
} from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const { id, name, startDate, endDate, status, projectId } =
    await readValidatedBody(event, sprintSchema.parse);

  const repo = new SprintRepository();

  assertHasPermissionOrThrow(
    user?.permissions,
    ALL_ENTITIES.SPRINTS,
    PERMISSIONS.SPRINTS_WRITE,
    t('server.unauthorized')
  );

  await assertUserInProjectOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    projectId: projectId!,
    isUserInProject: repo.isUserInProject.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  try {
    const service = new SaveSprintService(repo);
    const savedSprint = await service.execute(
      id,
      name,
      startDate,
      endDate,
      status || 'PLANNING',
      projectId!
    );

    return {
      message: t('server.succesSaveSprint') || 'Sprint saved successfully',
      data: savedSprint,
    };
  } catch (error) {
    console.error('Error saving sprint:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving'),
    });
  }
});
