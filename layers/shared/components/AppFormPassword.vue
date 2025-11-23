<script setup lang="ts">
defineProps<{
  name: string;
  placeholder: string;
  classInput?: string;
}>();
const value = defineModel<string>();
const show = ref(false);
const fieldType = computed(() => (show.value ? 'text' : 'password'));
function toggleShow() {
  show.value = !show.value;
}
</script>

<template>
  <fieldset class="fieldset">
    <label class="floating-label">
      <span>{{ placeholder }}</span>
      <div class="relative">
        <VeeField
          v-model="value"
          :name
          :type="fieldType"
          class="input pr-10"
          :class="classInput"
          :placeholder
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          @click="toggleShow"
        >
          <Icon
            :name="!show ? 'mdi:eye-off' : 'mdi:eye'"
            size="20"
            class="cursor-pointer"
          />
        </button>
      </div>
    </label>
    <VeeErrorMessage :name class="text-error" />
  </fieldset>
</template>
