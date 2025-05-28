import { UserRepo } from '~/layers/users/repository/userRepo';

export function useMe() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);
  const loading = ref(false);

  const handleSave = async (settingsData: SettingsDataForm) => {
    loading.value = true;
    await userRepo.saveMe(settingsData);
    loading.value = false;
  };

  return {
    handleSave,
    loading,
  };
}
