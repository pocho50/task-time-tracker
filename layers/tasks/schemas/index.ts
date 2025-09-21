import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const taskSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  projectId: z.string().min(1),
  sprintId: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.ANALYZING),
  estimatedHours: z.number().nullable().optional(),
  usersId: z.array(z.string()).optional(),
});

// Type inference for form data
export type TaskFormData = z.infer<typeof taskSchema>;
