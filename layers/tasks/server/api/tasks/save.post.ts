import { TaskRepository } from '../../repository/task';
import { taskSchema } from '#layers/tasks/schemas';
import { SaveTasksService } from '../../services/save-tasks';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // validate schema
  const {
    id,
    name,
    description,
    projectId,
    sprintId,
    priority,
    status,
    estimatedHours,
    usersId,
  } = await readValidatedBody(event, taskSchema.parse);

  // Validate projectId is provided
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: t('server.projectIdRequired') || 'Project ID is required',
    });
  }

  const repo = new TaskRepository();

  // Check user access
  const hasAccess = await repo.hasAccessToTask(
    user.id,
    user.role,
    id,
    projectId
  );

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

  try {
    const service = new SaveTasksService(repo);
    const allUsersId = usersId ?? [];

    const savedTask = await service.execute(
      id,
      name,
      description ?? null,
      projectId,
      sprintId,
      priority,
      status,
      estimatedHours,
      allUsersId
    );

    return {
      message: t('server.successSaveTask') || 'Task saved successfully',
      data: savedTask,
    };
  } catch (error) {
    console.error('Error saving task:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving'),
    });
  }
});
