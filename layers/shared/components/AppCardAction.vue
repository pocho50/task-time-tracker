<script setup lang="ts">
type Action = "edit" | "remove";

defineProps<{ actions: Action[] }>();

const emit = defineEmits<{
  (event: "@edit"): void;
  (event: "@remove"): void;
}>();

const dropDown = ref<HTMLDivElement>();

const handleAction = (action: Action) => {
  dropDown.value?.blur();
  if (action === "edit") emit("@edit");
  if (action === "remove") emit("@remove");
};
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
        <a @click="handleAction('edit')"><Icon name="mdi:edit" /> Edit</a>
      </li>
      <li v-if="actions.includes('remove')">
        <a @click="handleAction('remove')"><Icon name="mdi:delete" /> Remove</a>
      </li>
    </ul>
  </div>
</template>
