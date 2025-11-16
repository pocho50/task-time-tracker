<script setup lang="ts">
const emit = defineEmits<{
  (event: '@edit'): void;
  (event: '@remove'): void;
  (event: '@history'): void;
}>();

const handleHistory = (dropDown?: HTMLUListElement) => {
  dropDown?.blur();
  emit('@history');
};
</script>
<template>
  <AppOptionAction
    :actions="['edit', 'remove']"
    @@edit="$emit('@edit')"
    @@remove="$emit('@remove')"
  >
    <template #moreActions="{ dropDown }">
      <li>
        <a @click="handleHistory(dropDown)">
          <Icon name="mdi:history" /> {{ $t('taskList.history') }}
        </a>
      </li>
    </template>
  </AppOptionAction>
</template>
