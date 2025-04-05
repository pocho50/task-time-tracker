<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";

const page = useRouteQuery("page", 1, { transform: Number });

const { data, refresh } = await useFetch("/api/projects", {
  query: { page },
  watch: false,
});

watch(page, () => {
  refresh();
});

const projects = computed(() => data.value?.data);
</script>
<template>
  <!-- List of projects -->
  <section class="py-12 px-4 bg-base-200">
    <h1 class="text-3xl font-bold mb-8 text-base-content">Projects</h1>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      v-if="projects"
    >
      <article
        v-for="project in projects"
        :key="project.id"
        class="card bg-base-100 shadow-md hover:shadow-2xl group relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.03]"
      >
        <AppCardAction :actions="['edit', 'remove']" />
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
    <AppPagination
      v-if="data?.pagination"
      :page="page"
      :totalPages="data?.pagination.pageCount"
      @@prev="page--"
      @@next="page++"
    />
  </section>
</template>
