<script setup lang="ts">
// TODO: Implement profile
const openDrawer = ref(false);
</script>
<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle text="Profile" />
    <p>TODO: Implement profile</p>
    <button class="btn btn-primary" @click="openDrawer = !openDrawer">
      Open drawer
    </button>
    <AppDrawerRight v-model="openDrawer">
      <!-- This paragraph element displays a simple greeting in Spanish -->
      <p>Hola</p>
    </AppDrawerRight>
  </section>
</template>
