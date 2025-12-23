import { SprintRepository } from '../../repository/sprint';
import { assertUserInProjectOrAdminOrThrow } from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Get the sprint ID from the route params
  const sprintId = getRouterParam(event, 'id');

  if (!sprintId) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidSprintId'),
    });
  }

  const repo = new SprintRepository();

  // Get the sprint by ID
  const sprint = await repo.getById(sprintId);

  if (!sprint) {
    throw createError({
      statusCode: 404,
      message: t('server.sprintNotFound'),
    });
  }

  // Check if user has access to this sprint's project (admins always have access)
  await assertUserInProjectOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    projectId: sprint.projectId,
    isUserInProject: repo.isUserInProject.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  return sprint;
});
