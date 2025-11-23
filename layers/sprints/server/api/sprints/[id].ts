import { SprintRepository } from '../../repository/sprint';
import { ROLES } from '#layers/shared/utils/constants';

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
  const hasAccess =
    user.role === ROLES.ADMIN ||
    (await repo.isUserInProject(user.id, sprint.projectId));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

  return sprint;
});
