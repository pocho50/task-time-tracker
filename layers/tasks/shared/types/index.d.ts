import type { Task, TimeTrack, User } from '@prisma/client';

export interface TaskWithUsers extends Task {
  usersId: string[];
}

// Serialized version for client-side (dates become strings)
export interface SerializedTaskWithUsers
  extends Omit<TaskWithUsers, 'createdAt'> {
  createdAt: string;
}

// TimeTrack with included user information
export interface TimeTrackWithUser extends TimeTrack {
  user: Pick<User, 'id' | 'name' | 'email'>;
}

// Serialized version for client-side (dates become strings)
export interface SerializedTimeTrackWithUser extends Omit<TimeTrackWithUser, 'start' | 'end' | 'createdAt' | 'updatedAt'> {
  start: string;
  end: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request body for time track operations
export interface TimeTrackRequestBody {
  taskId: string;
  id?: string;
  start?: string; // Only used for CREATE
  end?: string; // Only used for UPDATE
  notes?: string;
}
