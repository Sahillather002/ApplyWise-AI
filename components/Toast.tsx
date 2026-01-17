
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => onClose(id), 5000);
      return () => clearTimeout(timer);
    }
  }, [id, type, onClose]);

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-indigo-500" />,
    loading: <Loader2 size={18} className="text-indigo-500 animate-spin" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/30',
    info: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/30',
    loading: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10',
  };

  return (
    <div className={`flex items-center space-x-3 px-5 py-4 rounded-2xl border shadow-xl animate-in slide-in-from-right-10 duration-300 ${bgColors[type]}`}>
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{message}</p>
      {type !== 'loading' && (
        <button onClick={() => onClose(id)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};
