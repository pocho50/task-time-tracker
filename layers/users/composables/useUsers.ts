import { safeApiCall } from '#layers/shared/utils';

export function useUsers() {
  const { $api } = useNuxtApp();
  const userRepo = new UserRepo($api);
  const page = useRouteQuery('page', 1, { transform: Number });

  watch(page, () => refresh());

  const { data, refresh, status } = useAsyncData('users', () =>
    userRepo.getAll()
  );

  const openDrawer = ref(false);
  const selectedUser = ref<UserDataForm | undefined>(undefined);
  const isCreate = computed(() => !selectedUser.value);

  function handleAdd() {
    selectedUser.value = undefined;
    openDrawer.value = true;
  }

  function handleEdit(id: string) {
    const user = users.value?.find((u) => u.id === id) || undefined;
    if (user) {
      // Parse and validate with Zod, fallback to undefined if invalid
      const result = getUserSchema(false).safeParse(user);
      selectedUser.value = result.success ? result.data : undefined;
    } else {
      selectedUser.value = undefined;
    }
    openDrawer.value = true;
  }

  async function handleSave(userData: UserDataForm) {
    const result = await safeApiCall(() => userRepo.save(userData));
    if (result !== false) {
      openDrawer.value = false;
      refresh();
    }
  }

  async function handleRemove(id: string) {
    const result = await safeApiCall(() => userRepo.remove(id));
    if (result !== false) {
      refresh();
    }
  }

  const users = computed(() => data.value?.data ?? []);
  const pagination = computed(() => data.value?.pagination ?? null);

  return {
    users,
    pagination,
    refresh,
    status,
    page,
    openDrawer,
    selectedUser,
    isCreate,
    handleAdd,
    handleEdit,
    handleSave,
    handleRemove,
  };
}
