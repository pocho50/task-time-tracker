import type { InjectionKey } from 'vue';

/**
 * Context interface for Users domain
 * Provides handlers for edit and remove operations
 */
interface UsersContext {
  handleEdit: (id: string) => void;
  handleRemove: (id: string) => void;
}

/**
 * Injection key for Users context
 * Used to ensure type safety when injecting
 */
const UsersContextKey: InjectionKey<UsersContext> = Symbol('users-context');

/**
 * Provides Users context to child components
 * Should be called in the parent component (page level)
 *
 * @param context - Object containing handler functions
 */
export function provideUsersContext(context: UsersContext) {
  provide(UsersContextKey, context);
}

/**
 * Injects Users context from parent component
 * Throws error if used outside of UsersContext provider
 *
 * @returns UsersContext object with handler functions
 */
export function useUsersContext() {
  const context = inject(UsersContextKey);
  if (!context) {
    throw new Error(
      'useUsersContext must be used within a component that calls provideUsersContext'
    );
  }
  return context;
}
