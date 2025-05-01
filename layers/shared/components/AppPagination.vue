<script setup lang="ts">
const props = defineProps<{
  page: number;
  totalPages: number;
}>();
defineEmits<{
  (event: "@prev"): void;
  (event: "@next"): void;
}>();
</script>
<template>
  <div class="w-full flex justify-center py-8">
    <div class="join">
      <button
        class="join-item btn btn-lg"
        :class="{ 'btn-disabled': page === 1 }"
        @click="$emit('@prev')"
      >
        «
      </button>
      <button class="join-item btn btn-lg">
        {{ $t('pagination.page') }} {{ page }} {{ $t('pagination.of') }} {{ totalPages }}
      </button>
      <button
        class="join-item btn btn-lg"
        :class="{ 'btn-disabled': page === totalPages }"
        @click="$emit('@next')"
      >
        »
      </button>
    </div>
  </div>
</template>
