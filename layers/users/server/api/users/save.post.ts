import { SaveUserService } from '../../services/save-user';
import { UserRepository } from '../../repository/user';
import { getUserSchema } from '#layers/users/schemas';
import { ALL_ENTITIES } from '#layers/shared/utils/constants';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { assertHasPermissionOrThrow } from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const t = await useTranslation(event);

  assertHasPermissionOrThrow(
    user?.permissions,
    ALL_ENTITIES.USERS,
    PERMISSIONS.USERS_WRITE,
    t('server.unauthorized')
  );

  const { id: idUser } = await readBody(event);

  const { id, name, email, role, password } = await readValidatedBody(
    event,
    getUserSchema(!idUser).parse
  );

  try {
    const service = new SaveUserService(new UserRepository());
    const savedUser = await service.execute(id, name, email, role, password);
    return {
      message: t('server.succesSaveUser') || 'User saved successfully',
      data: savedUser,
    };
  } catch (error) {
    console.error('Error saving user:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorSaving') || 'Error saving user',
    });
  }
});
