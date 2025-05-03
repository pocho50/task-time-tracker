<script setup lang="ts">
const { t } = useI18n();

interface Option {
  value: string | number;
  label: string;
}

// Define props
const props = withDefaults(
  defineProps<{
    options: Option[];
    placeholder?: string;
    label?: string;
  }>(),
  {
    placeholder: '',
    label: '',
  }
);

// Define model for selected values (array of values)
const selectedValues = defineModel<Array<string | number>>({ default: [] });
const selectedLabels = ref<string[]>([]);

// Ref to control dropdown visibility
const dropdownOpen = ref(false);

// Computed property to display selected labels or placeholder
const displayLabel = computed(() => {
  if (selectedValues.value.length === 0) {
    // Use prop placeholder if provided, otherwise use translated default
    return props.placeholder || t('multiSelect.placeholder');
  }
  selectedLabels.value = props.options
    .filter((option) => selectedValues.value.includes(option.value))
    .map((option) => option.label);
  return selectedLabels.value.length > 0
    ? selectedLabels.value.join(', ')
    : props.placeholder || t('multiSelect.placeholder');
});

// Toggle dropdown state
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Close dropdown when clicking outside
const multiSelect = useTemplateRef<HTMLElement>('multiSelect');
onClickOutside(multiSelect, closeDropdown);
function closeDropdown() {
  dropdownOpen.value = false;
}

// Reset selection
function resetSelection() {
  selectedValues.value = [];
  selectedLabels.value = [];
}
</script>

<template>
  <div class="form-control w-full" ref="multiSelect">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <div
      class="dropdown w-full"
      :class="{ 'dropdown-open': dropdownOpen }"
      tabindex="0"
    >
      <button
        type="button"
        class="btn btn-outline justify-between w-full font-normal gap-1"
        @click="toggleDropdown"
      >
        <span class="truncate flex-grow text-left">{{ displayLabel }}</span>
        <span class="flex items-center">
          <Icon
            v-if="selectedLabels.length > 0"
            name="mdi:close"
            size="18"
            class="cursor-pointer text-base-content text-opacity-50 hover:text-opacity-100 mr-1"
            @click.stop="resetSelection"
          />
          <Icon name="mdi:chevron-down" size="20" />
        </span>
      </button>
      <ul
        v-show="dropdownOpen"
        tabindex="0"
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-[1] mt-1"
      >
        <li v-for="option in options" :key="option.value">
          <label class="label cursor-pointer py-2 px-3">
            <input
              type="checkbox"
              :value="option.value"
              v-model="selectedValues"
              class="checkbox checkbox-default"
            />
            <span>{{ option.label }}</span>
          </label>
        </li>
        <li v-if="options.length === 0">
          <span class="px-3 py-2 text-sm text-base-content text-opacity-60">{{
            t('multiSelect.noOptions')
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
