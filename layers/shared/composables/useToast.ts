export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  closable?: boolean;
}

export function useToast() {
  const messages = useState<Toast[]>('messages', () => []);

  const DURATION = 5000;

  const generateId = () => Date.now().toString();

  const showToast = (toast: Omit<Toast, 'id'> & { id?: string }) => {
    const id = toast?.id || generateId();
    const t: Toast = {
      id,
      title: toast.title,
      message: toast.message,
      type: toast.type || 'info',
      duration: toast.duration ?? DURATION,
      closable: toast.closable !== false,
    };
    messages.value.push(t);
    if (t.duration && t.duration > 0) {
      setTimeout(() => removeToast(id), t.duration);
    }
    return id;
  };

  const removeToast = (id: string) => {
    messages.value = messages.value.filter((t) => t.id !== id);
  };

  return {
    messages,
    showToast,
    removeToast,
  };
}
