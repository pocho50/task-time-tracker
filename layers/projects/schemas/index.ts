import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().default(""),
});

// Type inference for form data
export type ProjectFormData = z.infer<typeof projectSchema>;
