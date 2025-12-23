export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  locale?: string;
  theme?: string;
  password?: string;
}
