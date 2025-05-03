import { Project } from '@prisma/client';

export interface ProjectWithIdUsers extends Project {
  usersId: string[];
}
