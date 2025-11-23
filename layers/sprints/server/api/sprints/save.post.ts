import { SprintRepository } from '../../repository/sprint';
import { sprintSchema } from '#layers/sprints/schemas';
import { SaveSprintService } from '../../services/save-sprint';
import { ROLES } from '#layers/shared/utils/constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const { id, name, startDate, endDate, status, projectId } =
    await readValidatedBody(event, sprintSchema.parse);

  const repo = new SprintRepository();

  // Check if user has access to this project (admins always have access)
  const hasAccess =
    user.role === ROLES.ADMIN ||
    (await repo.isUserInProject(user.id, projectId!));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

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
