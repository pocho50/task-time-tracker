import { TaskRepository } from '../../repository/task';
import { taskSchema } from '#layers/tasks/schemas';
import { SaveTasksService } from '../../services/save-tasks';
import {
  assertHasPermissionOrThrow,
  assertUserInProjectOrAdminOrThrow,
  assertUserInSprintOrAdminOrThrow,
} from '#layers/shared/server/utils';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

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

  assertHasPermissionOrThrow(
    user?.permissions,
    ALL_ENTITIES.TASKS,
    PERMISSIONS.TASKS_WRITE,
    t('server.unauthorized')
  );

  const sprintIdToCheck = id
    ? await repo.getSprintIdByTaskId(id)
    : (sprintId ?? null);

  let projectIdToCheck: string;
  if (id) {
    const projectIdFromDb = await repo.getProjectIdByTaskId(id);
    if (!projectIdFromDb) {
      throw createError({
        statusCode: 404,
        message: t('server.taskNotFound') || 'Task not found',
      });
    }
    projectIdToCheck = projectIdFromDb;
  } else {
    projectIdToCheck = projectId;
  }

  if (sprintIdToCheck) {
    await assertUserInSprintOrAdminOrThrow({
      userId: user.id,
      userRole: user.role,
      sprintId: sprintIdToCheck,
      isUserInSprint: repo.isUserInSprint.bind(repo),
      errorMessage: t('server.unauthorizedAccess'),
    });
  } else {
    await assertUserInProjectOrAdminOrThrow({
      userId: user.id,
      userRole: user.role,
      projectId: projectIdToCheck,
      isUserInProject: repo.isUserInProject.bind(repo),
      errorMessage: t('server.unauthorizedAccess'),
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
