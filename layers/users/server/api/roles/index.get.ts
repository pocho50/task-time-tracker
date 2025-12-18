import { RoleRepository } from '../../repository/role';
import { GetRolesService } from '../../services/get-roles';
import { ENTITY } from '#layers/users/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ENTITY,
    PERMISSIONS.USERS_READ,
    t('server.unauthorizedRead')
  );

  const service = new GetRolesService(new RoleRepository());
  return await service.execute();
});
