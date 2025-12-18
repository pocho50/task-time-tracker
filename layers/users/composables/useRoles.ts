import { safeApiCall } from '#layers/shared/utils';
import type {
  RoleDto,
  RoleSavePayload,
  RoleWithPermissionsDto,
} from '../repository/roleRepo';
import { RoleRepo } from '../repository/roleRepo';

export function useRoles() {
  const { $api } = useNuxtApp();
  const roleRepo = new RoleRepo($api);

  const { data, refresh, status } = useAsyncData('roles', async () => {
    const result = await safeApiCall(() => roleRepo.getAll());
    return result === false ? { data: [] } : result;
  });

  const roles = computed(() => (data.value?.data ?? []) as RoleDto[]);

  const openDrawer = ref(false);
  const selectedRole = ref<RoleSavePayload | undefined>(undefined);
  const isCreate = computed(() => !selectedRole.value);

  function handleAdd() {
    selectedRole.value = undefined;
    openDrawer.value = true;
  }

  async function handleEdit(key: string) {
    const result = (await safeApiCall(() => roleRepo.getByKey(key))) as
      | false
      | unknown;

    if (result !== false) {
      const maybe = result as any;
      const roleData: RoleWithPermissionsDto | undefined =
        maybe?.data?.data ?? maybe?.data ?? maybe;

      if (!roleData?.key || !roleData?.name || !roleData?.permissions) {
        return;
      }

      selectedRole.value = {
        key: roleData.key,
        name: roleData.name,
        permissions: roleData.permissions,
      };
      openDrawer.value = true;
    }
  }

  async function handleSave(roleData: RoleSavePayload) {
    const result = await safeApiCall(() => roleRepo.save(roleData));
    if (result !== false) {
      openDrawer.value = false;
      refresh();
    }
  }

  async function handleRemove(key: string) {
    const result = await safeApiCall(() => roleRepo.delete(key));
    if (result !== false) {
      refresh();
    }
  }

  return {
    roles,
    refresh,
    status,
    openDrawer,
    selectedRole,
    isCreate,
    handleAdd,
    handleEdit,
    handleSave,
    handleRemove,
  };
}
