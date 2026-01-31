"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Trap focus within modal
  React.useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the modal content when it opens
    contentRef.current?.focus();

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-slot="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0 duration-200"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={contentRef}
        data-slot="modal-content"
        tabIndex={-1}
        className={cn(
          "bg-background relative z-50 grid w-full gap-4 rounded-lg border p-6 shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "focus:outline-none",
          sizeClasses[size],
          size === "full" ? "h-full overflow-auto" : "",
          className,
        )}
      >
        {/* Header with title and close button */}
        {(title || showCloseButton) && (
          <div
            data-slot="modal-header"
            className="flex items-center justify-between gap-4"
          >
            {title && (
              <div
                data-slot="modal-title"
                className="text-lg font-semibold leading-none"
              >
                {title}
              </div>
            )}
            {showCloseButton && (
              <button
                data-slot="modal-close"
                type="button"
                onClick={onClose}
                className={cn(
                  "ring-offset-background focus:ring-ring rounded-xs opacity-70 transition-opacity",
                  "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "disabled:pointer-events-none",
                  '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
                  !title && "absolute top-4 right-4",
                )}
                aria-label="Close modal"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div data-slot="modal-body" className="text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            data-slot="modal-footer"
            className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Compound components for more flexibility
function ModalTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="modal-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="modal-body" className={cn("text-sm", className)} {...props}>
      {children}
    </div>
  );
}

function ModalFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Modal, ModalTitle, ModalBody, ModalFooter };
export type { ModalProps, ModalSize };
