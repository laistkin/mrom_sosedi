'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  function showToast(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  function success(message: string) {
    showToast(message, 'success');
  }

  function error(message: string) {
    showToast(message, 'error');
  }

  function info(message: string) {
    showToast(message, 'info');
  }

  return { toasts, success, error, info };
}

export function ToastContainer({ toasts }: { toasts: ToastData[] }) {
  if (toasts.length === 0) return null;

  const styles: Record<ToastType, string> = {
    success: 'bg-[#2f9f6b] text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-zinc-800 text-white',
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 md:left-auto md:right-4 md:translate-x-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-full px-5 py-3 text-sm font-black shadow-lg ${styles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
