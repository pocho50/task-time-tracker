import { describe, it, expect } from 'vitest';
import { PERMISSIONS, hasPermission } from '../../utils/permissions';

describe('Permissions', () => {
  describe('PERMISSIONS constants', () => {
    it('should define project permission constants', () => {
      // Assert that project permissions are defined
      expect(PERMISSIONS.PROJECTS_READ).toBe(1);
      expect(PERMISSIONS.PROJECTS_WRITE).toBe(2);
      expect(PERMISSIONS.PROJECTS_DELETE).toBe(4);
    });

    it('should define user permission constants', () => {
      // Assert that user permissions are defined
      expect(PERMISSIONS.USERS_READ).toBe(1);
      expect(PERMISSIONS.USERS_WRITE).toBe(2);
      expect(PERMISSIONS.USERS_DELETE).toBe(4);
    });
  });

  describe('hasPermission function', () => {
    it('should return true when user has exact permission', () => {
      // Arrange - user with read permission for projects
      const userPermissions = [
        { entity: 'projects', permission: PERMISSIONS.PROJECTS_READ },
      ];

      // Act & Assert
      expect(
        hasPermission(userPermissions, {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_READ,
        })
      ).toBe(true);
    });

    it('should return true when user has combined permissions', () => {
      // Arrange - user with combined read and write permissions
      const userPermissions = [
        {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_READ + PERMISSIONS.PROJECTS_WRITE,
        },
      ];

      // Act & Assert - should pass for both read and write
      expect(
        hasPermission(userPermissions, {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_READ,
        })
      ).toBe(true);

      expect(
        hasPermission(userPermissions, {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_WRITE,
        })
      ).toBe(true);
    });

    it('should return false when user does not have permission', () => {
      // Arrange - user with only read permission
      const userPermissions = [
        { entity: 'projects', permission: PERMISSIONS.PROJECTS_READ },
      ];

      // Act & Assert - should fail for write permission
      expect(
        hasPermission(userPermissions, {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_WRITE,
        })
      ).toBe(false);
    });

    it('should return false when user has no permission for entity', () => {
      // Arrange - user with projects permission but no users permission
      const userPermissions = [
        { entity: 'projects', permission: PERMISSIONS.PROJECTS_READ },
      ];

      // Act & Assert - should fail for users entity
      expect(
        hasPermission(userPermissions, {
          entity: 'users',
          permission: PERMISSIONS.USERS_READ,
        })
      ).toBe(false);
    });

    it('should return false when permission array is empty', () => {
      // Arrange
      const userPermissions: { entity: string; permission: number }[] = [];

      // Act & Assert
      expect(
        hasPermission(userPermissions, {
          entity: 'projects',
          permission: PERMISSIONS.PROJECTS_READ,
        })
      ).toBe(false);
    });
  });
});
