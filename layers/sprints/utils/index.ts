export type SprintStatus = (typeof SPRINT_STATUSES)[number];
export interface Sprint {
  id: string;
  name: string;
  description?: string; // Making this optional to match the API
  startDate: string | Date | null;
  endDate: string | Date | null;
  status: SprintStatus;
  projectId: string;
  createdAt: string | Date;
  updatedAt?: string | Date; // Making this optional to match the API
}
