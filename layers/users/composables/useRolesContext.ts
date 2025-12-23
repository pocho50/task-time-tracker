import type { InjectionKey } from 'vue';

interface RolesContext {
  handleEdit: (key: string) => void;
  handleRemove: (key: string) => void;
}

const RolesContextKey: InjectionKey<RolesContext> = Symbol('roles-context');

export function provideRolesContext(context: RolesContext) {
  provide(RolesContextKey, context);
}

export function useRolesContext() {
  const context = inject(RolesContextKey);
  if (!context) {
    throw new Error(
      'useRolesContext must be used within a component that calls provideRolesContext'
    );
  }
  return context;
}
