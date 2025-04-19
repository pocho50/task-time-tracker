<script setup lang="ts">
defineProps<{
  name: string;
  type: string;
  placeholder: string;
  classInput?: string;
}>();
</script>
<template>
  <label class="floating-label">
    <span>{{ placeholder }}</span>
    <VeeField :name :type class="input" :class="classInput" :placeholder />
    <VeeErrorMessage :name />
  </label>
</template>
