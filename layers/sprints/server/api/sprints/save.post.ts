import { SprintRepository } from '../../repository/sprint';
import { sprintSchema } from '#layers/sprints/schemas';
import { SaveSprintService } from '../../services/save-sprint';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const { id, name, startDate, endDate, status, projectId } = await readValidatedBody(event, sprintSchema.parse);

  try {
    const repo = new SprintRepository();

    // Check if user has access to this project
    const hasAccess = await repo.isUserInProject(user.id, projectId!);

    if (!hasAccess) {
      throw createError({
        statusCode: 401,
        message: t('server.unauthorizedAccess'),
      });
    }

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
