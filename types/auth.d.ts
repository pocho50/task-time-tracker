import { UserRole } from '@prisma/client';

declare module '#auth-utils' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: { entity: string; permission: number }[];
    locale: 'en' | 'es';
    theme: 'light' | 'dark';
  }
}

export {};
