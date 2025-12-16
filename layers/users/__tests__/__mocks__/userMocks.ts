import { ROLES } from '#layers/shared/utils/constants';

/**
 * Mock user data for testing
 */
export const mockUsers = [
  {
    id: 'u1',
    name: 'Alice',
    email: 'alice@example.com',
    role: ROLES.ADMIN,
  },
  {
    id: 'u2',
    name: 'Bob',
    email: 'bob@example.com',
    role: ROLES.USER,
  },
];
