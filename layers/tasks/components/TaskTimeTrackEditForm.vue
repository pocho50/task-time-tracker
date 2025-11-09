<script setup lang="ts">
import type { SerializedTimeTrackWithUser } from '../shared/types';
import { formatDateForInput, formatDateForSubmit } from '#layers/shared/utils';

const props = defineProps<{
  session: SerializedTimeTrackWithUser | null;
}>();

const emit = defineEmits<{
  '@save': [data: { start: string; end: string | null; notes: string | null }];
  '@cancel': [];
}>();

const formData = ref({
  start: '',
  end: '',
  notes: '',
});

// Initialize form data when session prop changes
watch(
  () => props.session,
  (newSession) => {
    if (newSession) {
      formData.value = {
        start: formatDateForInput(newSession.start),
        end: formatDateForInput(newSession.end),
        notes: newSession.notes || '',
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('@save', {
    start: formatDateForSubmit(formData.value.start),
    end: formData.value.end ? formatDateForSubmit(formData.value.end) : null,
    notes: formData.value.notes || null,
  });
};

const handleCancel = () => {
  emit('@cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Start Date/Time -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('taskHistory.start') }}</span>
      </label>
      <input
        v-model="formData.start"
        type="datetime-local"
        step="1"
        class="input input-bordered w-full"
        required
      />
    </div>

    <!-- End Date/Time -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('taskHistory.end') }}</span>
      </label>
      <input
        v-model="formData.end"
        type="datetime-local"
        step="1"
        class="input input-bordered w-full"
      />
    </div>

    <!-- Notes -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('taskHistory.notes') }}</span>
      </label>
      <textarea
        v-model="formData.notes"
        class="textarea textarea-bordered w-full"
        rows="4"
        :placeholder="$t('taskHistory.noNotesAdded')"
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-end">
      <AppButton
        type="button"
        variant="ghost"
        :label="$t('common.cancel')"
        @click="handleCancel"
      />
      <AppButton type="submit" variant="primary">
        {{ $t('common.save') }}
      </AppButton>
    </div>
  </form>
</template>
