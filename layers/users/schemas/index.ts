import { z } from 'zod';
import { LOCALES, THEMES } from '#layers/shared/utils/constants';
import { ROLES } from '#layers/users/utils/constants';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const settingsSchema = z.object({
  name: z.string().min(1),
  theme: z.enum(THEMES),
  locale: z.enum(LOCALES),
});

/**
 * Returns a user schema that adapts password validation for create vs update.
 * @param isCreate - true if creating, false if updating
 */
export function getUserSchema(isCreate: boolean) {
  return z
    .object({
      id: z.string().optional(),
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(ROLES),
      password: isCreate ? z.string().min(8) : z.string().min(8).optional(),
      repeatPassword: isCreate
        ? z.string().min(8)
        : z.string().min(8).optional(),
    })
    .refine(
      (data) => {
        // On create: both required and must match
        if (isCreate) return data.password === data.repeatPassword;
        // On update: if password is filled, repeatPassword must be filled and match
        if (data.password || data.repeatPassword) {
          return (
            !!data.password &&
            !!data.repeatPassword &&
            data.password === data.repeatPassword
          );
        }
        // If both empty, that's fine (no password update)
        return true;
      },
      {
        params: { i18n: 'zodI18n.errors.passwords_must_match' },
        path: ['repeatPassword'],
      }
    );
}

export type SettingsDataForm = z.infer<typeof settingsSchema>;
export type UserDataForm = z.infer<ReturnType<typeof getUserSchema>>;
