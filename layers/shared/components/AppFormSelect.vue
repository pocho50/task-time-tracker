<script setup lang="ts">
interface SelectOption {
  value: string | number;
  text: string;
  disabled?: boolean;
}

defineProps<{
  name: string;
  placeholder: string;
  options: SelectOption[];
  classSelect?: string;
}>();

const value = defineModel<string | number | undefined>();
</script>

<template>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span>{{ placeholder }}</span>
      <VeeField
        v-model="value"
        :name="name"
        as="select"
        class="select"
        :class="[classSelect ? classSelect : 'select-bordered w-full']"
      >
        <option disabled :selected="!value || value === ''" value="">
          {{ placeholder }}
        </option>
        <option
          v-for="optionItem in options"
          :key="optionItem.value"
          :value="optionItem.value"
          :disabled="optionItem.disabled"
        >
          {{ optionItem.text }}
        </option>
      </VeeField>
    </label>
    <VeeErrorMessage :name="name" class="text-error" />
  </fieldset>
</template>
