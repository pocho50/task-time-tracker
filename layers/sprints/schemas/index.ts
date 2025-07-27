import { z } from 'zod';

// Define sprint status enum to match Prisma
export const SprintStatusEnum = z.enum(['PLANNING', 'ACTIVE', 'COMPLETED']);

export const sprintSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Sprint name is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: SprintStatusEnum.default('PLANNING'),
  projectId: z.string().optional(), // Will be set by the composable
});

// Type inference for form data
export type SprintFormData = z.infer<typeof sprintSchema>;
