import { SprintRepository } from '../../repository/sprint';
import { GetSprintsService } from '../../services/get-sprints';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Get the project ID from the route params
  const idProject = getRouterParam(event, 'idProject');

  if (!idProject) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidProjectId'),
    });
  }

  try {
    const repo = new SprintRepository();
    
    // Check if user has access to this project
    const hasAccess = await repo.isUserInProject(user.id, idProject);
    
    if (!hasAccess) {
      throw createError({
        statusCode: 401,
        message: t('server.unauthorizedAccess'),
      });
    }
    
    const service = new GetSprintsService(repo);
    
    return service.execute({
      projectId: idProject,
    });
  } catch (error) {
    console.error('Error fetching sprints:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});
