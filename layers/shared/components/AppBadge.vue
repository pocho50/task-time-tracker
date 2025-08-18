<script setup lang="ts">
const props = defineProps<{
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md' | 'lg';
}>();

const getClasses = computed(() => {
  return [
    'badge',
    props.variant === 'primary' ? 'badge-primary' : '',
    props.variant === 'secondary' ? 'badge-secondary' : '',
    props.variant === 'accent' ? 'badge-accent' : '',
    props.variant === 'info' ? 'badge-info' : '',
    props.variant === 'success' ? 'badge-success' : '',
    props.variant === 'warning' ? 'badge-warning' : '',
    props.variant === 'error' ? 'badge-error' : '',
    props.size === 'sm' ? 'badge-sm' : '',
    props.size === 'md' ? 'badge-md' : '',
    props.size === 'lg' ? 'badge-lg' : '',
  ];
});
</script>

<template>
  <div>
    <span :class="getClasses">
      <slot />
    </span>
  </div>
</template>
