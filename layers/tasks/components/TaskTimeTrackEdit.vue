<script setup lang="ts">
const props = defineProps<{
  task: SerializedTaskWithUsersAndTimeTracks;
  session: SerializedTimeTrackWithUser;
}>();

const { handleRefresh } = useTasksContext();

const { handleUpdateSession } = useTaskTimeTracks(
  toRef(props, 'task'),
  handleRefresh
);

const isEditSessionModalOpen = ref(false);

const handleOpenEditSession = () => {
  if (props.session) {
    isEditSessionModalOpen.value = true;
  }
};

const handleSaveSession = async (data: {
  start: string;
  end: string | null;
  notes: string | null;
}) => {
  const success = await handleUpdateSession(data);
  if (success) {
    isEditSessionModalOpen.value = false;
  }
};

const handleCancelEditSession = () => {
  isEditSessionModalOpen.value = false;
};

defineExpose({
  handleOpenEditSession,
});
</script>
<template>
  <AppModal
    v-model="isEditSessionModalOpen"
    :title="$t('taskHistory.editSession')"
  >
    <TaskTimeTrackEditForm
      :session
      @@save="handleSaveSession"
      @@cancel="handleCancelEditSession"
    />
  </AppModal>
</template>
