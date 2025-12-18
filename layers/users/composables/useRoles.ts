import { safeApiCall } from '#layers/shared/utils';
import type { RoleDto } from '../repository/roleRepo';

export function useRoles() {
  const { $api } = useNuxtApp();
  const roleRepo = new RoleRepo($api);

  const { data, refresh, status } = useAsyncData('roles', async () => {
    const result = await safeApiCall(() => roleRepo.getAll());
    return result === false ? { data: [] } : result;
  });

  const roles = computed(() => (data.value?.data ?? []) as RoleDto[]);

  return {
    roles,
    refresh,
    status,
  };
}
