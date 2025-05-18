<script setup lang="ts">
const { clear } = useUserSession();

const handleLogout = async () => {
  await clear();
  navigateTo('/login');
};
</script>
<template>
  <aside class="drawer-side shadow-md z-20">
    <label
      for="main-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <div
      class="bg-base-100 text-base-content min-h-full w-[var(--aside-width)] flex flex-col"
      data-testid="aside"
    >
      <TheLogo />

      <!-- Menu items -->
      <TheMenu />

      <!-- Logout button -->
      <div class="p-4">
        <AppButton variant="default" class="w-full" @click="handleLogout">
          <Icon name="mdi:logout" class="text-xl" />
          <span>{{ $t('app.logout') }}</span>
        </AppButton>
      </div>
    </div>
  </aside>
</template>
