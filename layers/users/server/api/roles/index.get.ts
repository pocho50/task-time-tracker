import { RoleRepository } from '../../repository/role';
import { GetRolesService } from '../../services/get-roles';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import {
  assertHasPermissionOrThrow,
  getRolePermissions,
} from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  const permissions = await getRolePermissions(event, user.role);

  assertHasPermissionOrThrow(
    permissions,
    ALL_ENTITIES.ROLES,
    PERMISSIONS.ROLES_READ,
    t('server.unauthorizedRead')
  );

  const service = new GetRolesService(new RoleRepository());
  return await service.execute();
});
