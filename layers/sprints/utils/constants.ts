export const SPRINT_STATUSES = ['PLANNING', 'ACTIVE', 'COMPLETED'] as const;

export type SprintStatus = typeof SPRINT_STATUSES[number];
