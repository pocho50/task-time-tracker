<script setup lang="ts">
const { messages, removeToast } = useToast();
</script>

<template>
  <div class="toast toast-top toast-end" data-testid="toasts">
    <AppToast
      v-for="toast in messages"
      :key="toast.id"
      v-bind="toast"
      @close="removeToast"
    />
  </div>
</template>
