<script setup lang="ts">
const { workingSessions, workingTasksStatus } = useTaskOnWorking();
</script>
<template>
  <section class="py-12 px-4 bg-base-100">
    <AppTitle :text="$t('taskOnWorking.title')" class="mb-0" />

    <!-- Loading State -->
    <AppLoading
      v-if="workingTasksStatus === 'pending'"
      center
      :text="$t('taskList.loadingTasks')"
      size="lg"
    />

    <WorkingTaskList
      v-if="workingTasksStatus === 'success'"
      :sessions="workingSessions"
    />
  </section>
</template>
