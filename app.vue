<template>
  <NuxtLayout>
    <AppShowToasts />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { loggedIn, user } = useUserSession();
const { fetchPermissions, clearPermissions } = usePermissions();

watch(
  loggedIn,
  async (isLoggedIn) => {
    if (!isLoggedIn) {
      clearPermissions();
      return;
    }

    await callOnce(
      `permissions:${user.value?.id ?? 'unknown'}`,
      async () => {
        await fetchPermissions();
      },
      { mode: 'navigation' }
    );
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
