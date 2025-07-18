<script setup lang="ts">
const route = useRoute();
const idProject = route.params.idProject as string;

const {
  sprints,
  meta,
  status,
  page,
  handleEdit,
  handleRemove,
} = useSprints(idProject);
</script>

<template>
  <section class="py-12 px-4 bg-base-200">
    <AppTitle :text="$t('sprintList.title')" />
    <SprintList
      :sprints="sprints ?? []"
      :onEdit="handleEdit"
      :onRemove="handleRemove"
    />
    <AppEmptyState
      v-if="(!sprints || sprints.length === 0) && status === 'success'"
    >
      <template #title>{{ $t('sprintList.noSprintsFound') }}</template>
      {{ $t('sprintList.noSprintsFoundDescription') }}
    </AppEmptyState>
    <!-- Pagination -->
    <AppPagination
      v-if="meta && meta.total > 0"
      :page="page"
      :totalPages="Math.ceil(meta.total / 10)"
      @change="(newPage: number) => (page = newPage)"
      class="my-4"
    />
  </section>
</template>
