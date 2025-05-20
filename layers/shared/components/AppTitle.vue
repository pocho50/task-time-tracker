<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <h3 class="text-3xl font-bold mb-8 text-base-content">
    {{ text }}
  </h3>
</template>
