import type { InjectionKey } from 'vue';

/**
 * Context interface for Tasks domain
 * Provides handlers for edit and refresh operations
 */
interface TasksContext {
  handleEdit: (id: string) => void;
  handleRefresh: () => Promise<void>;
}

/**
 * Injection key for Tasks context
 * Used to ensure type safety when injecting
 */
const TasksContextKey: InjectionKey<TasksContext> = Symbol('tasks-context');

/**
 * Provides Tasks context to child components
 * Should be called in the parent component (page level)
 *
 * @param context - Object containing handler functions
 */
export function provideTasksContext(context: TasksContext) {
  provide(TasksContextKey, context);
}

/**
 * Injects Tasks context from parent component
 * Throws error if used outside of TasksContext provider
 *
 * @returns TasksContext object with handler functions
 */
export function useTasksContext() {
  const context = inject(TasksContextKey);
  if (!context) {
    throw new Error(
      'useTasksContext must be used within a component that calls provideTasksContext'
    );
  }
  return context;
}
