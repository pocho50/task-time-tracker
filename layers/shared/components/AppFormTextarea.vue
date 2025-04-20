<script setup lang="ts">
defineProps<{
  name: string;
  placeholder: string;
  classInput?: string;
}>();

const value = defineModel<string>();
</script>
<template>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span>{{ placeholder }}</span>
      <VeeField
        v-model="value"
        as="textarea"
        :name
        class="textarea"
        :class="classInput"
        :placeholder
      />
    </label>
    <VeeErrorMessage :name class="text-error" />
  </fieldset>
</template>
