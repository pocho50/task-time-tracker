<script setup lang="ts">
const open = defineModel<boolean>({ required: true });
const props = defineProps({
  title: { type: String, default: '' },
});
function emitClose() {
  open.value = false;
}
</script>
<template>
  <teleport to="body">
    <dialog :open="open" class="modal" aria-modal="true" :aria-label="title">
      <div class="modal-box">
        <header
          v-if="title"
          class="font-bold text-lg mb-2 flex items-center justify-between"
        >
          <slot name="title">{{ title }}</slot>
          <ClientOnly>
            <button
              type="button"
              :aria-label="$t('common.close')"
              class="btn btn-ghost btn-sm ml-2"
              @click="emitClose"
            >
              <Icon name="mdi:close" size="24" />
            </button>
          </ClientOnly>
        </header>
        <section>
          <slot />
        </section>
        <footer class="modal-action mt-4">
          <slot name="actions" />
        </footer>
      </div>
      <form method="dialog" class="modal-backdrop" @click.prevent="emitClose">
        <button :aria-label="$t('common.close')"/>
      </form>
    </dialog>
  </teleport>
</template>
