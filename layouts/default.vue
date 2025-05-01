<script setup lang="ts">
const openSideBar = ref(true);
</script>
<template>
  <div class="drawer bg-base-200" :class="{ 'lg:drawer-open': openSideBar }">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <TheNav @@toogleDrawer="openSideBar = !openSideBar" />
      <main class="p-5">
        <NuxtPage />
      </main>
    </div>

    <TheAside />
  </div>
</template>
