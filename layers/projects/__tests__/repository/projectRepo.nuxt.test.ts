import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectsRepo } from '../../repository/projectRepo';

describe('ProjectsRepo', () => {
  let repo: ProjectsRepo<any>;
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.fn();
    repo = new ProjectsRepo<any>(mockFetch);
  });

  it('should call fetch with correct parameters when getAll is called', async () => {
    // Arrange
    repo.setParams({ page: 1 });
    mockFetch.mockResolvedValue({ data: [] });

    // Act
    await repo.getAll();

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('/api/projects?page=1');
  });

  it('should call fetch with correct parameters when delete is called', async () => {
    // Arrange
    mockFetch.mockResolvedValue({});

    // Act
    await repo.delete('123');

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('/api/projects/123', {
      method: 'DELETE',
    });
  });

  it('should call fetch with correct parameters when save is called', async () => {
    // Arrange
    const projectData = {
      name: 'Test Project',
      description: 'Test Description',
    };
    mockFetch.mockResolvedValue({});

    // Act
    await repo.save(projectData);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('/api/projects/save', {
      method: 'POST',
      body: projectData,
    });
  });
});
