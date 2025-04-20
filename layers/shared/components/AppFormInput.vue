<script setup lang="ts">
defineProps<{
  name: string;
  type: string;
  placeholder: string;
  classInput?: string;
}>();

const value = defineModel<string>();
</script>
<template>
  <label class="floating-label">
    <span>{{ placeholder }}</span>
    <VeeField
      v-model="value"
      :name
      :type
      class="input"
      :class="classInput"
      :placeholder
    />
    <VeeErrorMessage :name />
  </label>
</template>
