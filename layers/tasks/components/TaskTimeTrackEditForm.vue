<script setup lang="ts">
import type { SerializedTimeTrackWithUser } from '../shared/types';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{
  session: SerializedTimeTrackWithUser | null;
}>();

const emit = defineEmits<{
  '@save': [data: { start: string; end: string | null; notes: string | null }];
  '@cancel': [];
}>();

const formData = ref({
  start: null as Date | null,
  end: null as Date | null,
  notes: '',
});

// Function to initialize/reset form data from session
const initializeFormData = () => {
  if (props.session) {
    formData.value = {
      start: props.session.start ? new Date(props.session.start) : null,
      end: props.session.end ? new Date(props.session.end) : null,
      notes: props.session.notes || '',
    };
  }
};

// Initialize form data when session prop changes
watch(() => props.session, initializeFormData, { immediate: true });

const handleSubmit = () => {
  if (!formData.value.start) return;

  emit('@save', {
    start: formData.value.start.toISOString(),
    end: formData.value.end ? formData.value.end.toISOString() : null,
    notes: formData.value.notes || null,
  });
};

const handleCancel = () => {
  // Reset form data to original values before closing
  initializeFormData();
  emit('@cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Start Date/Time -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text font-semibold flex items-center gap-2">
          <Icon name="mdi:clock-start" class="w-5 h-5" />
          {{ $t('taskHistory.start') }}
        </span>
      </label>
      <VueDatePicker
        v-model="formData.start"
        :enable-time-picker="true"
        :enable-seconds="true"
        time-picker-inline
        auto-apply
        :format="'dd/MM/yyyy HH:mm:ss'"
        :preview-format="'dd/MM/yyyy HH:mm:ss'"
        :clearable="false"
        required
        :teleport="true"
        data-testid="session-start-picker"
        :placeholder="$t('taskHistory.selectDateTime')"
      />
    </div>

    <!-- End Date/Time -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text font-semibold flex items-center gap-2">
          <Icon name="mdi:clock-end" class="w-5 h-5" />
          {{ $t('taskHistory.end') }}
        </span>
      </label>
      <VueDatePicker
        v-model="formData.end"
        :enable-time-picker="true"
        :enable-seconds="true"
        time-picker-inline
        auto-apply
        :format="'dd/MM/yyyy HH:mm:ss'"
        :preview-format="'dd/MM/yyyy HH:mm:ss'"
        :clearable="true"
        :teleport="true"
        :placeholder="$t('taskHistory.selectDateTime')"
        data-testid="session-end-picker"
      />
    </div>

    <!-- Notes -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text font-semibold flex items-center gap-2">
          <Icon name="mdi:note-text" class="w-5 h-5" />
          {{ $t('taskHistory.notes') }}
        </span>
      </label>
      <textarea
        v-model="formData.notes"
        class="textarea textarea-bordered w-full focus:textarea-primary transition-colors"
        rows="4"
        :placeholder="$t('taskHistory.noNotesAdded')"
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end pt-2">
      <AppButton
        type="button"
        variant="default"
        icon="mdi:close"
        @click="handleCancel"
      >
        {{ $t('common.cancel') }}
      </AppButton>
      <AppButton type="submit" variant="primary" icon="mdi:content-save">
        {{ $t('common.save') }}
      </AppButton>
    </div>
  </form>
</template>
