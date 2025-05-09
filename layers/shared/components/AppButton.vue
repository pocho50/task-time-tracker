<script setup lang="ts">
defineProps<{
  /** Variante del botón */
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'ghost'
    | 'link';
  /** Tamaño del botón  */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Tipo del botón */
  type?: 'button' | 'submit' | 'reset';
  /** Estado deshabilitado */
  disabled?: boolean;
  /** Clases personalizadas adicionales */
  customClass?: string;
  /** Si está en estado de carga */
  loading?: boolean;
  /** Estilo outline */
  outline?: boolean;
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'btn',
      variant ? `btn-${variant}` : 'btn-primary',
      size ? `btn-${size}` : '',
      { 'btn-outline': outline },
      { 'btn-disabled': disabled },
      customClass,
    ]"
  >
    <span v-if="loading" class="loading loading-spinner loading-xs"></span>
    <slot></slot>
  </button>
</template>
