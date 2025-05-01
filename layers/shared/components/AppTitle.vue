<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <h1 class="text-3xl font-bold mb-8 text-base-content">
    {{ text }}
  </h1>
</template>
