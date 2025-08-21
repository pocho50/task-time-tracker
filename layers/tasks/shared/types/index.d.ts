import type { Task } from '@prisma/client';

export interface TaskWithUsers extends Task {
  usersId: string[];
}

// Serialized version for client-side (dates become strings)
export interface SerializedTaskWithUsers extends Omit<TaskWithUsers, 'createdAt'> {
  createdAt: string;
}
