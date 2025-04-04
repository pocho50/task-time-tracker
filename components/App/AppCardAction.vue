<script setup lang="ts">
type Action = "edit" | "remove";
defineProps<{ actions: Action[] }>();
defineEmits(["@edit", "@remove"]);
</script>
<template>
  <div
    class="dropdown dropdown-bottom dropdown-end absolute top-3 right-3 cursor-pointer"
  >
    <Icon name="mdi:dots-vertical" tabindex="0" role="button" size="20" />
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
    >
      <li v-if="actions.includes('edit')">
        <a @click="$emit('@edit')"><Icon name="mdi:edit" /> Edit</a>
      </li>
      <li v-if="actions.includes('remove')">
        <a @click="$emit('@remove')"><Icon name="mdi:delete" /> Remove</a>
      </li>
    </ul>
  </div>
</template>
