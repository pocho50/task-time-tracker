<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  projects: {
    type: Array as PropType<ProjectFormData[]>,
    required: true,
  },
  onEdit: {
    type: Function as PropType<(id: string) => void>,
    required: true,
  },
});
</script>
<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    v-if="projects && projects.length"
  >
    <article
      v-for="project in projects"
      :key="project.id"
      class="card bg-base-100 shadow-md hover:shadow-2xl group relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.03]"
    >
      <AppCardAction
        :actions="['edit', 'remove']"
        @@edit="() => typeof project.id === 'string' && onEdit(project.id)"
      />
      <div class="card-body">
        <h2 class="card-title">
          {{ project.name }}
        </h2>
        <p class="text-base-content/80 text-sm mt-1 line-clamp-3">
          {{ project.description }}
        </p>
        <button class="btn btn-default group-hover:btn-primary">
          Select project
        </button>
      </div>
    </article>
  </div>
</template>
