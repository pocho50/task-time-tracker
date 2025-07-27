import type { Sprint } from '../../utils';

export const mockSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 1',
    startDate: '2024-01-02',
    endDate: '2024-01-15',
    status: 'ACTIVE',
    projectId: 'project-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sprint 2',
    startDate: '2024-01-16',
    endDate: '2024-01-30',
    status: 'PLANNING',
    projectId: 'project-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];
