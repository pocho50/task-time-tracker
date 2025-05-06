import { UserRepo } from '~/layers/users/repository/userRepo';

export function useMe() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);

  const {
    data: me,
    refresh,
    status,
    error,
  } = useAsyncData('me', () => userRepo.getMe());

  return {
    me,
    refresh,
    status,
    error,
  };
}
