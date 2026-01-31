"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon, XIcon } from "lucide-react";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

function Toast({ message, type, isVisible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      data-slot="toast"
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
        type === "success" &&
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        type === "error" &&
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
      )}
    >
      {type === "success" ? (
        <CheckCircleIcon className="size-5 shrink-0" />
      ) : (
        <XCircleIcon className="size-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "ml-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
          type === "success" && "focus:ring-green-600",
          type === "error" && "focus:ring-red-600",
        )}
        aria-label="Close notification"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

export { Toast };
