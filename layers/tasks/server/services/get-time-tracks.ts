import type { TimeTrackRepository } from '../repository/time-track';

interface GetTimeTracksInput {
  taskId: string;
}

export class GetTimeTracksService {
  constructor(private repo: TimeTrackRepository) {}

  async execute({ taskId }: GetTimeTracksInput) {
    const timeTracks = await this.repo.findManyByTaskId(taskId);

    return {
      data: timeTracks,
      total: timeTracks.length,
    };
  }
}
