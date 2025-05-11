import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { PERMISSIONS } from '../../utils/permissions';
import { useUser } from '../../composables/useUser';

// Mock data
const mockUserWithReadPermissions = {
  value: {
    id: 1,
    name: 'Test User',
    permissions: [
      { entity: 'projects', permission: PERMISSIONS.PROJECTS_READ },
      { entity: 'users', permission: PERMISSIONS.USERS_READ },
    ],
  },
};

const mockUserWithWritePermissions = {
  value: {
    id: 1,
    name: 'Admin User',
    permissions: [
      {
        entity: 'projects',
        permission: PERMISSIONS.PROJECTS_READ + PERMISSIONS.PROJECTS_WRITE,
      },
      {
        entity: 'users',
        permission: PERMISSIONS.USERS_READ + PERMISSIONS.USERS_WRITE,
      },
    ],
  },
};

const mockUserWithEmptyPermissions = {
  value: {
    id: 1,
    name: 'Test User',
    permissions: [],
  },
};

// Create a hoisted mock that exists before any test code runs
const { useUserSessionMock } = vi.hoisted(() => {
  return {
    useUserSessionMock: vi.fn(() => ({
      user: mockUserWithReadPermissions,
    })),
  };
});

// Set up the mock once before all tests
mockNuxtImport('useUserSession', () => {
  return useUserSessionMock;
});

describe('useUser composable', () => {
  it('userIsAllowedToWrite should return false when user has only read permissions', () => {
    // Arrange
    useUserSessionMock.mockReturnValue({
      user: mockUserWithReadPermissions,
    });

    // Act
    const { userIsAllowedToWrite } = useUser();

    // Assert
    expect(userIsAllowedToWrite('projects')).toBe(false);
    expect(userIsAllowedToWrite('users')).toBe(false);
  });

  it('userIsAllowedToWrite should return true when user has write permissions', () => {
    // Arrange
    useUserSessionMock.mockReturnValue({
      user: mockUserWithWritePermissions,
    });

    // Act
    const { userIsAllowedToWrite } = useUser();

    // Assert
    expect(userIsAllowedToWrite('projects')).toBe(true);
    expect(userIsAllowedToWrite('users')).toBe(true);
  });

  it('userIsAllowedToWrite should handle empty permissions array gracefully', () => {
    // Arrange
    useUserSessionMock.mockReturnValue({
      user: mockUserWithEmptyPermissions,
    });

    // Act
    const { userIsAllowedToWrite } = useUser();

    // Assert
    expect(userIsAllowedToWrite('projects')).toBe(false);
    expect(userIsAllowedToWrite('users')).toBe(false);
  });
});
