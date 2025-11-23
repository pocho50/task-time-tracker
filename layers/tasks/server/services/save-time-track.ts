import type { TimeTrackRepository } from '../repository/time-track';
import type { TimeTrackWithUser } from '../../shared/types';

// Custom error class for time tracking operations
export class TimeTrackError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'TimeTrackError';
  }
}

interface CreateTimeTrackInput {
  taskId: string;
  userId: string;
  start: Date;
  end?: Date;
  notes?: string;
}

interface UpdateTimeTrackInput {
  id: string;
  start?: Date;
  end?: Date;
  notes?: string;
}

export class CreateUpdateTimeTrackService {
  constructor(private repo: TimeTrackRepository) {}

  async create(input: CreateTimeTrackInput): Promise<TimeTrackWithUser> {
    // Check if user has access to the task
    const hasAccess = await this.repo.isUserInTask(input.userId, input.taskId);
    if (!hasAccess) {
      throw new TimeTrackError(
        'server.unauthorizedAccess',
        'UNAUTHORIZED_ACCESS',
        403
      );
    }

    // Check if user already has an active session for this task
    const activeSession = await this.repo.findActiveByUserAndTask(
      input.userId,
      input.taskId
    );
    if (activeSession && !input.end) {
      throw new TimeTrackError(
        'server.activeSessionExists',
        'ACTIVE_SESSION_EXISTS',
        409
      );
    }

    return this.repo.create(input);
  }

  async update(input: UpdateTimeTrackInput): Promise<TimeTrackWithUser> {
    // Check if time track exists
    const existing = await this.repo.findById(input.id);
    if (!existing) {
      throw new TimeTrackError(
        'server.timeTrackNotFound',
        'TIME_TRACK_NOT_FOUND',
        404
      );
    }

    return this.repo.update(input.id, {
      start: input.start,
      end: input.end,
      notes: input.notes,
    });
  }

  async startSession(
    taskId: string,
    userId: string,
    notes?: string
  ): Promise<TimeTrackWithUser> {
    return this.create({
      taskId,
      userId,
      start: new Date(),
      notes,
    });
  }

  async stopSession(
    userId: string,
    taskId: string,
    notes?: string
  ): Promise<TimeTrackWithUser> {
    const activeSession = await this.repo.findActiveByUserAndTask(
      userId,
      taskId
    );
    if (!activeSession) {
      throw new TimeTrackError(
        'server.noActiveSession',
        'NO_ACTIVE_SESSION',
        404
      );
    }

    return this.update({
      id: activeSession.id,
      end: new Date(),
      notes: notes || activeSession.notes || undefined,
    });
  }
}
