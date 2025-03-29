<script setup lang="ts">
const openSideBar = ref(true);
</script>
<template>
  <div class="drawer" :class="{ 'lg:drawer-open': openSideBar }">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <TheNav @@toogleDrawer="openSideBar = !openSideBar" />
      <main class="bg-base-200 p-5">
        <NuxtPage />
      </main>
    </div>

    <TheAside />
  </div>
</template>
