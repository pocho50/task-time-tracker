import { ProjectRepository } from '../../repository/project';
import { projectSchema } from '#layers/projects/schemas';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import {
  assertHasPermissionOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';
import { SaveProjectsService } from '../../services/save-projects';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.PROJECTS,
    PERMISSIONS.PROJECTS_WRITE,
    t('server.unauthorized')
  );

  // validate schema
  const { id, name, description, usersId } = await readValidatedBody(
    event,
    projectSchema.parse
  );

  try {
    const service = new SaveProjectsService(new ProjectRepository());
    const allUsersId = usersId ?? [];
    if (!usersId?.includes(user.id)) allUsersId.push(user.id);
    const savedProject = await service.execute(
      id,
      name,
      description,
      allUsersId
    );
    return {
      message: t('server.succesSaveProject') || 'Project saved successfully',
      data: savedProject,
    };
  } catch (error) {
    console.error('Error saving project:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving'),
    });
  }
});
