import type { InjectionKey } from 'vue';

/**
 * Context interface for Projects domain
 * Provides handlers for edit, remove, and refresh operations
 */
interface ProjectsContext {
  handleEdit: (id: string) => void;
  handleRemove: (id: string) => void;
}

/**
 * Injection key for Projects context
 * Used to ensure type safety when injecting
 */
const ProjectsContextKey: InjectionKey<ProjectsContext> =
  Symbol('projects-context');

/**
 * Provides Projects context to child components
 * Should be called in the parent component (page level)
 *
 * @param context - Object containing handler functions
 */
export function provideProjectsContext(context: ProjectsContext) {
  provide(ProjectsContextKey, context);
}

/**
 * Injects Projects context from parent component
 * Throws error if used outside of ProjectsContext provider
 *
 * @returns ProjectsContext object with handler functions
 */
export function useProjectsContext() {
  const context = inject(ProjectsContextKey);
  if (!context) {
    throw new Error(
      'useProjectsContext must be used within a component that calls provideProjectsContext'
    );
  }
  return context;
}
