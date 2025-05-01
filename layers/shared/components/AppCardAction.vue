<script setup lang="ts">
import { ref } from 'vue';
import AppModal from './AppModal.vue';

type Action = 'edit' | 'remove';

const props = defineProps<{
  actions: Action[];
  removeConfirmMessage?: string;
}>();

const emit = defineEmits<{
  (event: '@edit'): void;
  (event: '@remove'): void;
}>();

const dropDown = ref<HTMLDivElement>();
const showRemoveModal = ref(false);

const handleAction = (action: Action) => {
  dropDown.value?.blur();
  if (action === 'edit') emit('@edit');
  if (action === 'remove') showRemoveModal.value = true;
};

function confirmRemove() {
  showRemoveModal.value = false;
  emit('@remove');
}
</script>
<template>
  <div
    class="dropdown dropdown-bottom dropdown-end absolute top-3 right-3 cursor-pointer"
  >
    <Icon
      name="mdi:dots-vertical"
      aria-hidden="false"
      tabindex="0"
      role="button"
      size="20"
    />
    <ul
      tabindex="0"
      ref="dropDown"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
    >
      <li v-if="actions.includes('edit')">
        <a @click="handleAction('edit')"
          ><Icon name="mdi:edit" /> {{ $t('common.edit') }}</a
        >
      </li>
      <li v-if="actions.includes('remove')">
        <a @click="handleAction('remove')"
          ><Icon name="mdi:delete" /> {{ $t('common.delete') }}</a
        >
      </li>
    </ul>
    <AppModal v-model="showRemoveModal" :title="$t('common.confirmDeletion')">
      <template #default>
        <slot name="remove-confirm">
          {{ props.removeConfirmMessage || $t('common.confirmDeleteMessage') }}
        </slot>
      </template>
      <template #actions>
        <button class="btn btn-default" @click="showRemoveModal = false">
          {{ $t('common.cancel') }}
        </button>
        <button class="btn btn-error" @click="confirmRemove">
          {{ $t('common.delete') }}
        </button>
      </template>
    </AppModal>
  </div>
</template>
