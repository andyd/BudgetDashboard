"use client";

import { useState, useCallback, useRef } from "react";

export interface UseClipboardOptions {
  /** Time in milliseconds before copied state resets (default: 2000) */
  timeout?: number;
}

export interface UseClipboardReturn {
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether text was recently copied successfully */
  copied: boolean;
  /** Error message if copy failed */
  error: string | null;
}

/**
 * Standalone function to copy text to clipboard.
 * Uses Clipboard API with fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback for older browsers using execCommand
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Prevent scrolling to bottom of page
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch {
    return false;
  }
}

/**
 * React hook for copying text to clipboard.
 *
 * @param options - Configuration options
 * @returns Object containing copy function, copied state, and error state
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useClipboard({ timeout: 3000 });
 *
 * return (
 *   <button onClick={() => copy('Hello, World!')}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export function useClipboard(
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { timeout = 2000 } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Reset state
      setError(null);
      setCopied(false);

      try {
        const success = await copyToClipboard(text);

        if (success) {
          setCopied(true);

          // Reset copied state after timeout
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, timeout);

          return true;
        } else {
          setError("Failed to copy to clipboard");
          return false;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to copy to clipboard";
        setError(message);
        return false;
      }
    },
    [timeout],
  );

  return { copy, copied, error };
}
