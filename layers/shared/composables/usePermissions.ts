export type PermissionsRecord = Record<string, number>;

export function usePermissions() {
  const permissions = useState<PermissionsRecord>('permissions', () => ({}));
  const loadingPermissions = useState<boolean>(
    'permissionsLoading',
    () => false
  );

  const { $api } = useNuxtApp();

  async function fetchPermissions() {
    loadingPermissions.value = true;
    try {
      const result = await $api<{ permissions: PermissionsRecord }>(
        '/users/permissions'
      );
      permissions.value = result.permissions ?? {};
    } finally {
      loadingPermissions.value = false;
    }
  }

  function clearPermissions() {
    permissions.value = {};
  }

  return {
    permissions,
    loadingPermissions,
    fetchPermissions,
    clearPermissions,
  };
}
