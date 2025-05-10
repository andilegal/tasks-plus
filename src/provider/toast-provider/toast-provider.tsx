'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(({ type, message }: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 space-y-4 z-50 max-w-sm w-full">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`flex items-center gap-4 p-4 rounded-lg shadow-lg transition-transform transform ${
                  toast.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : toast.type === 'error'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : toast.type === 'info'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}
                style={{
                  animation: 'fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s',
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    toast.type === 'success'
                      ? 'bg-green-500'
                      : toast.type === 'error'
                        ? 'bg-red-500'
                        : toast.type === 'info'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                  }`}
                ></div>
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
