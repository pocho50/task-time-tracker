import { TaskRepository } from '../../repository/task';
import { DeleteTaskService } from '../../services/delete-task';
import { ROLES } from '#layers/shared/utils/constants';

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

  // Check if user has access to this task (admins always have access)
  const hasAccess =
    user.role === ROLES.ADMIN || (await repo.isUserInTask(user.id, id));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

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
