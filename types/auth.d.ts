declare module '#auth-utils' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    locale: 'en' | 'es';
    theme: 'light' | 'dark';
  }
}

export {};
