<script setup lang="ts">
defineProps<{
  projects: ProjectFormData[];
}>();

// Inject handlers from parent context
const { handleEdit, handleRemove } = useProjectsContext();

const { userIsAllowedToWrite } = useUser();
</script>
<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    v-if="projects && projects.length"
    data-testid="project-list"
  >
    <article
      v-for="project in projects"
      :key="project.id"
      class="card bg-base-100 shadow-md hover:shadow-2xl relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.03]"
    >
      <AppOptionAction
        v-if="userIsAllowedToWrite(ENTITY)"
        :actions="['edit', 'remove']"
        @edit="() => typeof project.id === 'string' && handleEdit(project.id)"
        @remove="
          () => typeof project.id === 'string' && handleRemove(project.id)
        "
      />
      <div class="card-body">
        <h2 class="card-title">
          {{ project.name }}
        </h2>
        <p class="text-base-content/80 text-sm mt-1 line-clamp-3">
          {{ project.description }}
        </p>
        <div class="flex gap-2 mt-4">
          <NuxtLink
            :to="{ name: 'tasks-idSprint', query: { idProject: project.id } }"
            class="btn btn-default grow flex items-center gap-2 hover:btn-primary transition-colors"
          >
            <Icon name="mdi:format-list-checkbox" size="20" />
            <span>{{ $t('tasks') }}</span>
          </NuxtLink>
          <NuxtLink
            :to="`/sprints/${project.id}`"
            class="btn btn-default grow flex items-center gap-2 hover:btn-accent transition-colors"
          >
            <Icon name="mdi:cog-outline" size="20" />
            <span>{{ $t('configSprints') }}</span>
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>
