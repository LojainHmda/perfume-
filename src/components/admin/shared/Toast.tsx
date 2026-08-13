import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check } from 'lucide-react';

export type ToastTone = 'success' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

/** Single-slot toast. A new message replaces the one on screen. */
export const useToast = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback((text: string, tone: ToastTone = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), text, tone });
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  return {
    toast,
    notify: push,
    fail: useCallback((text: string) => push(text, 'error'), [push]),
  };
};

export const Toast: React.FC<{ toast: ToastMessage | null }> = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed right-6 top-24 z-[100000] flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium text-white shadow-2xl ${
          toast.tone === 'error'
            ? 'border-red-500 bg-red-950'
            : 'border-emerald-500 bg-emerald-900'
        }`}
      >
        {toast.tone === 'error' ? (
          <AlertTriangle className="h-4 w-4 text-red-300" />
        ) : (
          <Check className="h-4 w-4 text-emerald-400" />
        )}
        <span>{toast.text}</span>
      </motion.div>
    )}
  </AnimatePresence>
);
