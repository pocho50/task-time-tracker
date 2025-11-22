<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  classInput?: string;
}>();

// Get TinyMCE API key from runtime config
const config = useRuntimeConfig();
const tinymceApiKey = config.public.tinymceApiKey;

// Use vee-validate field
const { value, errorMessage } = useField<string>(() => props.name);

// TinyMCE configuration
const editorConfig = {
  height: 400,
  menubar: false,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
  ],
  toolbar:
    'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'link | removeformat | help',
  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  placeholder: props.placeholder || '',
};

// Handle editor input
const handleInput = (content: string) => {
  value.value = content;
};
</script>

<template>
  <div class="form-control w-full" :class="classInput">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <ClientOnly>
      <Editor
        :api-key="tinymceApiKey"
        :init="editorConfig"
        :model-value="value"
        @update:model-value="handleInput"
        :disabled="disabled"
      />
      <template #fallback>
        <div
          class="flex items-center justify-center h-[400px] w-full border border-base-300 rounded-lg"
        >
          <AppLoading :text="$t('common.loading')" />
        </div>
      </template>
    </ClientOnly>
    <label v-if="errorMessage" class="label">
      <span class="label-text-alt text-error">{{ errorMessage }}</span>
    </label>
  </div>
</template>
