import { ReportsRepository } from '../../repository/reports';
import { GetReportsSummaryService } from '../../services/get-reports-summary';
import {
  assertHasPermissionOrThrow,
  assertUserInProjectOrAdminOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  const query = getQuery(event);

  const projectId = String(query.projectId ?? '').trim();
  const fromRaw = String(query.from ?? '').trim();
  const toRaw = String(query.to ?? '').trim();

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: t('server.projectIdRequired'),
    });
  }

  if (!fromRaw || !toRaw) {
    throw createError({
      statusCode: 400,
      message: t('server.dateRangeRequired'),
    });
  }

  const from = new Date(fromRaw);
  const to = new Date(toRaw);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidDateRange'),
    });
  }

  if (to.getTime() <= from.getTime()) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidDateRange'),
    });
  }

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.REPORTS,
    PERMISSIONS.REPORTS_READ,
    t('server.unauthorizedRead')
  );

  const repo = new ReportsRepository();

  await assertUserInProjectOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    projectId,
    isUserInProject: repo.isUserInProject.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  try {
    const now = new Date();
    const toEffective = new Date(Math.min(to.getTime(), now.getTime()));

    const service = new GetReportsSummaryService(repo);
    const data = await service.execute({
      projectId,
      from,
      to: toEffective,
      now,
    });

    return {
      data,
    };
  } catch (error) {
    console.error('Error fetching reports summary:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});
