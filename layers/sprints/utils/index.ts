export type SprintStatus = (typeof SPRINT_STATUSES)[number];
export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  status: SprintStatus;
  projectId: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}
