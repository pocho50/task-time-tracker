import { UserRepo } from '~/layers/users/repository/userRepo';
import { safeApiCall } from '#layers/shared/utils';

export function useMe() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);
  const loading = ref(false);

  const handleSave = async (settingsData: SettingsDataForm) => {
    loading.value = true;
    const result = await safeApiCall(() => userRepo.saveMe(settingsData));
    loading.value = false;
    return result !== false;
  };

  return {
    handleSave,
    loading,
  };
}
