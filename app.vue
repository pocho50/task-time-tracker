<template>
  <NuxtLayout>
    <AppShowToasts />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { loggedIn, user } = useUserSession();
const { permissions, fetchPermissions, clearPermissions } = usePermissions();

if (loggedIn.value) {
  await callOnce(`permissions:${user.value?.id ?? 'unknown'}`, async () => {
    await fetchPermissions();
  });
}

watch(
  loggedIn,
  async (isLoggedIn) => {
    if (!isLoggedIn) {
      clearPermissions();
      return;
    }

    if (Object.keys(permissions.value ?? {}).length === 0) {
      await fetchPermissions();
    }
  },
  { immediate: true }
);
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
