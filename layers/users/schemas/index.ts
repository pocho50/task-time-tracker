import { z } from 'zod';
import { LOCALES, THEMES } from '#layers/shared/utils/constants';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userSchema = z.object({
  name: z.string().min(1),
  theme: z.enum(THEMES),
  locale: z.enum(LOCALES),
});

export type UserDataForm = z.infer<typeof userSchema>;
