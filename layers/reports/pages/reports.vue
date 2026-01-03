<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Pie } from 'vue-chartjs';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const { selectedProjectId, dateRange, summary, loading, fetchSummary } =
  useReports();

type UserDto = { id: string; name: string; email: string };
type HoursRow = { user: UserDto; hours: number };
type TasksRow = { user: UserDto; tasks: number };
type RatioRow = { user: UserDto; ratio: number };

const palette = [
  '#60A5FA',
  '#34D399',
  '#FBBF24',
  '#F87171',
  '#A78BFA',
  '#FB7185',
  '#22D3EE',
  '#4ADE80',
  '#F97316',
  '#94A3B8',
];

const hoursChartData = computed<ChartData<'pie'>>(() => {
  const rows: HoursRow[] = summary.value?.hoursByUser ?? [];

  return {
    labels: rows.map((r: HoursRow) => r.user.name),
    datasets: [
      {
        data: rows.map((r: HoursRow) => Number(r.hours.toFixed(2))),
        backgroundColor: rows.map(
          (_: HoursRow, idx: number) => palette[idx % palette.length]
        ),
      },
    ],
  };
});

const tasksChartData = computed<ChartData<'pie'>>(() => {
  const rows: TasksRow[] = summary.value?.tasksByUser ?? [];

  return {
    labels: rows.map((r: TasksRow) => r.user.name),
    datasets: [
      {
        data: rows.map((r: TasksRow) => r.tasks),
        backgroundColor: rows.map(
          (_: TasksRow, idx: number) => palette[idx % palette.length]
        ),
      },
    ],
  };
});

const ratioChartData = computed<ChartData<'pie'>>(() => {
  const rows: RatioRow[] = summary.value?.ratioByUser ?? [];

  return {
    labels: rows.map((r: RatioRow) => r.user.name),
    datasets: [
      {
        data: rows.map((r: RatioRow) => Number(r.ratio.toFixed(2))),
        backgroundColor: rows.map(
          (_: RatioRow, idx: number) => palette[idx % palette.length]
        ),
      },
    ],
  };
});

const canFetch = computed(
  () =>
    !!selectedProjectId.value &&
    !!dateRange.value?.[0] &&
    !!dateRange.value?.[1]
);

const hasSearched = ref(false);

watch([selectedProjectId, dateRange], () => {
  hasSearched.value = false;
});

async function handleFetch() {
  if (!canFetch.value) return;
  hasSearched.value = true;
  await fetchSummary();
}
</script>

<template>
  <section class="py-12 px-4 bg-base-100">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <AppTitle :text="$t('reports.title')" class="mb-0" />

        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <AppProjectSelector
            v-model="selectedProjectId"
            :label="$t('reports.filters.project')"
            :placeholder="$t('reports.filters.project')"
          />

          <div class="form-control w-full max-w-md">
            <label class="label">
              <span class="label-text">{{
                $t('reports.filters.dateRange')
              }}</span>
            </label>
            <VueDatePicker
              v-model="dateRange"
              range
              :enable-time-picker="true"
              :clearable="true"
              auto-apply
              :teleport="true"
              :placeholder="$t('reports.filters.dateRange')"
            />
          </div>

          <AppButton
            variant="primary"
            icon="mdi:magnify"
            :disabled="!canFetch"
            :loading="loading"
            @click="handleFetch"
          >
            {{ $t('common.search') }}
          </AppButton>
        </div>
      </div>

      <AppLoading v-if="loading" center size="lg" />

      <div
        v-if="hasSearched && summary && !loading"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div class="card bg-base-200 border border-base-300">
          <div class="card-body">
            <h2 class="card-title">{{ $t('reports.charts.hoursByUser') }}</h2>
            <Pie :data="hoursChartData" />
          </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
          <div class="card-body">
            <h2 class="card-title">{{ $t('reports.charts.tasksByUser') }}</h2>
            <Pie :data="tasksChartData" />
          </div>
        </div>

        <div class="card bg-base-200 border border-base-300">
          <div class="card-body">
            <h2 class="card-title">{{ $t('reports.charts.ratioByUser') }}</h2>
            <Pie :data="ratioChartData" />
          </div>
        </div>
      </div>

      <AppEmptyState
        v-if="
          canFetch &&
          !loading &&
          hasSearched &&
          (!summary || summary.hoursByUser.length === 0)
        "
      >
        <template #title>{{ $t('common.noData') }}</template>
        {{ $t('common.tryAnotherFilter') }}
      </AppEmptyState>
    </div>
  </section>
</template>
