<script setup lang="ts">
const { clear } = useUserSession();

const handleLogout = async () => {
  await clear();
  navigateTo("/login");
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
    >
      <TheLogo />

      <!-- Menu items -->
      <TheMenu />

      <!-- Logout button -->
      <div class="p-4">
        <button
          class="btn btn-ghost btn-block gap-3 text-base-content"
          @click="handleLogout"
        >
          <Icon name="mdi:logout" class="text-xl" />
          <span>{{ $t('app.logout') }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
