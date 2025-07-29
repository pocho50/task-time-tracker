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
    disabled?: boolean;
    noOptionsText?: string;
    minChars?: number;
  }>(),
  {
    placeholder: '',
    label: '',
    disabled: false,
    noOptionsText: '',
    minChars: 0,
  }
);

// Define model for selected value
const selectedValue = defineModel<string | number | null>({ default: null });

// Local state
const searchQuery = ref('');
const dropdownOpen = ref(false);
const highlightedIndex = ref(-1);
const inputRef = useTemplateRef<HTMLInputElement>('inputRef');

// Computed properties
const selectedOption = computed(() => {
  return (
    props.options.find((option) => option.value === selectedValue.value) || null
  );
});

const filteredOptions = computed(() => {
  if (searchQuery.value.length < props.minChars) {
    return props.options;
  }

  const query = searchQuery.value.toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query)
  );
});

const displayValue = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  return searchQuery.value;
});

const noOptionsMessage = computed(() => {
  return props.noOptionsText || t('autocomplete.noOptions');
});

// Methods
function openDropdown() {
  if (props.disabled) return;
  clearSelection();
  dropdownOpen.value = true;
  highlightedIndex.value = -1;
}

function closeDropdown() {
  dropdownOpen.value = false;
  highlightedIndex.value = -1;

  // Reset search query if no selection
  if (!selectedOption.value) {
    searchQuery.value = '';
  } else {
    searchQuery.value = selectedOption.value.label;
  }
}

function selectOption(option: Option) {
  selectedValue.value = option.value;
  searchQuery.value = option.label;
  closeDropdown();
}

function clearSelection() {
  selectedValue.value = null;
  searchQuery.value = '';
  inputRef.value?.focus();
}

function onInput() {
  if (!dropdownOpen.value) {
    openDropdown();
  }

  // Clear selection if user is typing
  if (
    selectedOption.value &&
    searchQuery.value !== selectedOption.value.label
  ) {
    selectedValue.value = null;
  }
}

function navigateDown() {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value < filteredOptions.value.length - 1
      ? highlightedIndex.value + 1
      : 0;
}

function navigateUp() {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value > 0
      ? highlightedIndex.value - 1
      : filteredOptions.value.length - 1;
}

function handleEnter() {
  if (
    highlightedIndex.value >= 0 &&
    filteredOptions.value[highlightedIndex.value]
  ) {
    selectOption(filteredOptions.value[highlightedIndex.value]!);
  }
}

function onKeydown(event: KeyboardEvent) {
  const isNavigationKey = ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key);
  if (!dropdownOpen.value && isNavigationKey) {
    openDropdown();
    return;
  }

  // Ignore key events when dropdown is closed
  if (!dropdownOpen.value) return;

  // Handle keyboard navigation when dropdown is open
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      navigateDown();
      break;
    case 'ArrowUp':
      event.preventDefault();
      navigateUp();
      break;
    case 'Enter':
      event.preventDefault();
      handleEnter();
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;
  }
}

// Close dropdown when clicking outside
const autocomplete = useTemplateRef<HTMLElement>('autocomplete');
onClickOutside(autocomplete, closeDropdown);

// Initialize search query with selected option label
watchEffect(() => {
  if (selectedOption.value && !dropdownOpen.value) {
    searchQuery.value = selectedOption.value.label;
  }
});
</script>

<template>
  <div class="form-control w-full" ref="autocomplete">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>

    <div class="relative">
      <div class="dropdown w-full" :class="{ 'dropdown-open': dropdownOpen }">
        <div class="relative">
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            class="input input-bordered w-full pr-10"
            :class="{
              'input-disabled': disabled,
              'dropdown-toggle': true,
            }"
            :placeholder="placeholder || t('autocomplete.placeholder')"
            :disabled="disabled"
            @input="onInput"
            @focus="openDropdown"
            @keydown="onKeydown"
            autocomplete="off"
          />

          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon
              v-if="selectedOption"
              name="mdi:chevron-down"
              size="18"
              class="cursor-pointer text-base-content text-opacity-50 hover:text-opacity-100 mr-1"
              @click.stop="clearSelection"
            />
          </div>
        </div>

        <ul
          v-show="dropdownOpen"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-[1] mt-1"
        >
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
          >
            <a
              class="px-3 py-2 cursor-pointer"
              :class="{
                'bg-base-200': highlightedIndex === index,
                'bg-primary text-primary-content':
                  selectedValue === option.value,
              }"
              @mouseenter="highlightedIndex = index"
            >
              {{ option.label }}
            </a>
          </li>

          <li v-if="filteredOptions.length === 0">
            <span class="px-3 py-2 text-sm text-base-content text-opacity-60">
              {{ noOptionsMessage }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-toggle {
  cursor: pointer;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
