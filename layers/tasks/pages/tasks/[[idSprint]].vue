<script setup lang="ts">
const routeSprintId = useRouteParams('idSprint');
const { tasks } = useTasks(routeSprintId.value as string);
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <AppTitle :text="$t('taskList.title')" class="mb-0" />
    </div>
    <TaskList v-if="tasks" :tasks="tasks" />
  </section>
</template>
