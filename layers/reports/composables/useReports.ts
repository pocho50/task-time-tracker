import { safeApiCall } from '#layers/shared/utils';
import { ReportsRepo } from '../repository/reportsRepo';
import type {
  ReportsSummaryQuery,
  ReportsSummaryResponse,
} from '../repository/reportsRepo';

export function useReports() {
  const { $api } = useNuxtApp();
  const repo = new ReportsRepo<ReportsSummaryResponse>($api);

  const selectedProjectId = ref('');
  const dateRange = ref<[Date, Date] | null>(null);

  const summary = ref<ReportsSummaryResponse['data'] | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const query = computed<ReportsSummaryQuery | null>(() => {
    if (!selectedProjectId.value || !dateRange.value) return null;

    const [from, to] = dateRange.value;

    return {
      projectId: selectedProjectId.value,
      from: from.toISOString(),
      to: to.toISOString(),
    };
  });

  const fetchSummary = async () => {
    if (!query.value) return false;

    loading.value = true;
    error.value = null;

    const result = await safeApiCall(() => repo.getSummary(query.value!));
    if (result === false) {
      summary.value = null;
      loading.value = false;
      return false;
    }

    summary.value = result.data;
    loading.value = false;
    return true;
  };

  return {
    selectedProjectId,
    dateRange,
    summary,
    loading,
    error,
    fetchSummary,
  };
}
