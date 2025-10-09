import { TimeTrackRepository } from '../../../repository/time-track';
import { GetTimeTracksService } from '../../../services/get-time-tracks';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const query = getQuery(event);
  const taskId = query.taskId as string;

  // Validate taskId is provided
  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: t('server.taskIdRequired'),
    });
  }

  const repo = new TimeTrackRepository();

  // Check if user has access to this task (admins always have access)
  const hasAccess =
    user.role === 'ADMIN' || (await repo.isUserInTask(user.id, taskId));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

  try {
    const service = new GetTimeTracksService(repo);
    return service.execute({
      taskId,
    });
  } catch (error) {
    console.error('Error fetching time tracks:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});
