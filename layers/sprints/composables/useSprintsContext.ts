import type { InjectionKey } from 'vue';

/**
 * Context interface for Sprints domain
 * Provides handlers for edit and remove operations
 */
interface SprintsContext {
  handleEdit: (id: string) => void;
  handleRemove: (id: string) => void;
}

/**
 * Injection key for Sprints context
 * Used to ensure type safety when injecting
 */
const SprintsContextKey: InjectionKey<SprintsContext> =
  Symbol('sprints-context');

/**
 * Provides Sprints context to child components
 * Should be called in the parent component (page level)
 *
 * @param context - Object containing handler functions
 */
export function provideSprintsContext(context: SprintsContext) {
  provide(SprintsContextKey, context);
}

/**
 * Injects Sprints context from parent component
 * Throws error if used outside of SprintsContext provider
 *
 * @returns SprintsContext object with handler functions
 */
export function useSprintsContext() {
  const context = inject(SprintsContextKey);
  if (!context) {
    throw new Error(
      'useSprintsContext must be used within a component that calls provideSprintsContext'
    );
  }
  return context;
}
