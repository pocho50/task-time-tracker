import type { SerializedTaskWithUsersAndTimeTracks } from '../../shared/types';

/**
 * Mock task data for testing
 */
export const mockTasks: SerializedTaskWithUsersAndTimeTracks[] = [
  {
    id: '1',
    name: 'Task 1',
    description: 'Description for task 1',
    projectId: 'project-1',
    sprintId: 'sprint-1',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    estimatedHours: 8,
    createdAt: '2024-01-01T00:00:00Z',
    usersId: ['user-1', 'user-2'],
    users: [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
    ],
    timeTracking: [
      {
        id: 'track-1',
        taskId: '1',
        userId: 'user-1',
        start: '2024-01-01T09:00:00Z',
        end: '2024-01-01T12:00:00Z',
        notes: null,
        createdAt: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Task 2',
    description: 'Description for task 2',
    projectId: 'project-1',
    sprintId: 'sprint-1',
    priority: 'MEDIUM',
    status: 'ANALYZING',
    estimatedHours: 4,
    createdAt: '2024-01-02T00:00:00Z',
    usersId: ['user-1'],
    users: [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    ],
    timeTracking: [],
  },
  {
    id: '3',
    name: 'Task 3',
    description: null,
    projectId: 'project-1',
    sprintId: 'sprint-1',
    priority: 'LOW',
    status: 'APPROVED',
    estimatedHours: null,
    createdAt: '2024-01-03T00:00:00Z',
    usersId: [],
    users: [],
    timeTracking: [],
  },
];
