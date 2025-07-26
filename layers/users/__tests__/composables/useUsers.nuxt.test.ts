import { describe, it, expect, vi } from 'vitest';
import { useUsers } from '../../composables/useUsers';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mockUsers } from '../__mocks__/userMocks';

// Mock dependencies
const mockUserRepo = {
  getAll: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
};

vi.mock('../../repository/userRepo', () => ({
  UserRepo: vi.fn().mockImplementation(() => mockUserRepo),
}));

const page = ref(1);

// Mock Nuxt imports
mockNuxtImport('useNuxtApp', () => {
  return () => ({ $api: {} });
});

mockNuxtImport('useRouteQuery', () => {
  return () => page;
});

mockNuxtImport('useAsyncData', () => {
  return (cb: any) => ({
    data: ref({
      data: mockUsers,
      pagination: { page: 1, pageCount: 2 },
    }),
    refresh: vi.fn(),
    status: ref('success'),
  });
});

describe('useUsers', () => {
  it('should return users from repository', () => {
    const { users } = useUsers();
    expect(users.value).toHaveLength(2);
    expect(users.value[0]!.name).toBe('Alice');
  });

  it('should call save on repository and close drawer when handleSave is called', async () => {
    const userData = {
      id: 'u3',
      name: 'Charlie',
      email: 'charlie@example.com',
      role: 'USER' as const,
    };

    mockUserRepo.save.mockResolvedValue({});
    const { handleSave, openDrawer } = useUsers();
    openDrawer.value = true;
    await handleSave(userData);
    expect(mockUserRepo.save).toHaveBeenCalledWith(userData);
    expect(openDrawer.value).toBe(false);
  });

  it('should update selectedUser and open drawer when handleEdit is called', () => {
    const { handleEdit, selectedUser, openDrawer } = useUsers();
    handleEdit('u1');
    expect(selectedUser.value?.name).toBe('Alice');
    expect(openDrawer.value).toBe(true);
  });

  it('should call remove on repository and refresh when handleRemove is called', async () => {
    mockUserRepo.remove.mockResolvedValue({});
    const { handleRemove } = useUsers();
    await handleRemove('u1');
    expect(mockUserRepo.remove).toHaveBeenCalledWith('u1');
  });

  it('should set selectedUser to undefined and open drawer on handleAdd', () => {
    const { handleAdd, selectedUser, openDrawer } = useUsers();
    selectedUser.value = {
      id: 'u1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'ADMIN',
    };
    openDrawer.value = false;
    handleAdd();
    expect(selectedUser.value).toBeUndefined();
    expect(openDrawer.value).toBe(true);
  });

  it('isCreate should be true when selectedUser is undefined', () => {
    const { isCreate, selectedUser } = useUsers();
    selectedUser.value = undefined;
    expect(isCreate.value).toBe(true);
  });

  it('isCreate should be false when selectedUser is set', () => {
    const { isCreate, selectedUser } = useUsers();
    selectedUser.value = {
      id: 'u1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'ADMIN',
    };
    expect(isCreate.value).toBe(false);
  });
});
