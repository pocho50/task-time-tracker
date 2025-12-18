import { hasPermission } from '#layers/shared/utils/permissions';
import { ROLES } from '#layers/shared/utils/constants';
// Throws a 403 error if the user does not have the required permission
export function assertHasPermissionOrThrow(
  userPermissions: { entity: string; permission: number }[] | undefined,
  entity: string,
  permission: number,
  errorMessage = 'You do not have permission to perform this action.'
) {
  if (!hasPermission(userPermissions ?? [], { entity, permission })) {
    throw createError({
      statusCode: 403,
      message: errorMessage,
    });
  }
}

export async function assertUserInSprintOrAdminOrThrow(params: {
  userId: string;
  userRole: string;
  sprintId: string;
  isUserInSprint: (userId: string, sprintId: string) => Promise<boolean>;
  errorMessage: string;
}) {
  if (params.userRole === ROLES.ADMIN) return;

  const hasAccess = await params.isUserInSprint(params.userId, params.sprintId);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: params.errorMessage,
    });
  }
}

export function assertIsAdminOrThrow(
  userRole: string,
  errorMessage = 'You do not have permission to perform this action.'
) {
  if (userRole !== ROLES.ADMIN) {
    throw createError({
      statusCode: 403,
      message: errorMessage,
    });
  }
}

export async function assertUserInProjectOrAdminOrThrow(params: {
  userId: string;
  userRole: string;
  projectId: string;
  isUserInProject: (userId: string, projectId: string) => Promise<boolean>;
  errorMessage: string;
}) {
  if (params.userRole === ROLES.ADMIN) return;

  const hasAccess = await params.isUserInProject(
    params.userId,
    params.projectId
  );
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: params.errorMessage,
    });
  }
}

export async function assertUserInTaskOrAdminOrThrow(params: {
  userId: string;
  userRole: string;
  taskId: string;
  isUserInTask: (userId: string, taskId: string) => Promise<boolean>;
  errorMessage: string;
}) {
  if (params.userRole === ROLES.ADMIN) return;

  const hasAccess = await params.isUserInTask(params.userId, params.taskId);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: params.errorMessage,
    });
  }
}
