import type {
  ReportsRepository,
  UserHoursStat,
  UserRatioStat,
  UserTasksStat,
} from '../repository/reports';

export interface GetReportsSummaryInput {
  projectId: string;
  from: Date;
  to: Date;
  now: Date;
}

export interface ReportsSummaryResult {
  hoursByUser: UserHoursStat[];
  tasksByUser: UserTasksStat[];
  ratioByUser: UserRatioStat[];
}

export class GetReportsSummaryService {
  constructor(private repo: ReportsRepository) {}

  async execute(input: GetReportsSummaryInput): Promise<ReportsSummaryResult> {
    const [hoursByUser, tasksByUser] = await Promise.all([
      this.repo.getHoursWorkedByUser({
        projectId: input.projectId,
        from: input.from,
        to: input.to,
        now: input.now,
      }),
      this.repo.getFinalizedTasksByUser({
        projectId: input.projectId,
        from: input.from,
        to: input.to,
      }),
    ]);

    const tasksByUserId = new Map(
      tasksByUser.map((row) => [row.user.id, row.tasks])
    );

    const users = new Map(
      [...hoursByUser, ...tasksByUser].map((row) => [row.user.id, row.user])
    );

    const ratioByUser: UserRatioStat[] = [...users.entries()].map(
      ([userId, user]) => {
        const hours = hoursByUser.find((h) => h.user.id === userId)?.hours ?? 0;
        const tasks = tasksByUserId.get(userId) ?? 0;

        return {
          user,
          ratio: tasks > 0 ? hours / tasks : 0,
        };
      }
    );

    ratioByUser.sort((a, b) => b.ratio - a.ratio);

    return {
      hoursByUser,
      tasksByUser,
      ratioByUser,
    };
  }
}
