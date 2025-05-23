export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locale?: string;
  theme?: string;
  password?: string;
}
