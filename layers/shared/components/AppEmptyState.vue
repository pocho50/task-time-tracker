<template>
  <div
    data-testid="empty-state"
    class="flex flex-col items-center justify-center py-12 text-center text-base-content/70"
  >
    <Icon
      name="mdi:folder-open-outline"
      size="48"
      class="mb-4 text-base-content/40"
    />
    <h2 class="text-xl font-semibold mb-2">
      <slot name="title">No Data</slot>
    </h2>
    <p class="mb-2">
      <slot>No items found.</slot>
    </p>
  </div>
</template>
