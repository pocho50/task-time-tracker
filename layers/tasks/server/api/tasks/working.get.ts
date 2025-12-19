import { createError, defineEventHandler, getQuery } from 'h3';
import { TimeTrackRepository } from '../../repository/time-track';
import { GetWorkingTasksService } from '../../services/get-working-tasks';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';
import { ALL_ENTITIES, ROLES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const t = await useTranslation(event);

  if (user.role !== ROLES.ADMIN) {
    assertHasPermissionOrThrow(
      user.permissions,
      ALL_ENTITIES.WORKING,
      PERMISSIONS.WORKING_READ,
      t('server.unauthorizedAccess')
    );
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSizeParam = Number(query.pageSize);
  const pageSize =
    pageSizeParam === Infinity
      ? Number.MAX_SAFE_INTEGER
      : pageSizeParam || DEFAULT_PAGE_SIZE;

  const repo = new TimeTrackRepository();

  try {
    const service = new GetWorkingTasksService(repo);
    return service.execute({
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching working tasks:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});
