import { UserRepo } from '~/layers/users/repository/userRepo';

export function useUsers() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);
  const {
    data: users,
    refresh,
    status,
    error,
  } = useAsyncData('users', () => userRepo.getAll());

  return {
    users,
    refresh,
    status,
    error,
  };
}
