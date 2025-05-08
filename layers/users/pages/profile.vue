<script setup lang="ts">
const { user } = useUserSession();
</script>
<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle text="Profile" />
    <p>{{ user?.name }}</p>
  </section>
</template>
