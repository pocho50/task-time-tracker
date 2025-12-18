<script setup lang="ts">
defineProps<{
  name: string;
  type: string;
  placeholder: string;
  classInput?: string;
  disabled?: boolean;
}>();

const value = defineModel<string>();
</script>
<template>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span>{{ placeholder }}</span>
      <VeeField
        v-model="value"
        :name
        :type
        :disabled
        class="input"
        :class="classInput"
        :placeholder
      />
    </label>
    <VeeErrorMessage :name class="text-error" />
  </fieldset>
</template>
