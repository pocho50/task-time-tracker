import { BaseRepo } from '#layers/shared/repository/baseRepo';

export interface ReportsSummaryQuery {
  projectId: string;
  from: string;
  to: string;
}

export interface ReportsSummaryResponse {
  data: {
    hoursByUser: {
      user: { id: string; name: string; email: string };
      hours: number;
    }[];
    tasksByUser: {
      user: { id: string; name: string; email: string };
      tasks: number;
    }[];
    ratioByUser: {
      user: { id: string; name: string; email: string };
      ratio: number;
    }[];
  };
}

export class ReportsRepo<T> extends BaseRepo<T> {
  readonly basePath = '/api/reports';
  static readonly keys = {
    summary: 'reports-summary',
  };

  async getSummary(query: ReportsSummaryQuery) {
    const params = this.getQueryParams(query);
    return this.fetch(`${this.basePath}/summary?${params}`);
  }
}
