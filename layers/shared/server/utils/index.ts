import { hasPermission } from "#layers/shared/utils/permissions";
// Throws a 403 error if the user does not have the required permission
export function assertHasPermissionOrThrow(
  userPermissions: { entity: string; permission: number }[] | undefined,
  entity: string,
  permission: number,
  errorMessage = "You do not have permission to perform this action."
) {
  if (!hasPermission(userPermissions ?? [], { entity, permission })) {
    throw createError({
      statusCode: 403,
      message: errorMessage,
    });
  }
}
