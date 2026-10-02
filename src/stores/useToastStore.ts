import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStoreState {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
  toasts: [],
  showToast: (message: string, type: ToastType = 'success', duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, message, duration };

    set({ toasts: [...get().toasts, newToast] });

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

// Shortcut helpers
export const toast = {
  success: (msg: string) => useToastStore.getState().showToast(msg, 'success'),
  error: (msg: string) => useToastStore.getState().showToast(msg, 'error'),
  warning: (msg: string) => useToastStore.getState().showToast(msg, 'warning'),
  info: (msg: string) => useToastStore.getState().showToast(msg, 'info'),
};
