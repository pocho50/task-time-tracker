import type { Task, TimeTrack, User } from '@prisma/client';

export interface TaskWithUsers extends Task {
  usersId: string[];
}

// Task with full user data (name, email, etc.)
export interface TaskWithUsersData extends Task {
  usersId: string[];
  users: Pick<User, 'id' | 'name' | 'email'>[];
}

// Serialized version for client-side (dates become strings)
export interface SerializedTaskWithUsers
  extends Omit<TaskWithUsers, 'createdAt'> {
  createdAt: string;
}

// Serialized version with user data for client-side
export interface SerializedTaskWithUsersData
  extends Omit<TaskWithUsersData, 'createdAt'> {
  createdAt: string;
}

// Task with users and time tracking data
export interface TaskWithUsersAndTimeTracks extends TaskWithUsersData {
  timeTracking: TimeTrackWithUser[];
}

// Serialized version with users and time tracking data for client-side
export interface SerializedTaskWithUsersAndTimeTracks
  extends Omit<TaskWithUsersAndTimeTracks, 'createdAt' | 'timeTracking'> {
  createdAt: string;
  timeTracking: SerializedTimeTrackWithUser[];
}

// TimeTrack with included user information
export interface TimeTrackWithUser extends TimeTrack {
  user: Pick<User, 'id' | 'name' | 'email'>;
}

// Serialized version for client-side (dates become strings)
export interface SerializedTimeTrackWithUser
  extends Omit<TimeTrackWithUser, 'start' | 'end' | 'createdAt' | 'updatedAt'> {
  start: string;
  end: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request body for time track operations
export interface TimeTrackRequestBody {
  taskId: string;
  id?: string;
  start?: string; // Only used for CREATE or FULL UPDATE
  end?: string; // Only used for UPDATE or FULL UPDATE
  notes?: string;
  fullUpdate?: boolean; // Flag to indicate full session edit (start + end + notes)
}
