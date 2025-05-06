<script setup lang="ts">
const { me } = useMe();
</script>
<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle text="Profile" />
    <p>{{ me?.name }}</p>
  </section>
</template>
