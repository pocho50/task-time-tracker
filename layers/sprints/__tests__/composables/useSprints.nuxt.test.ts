import { describe, it, expect, vi } from 'vitest';
import { useSprints } from '../../composables/useSprints';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mockSprints } from '../__mocks__/sprintMocks';

// Mock dependencies
const mockSprintsRepo = {
  setParams: vi.fn(),
  getByProjectId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

vi.mock('#layers/sprints/repository/sprintRepo', () => ({
  SprintsRepo: vi.fn().mockImplementation(() => mockSprintsRepo),
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
      data: mockSprints,
      pagination: { page: 1, pageCount: 2 },
    }),
    refresh: vi.fn(),
    status: ref('success'),
  });
});

describe('useSprints', () => {
  it('should return sprints from repository', () => {
    // Act
    const { sprints } = useSprints('project-1');

    // Assert
    expect(sprints.value).toHaveLength(2);
    expect(sprints.value[0]?.name).toMatchInlineSnapshot(`"Sprint 1"`);
  });

  it('should call save on repository when handleSave is called', async () => {
    // Arrange
    const sprintData = {
      name: 'New Sprint',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      status: 'PLANNING' as const,
    };
    mockSprintsRepo.save.mockResolvedValue({});

    // Act
    const { handleSave, openDrawer } = useSprints('project-1');
    await handleSave(sprintData);

    // Assert
    expect(mockSprintsRepo.save).toHaveBeenCalledWith({
      ...sprintData,
      projectId: 'project-1',
    });
    expect(openDrawer.value).toBe(false);
  });

  it('should update selectedSprint when handleEdit is called', () => {
    // Act
    const { handleEdit, selectedSprint, openDrawer } = useSprints('project-1');
    handleEdit('1');

    // Assert
    expect(selectedSprint.value).toMatchInlineSnapshot(`
      {
        "endDate": "2024-01-15",
        "id": "1",
        "name": "Sprint 1",
        "projectId": "project-1",
        "startDate": "2024-01-02",
        "status": "ACTIVE",
      }
    `);
    expect(openDrawer.value).toBe(true);
  });

  it('should call delete on repository when handleRemove is called', async () => {
    // Arrange
    mockSprintsRepo.delete.mockResolvedValue({});

    // Act
    const { handleRemove } = useSprints('project-1');
    await handleRemove('1');

    // Assert
    expect(mockSprintsRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should clear selectedSprint when handleAdd is called', () => {
    // Act
    const { handleAdd, selectedSprint, openDrawer } = useSprints('project-1');
    handleAdd();

    // Assert
    expect(selectedSprint.value).toBeUndefined();
    expect(openDrawer.value).toBe(true);
  });

  it('should return pagination data', () => {
    // Act
    const { pagination } = useSprints('project-1');

    // Assert
    expect(pagination.value).toMatchInlineSnapshot(`
      {
        "page": 1,
        "pageCount": 2,
      }
    `);
  });
});
