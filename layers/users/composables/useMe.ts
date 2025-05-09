import { UserRepo } from '~/layers/users/repository/userRepo';

export function useMe() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);
  const loading = ref(false);

  const handleSave = async (user: UserDataForm) => {
    loading.value = true;
    await userRepo.saveMe(user);
    loading.value = false;
  };

  return {
    handleSave,
    loading,
  };
}
