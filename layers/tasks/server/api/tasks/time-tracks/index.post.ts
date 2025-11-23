import { TimeTrackRepository } from '../../../repository/time-track';
import {
  CreateUpdateTimeTrackService,
  TimeTrackError,
} from '../../../services/save-time-track';
import { ROLES } from '#layers/shared/utils/constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const body = await readBody<TimeTrackRequestBody>(event);

  // Validate required taskId
  if (!body.taskId) {
    throw createError({
      statusCode: 400,
      message: t('server.taskIdRequired'),
    });
  }

  const repo = new TimeTrackRepository();

  // Check if user has access to this task (admins always have access)
  const hasAccess =
    user.role === ROLES.ADMIN ||
    (await repo.isUserInTask(user.id, body.taskId));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

  try {
    const service = new CreateUpdateTimeTrackService(repo);

    // Determine if this is create or update based on provided fields
    if (!body.id && body.start) {
      // CREATE: Only taskId and start provided
      const result = await service.create({
        taskId: body.taskId,
        userId: user.id,
        start: new Date(body.start),
        end: body.end ? new Date(body.end) : undefined,
        notes: body.notes,
      });

      return { data: result };
    }

    if (body.id && body.fullUpdate) {
      // FULL UPDATE: Edit entire session from edit form
      const result = await service.update({
        id: body.id,
        start: body.start ? new Date(body.start) : undefined,
        end: body.end ? new Date(body.end) : undefined,
        notes: body.notes,
      });

      return { data: result };
    }

    if (body.id && body.end) {
      // UPDATE END: Stop session from time tracker button
      const result = await service.update({
        id: body.id,
        end: new Date(body.end),
        notes: body.notes,
      });

      return { data: result };
    }

    throw createError({
      statusCode: 400,
      message: t('server.invalidTimeTrackData'),
    });
  } catch (error: any) {
    console.error('Error in time track operation:', error);

    // Handle custom TimeTrackError with translation keys
    if (error instanceof TimeTrackError) {
      throw createError({
        statusCode: error.statusCode,
        message: t(error.message),
      });
    }

    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      message: t('server.errorProcessing'),
    });
  }
});
