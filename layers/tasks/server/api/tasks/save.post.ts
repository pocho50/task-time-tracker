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

  try {
    const repo = new TaskRepository();

    // Check user access: for existing tasks, check if user is assigned to the task
    // For new tasks, check if user has access to the project
    let hasAccess = false;
    
    if (id) {
      // Updating existing task - check if user is assigned to this task
      hasAccess = await repo.isUserInTask(user.id, id);
    } else {
      // Creating new task - check if user has access to the project
      hasAccess = await repo.isUserInProject(user.id, projectId);
    }

    if (!hasAccess) {
      throw createError({
        statusCode: 401,
        message: t('server.unauthorizedAccess'),
      });
    }

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
