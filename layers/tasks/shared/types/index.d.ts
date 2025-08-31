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
