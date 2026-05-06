"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);
let pushToast = () => {};

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  pushToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...toast }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const value = useMemo(() => ({ toast: pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.variant === "error" ? XCircle : CheckCircle2;
          return (
            <div
              key={toast.id}
              className={cn(
                "rounded-lg border bg-card p-4 text-card-foreground shadow-lg",
                toast.variant === "error" && "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
              )}
            >
              <div className="flex gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5 text-emerald-600", toast.variant === "error" && "text-red-600")} />
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm opacity-85">{toast.description}</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return context || { toast: pushToast };
}

export function toast(options) {
  pushToast(options);
}
