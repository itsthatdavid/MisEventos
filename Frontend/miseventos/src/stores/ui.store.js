import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // State
  toasts: [],
  globalLoading: false,
  
  // Actions
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  // Helper methods
  showSuccess: (message, options = {}) => {
    get().addToast({ message, type: 'success', ...options });
  },
  
  showError: (message, options = {}) => {
    get().addToast({ message, type: 'error', ...options });
  },
  
  showWarning: (message, options = {}) => {
    get().addToast({ message, type: 'warning', ...options });
  },
  
  showInfo: (message, options = {}) => {
    get().addToast({ message, type: 'info', ...options });
  },
}));