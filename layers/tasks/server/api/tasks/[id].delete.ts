import { TaskRepository } from '../../repository/task';
import { DeleteTaskService } from '../../services/delete-task';
import {
  assertHasPermissionOrThrow,
  assertUserInSprintOrAdminOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

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

  const repo = new TaskRepository();

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.TASKS,
    PERMISSIONS.TASKS_DELETE,
    t('server.unauthorizedDelete')
  );

  const sprintId = await repo.getSprintIdByTaskId(id);
  if (!sprintId) {
    throw createError({
      statusCode: 404,
      message: t('server.taskNotFound') || 'Task not found',
    });
  }

  await assertUserInSprintOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    sprintId,
    isUserInSprint: repo.isUserInSprint.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  const service = new DeleteTaskService(repo);
  const deletedTask = await service.execute(id);

  if (!deletedTask) {
    throw createError({
      statusCode: 404,
      message: t('server.taskNotFound') || 'Task not found',
    });
  }

  return {
    message: t('server.succesDeleteTask') || 'Task deleted successfully',
    data: deletedTask,
  };
});
