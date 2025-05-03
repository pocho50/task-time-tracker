import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional().default(''),
  usersId: z.array(z.string()).optional(),
});

// Type inference for form data
export type ProjectFormData = z.infer<typeof projectSchema>;
