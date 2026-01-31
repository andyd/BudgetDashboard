"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// Types
// ============================================================================

export type SetValue<T> = T | ((prevValue: T) => T);

export interface UseLocalStorageOptions<T> {
  /** Serializer function (default: JSON.stringify) */
  serializer?: (value: T) => string;
  /** Deserializer function (default: JSON.parse) */
  deserializer?: (value: string) => T;
  /** Callback when quota is exceeded */
  onQuotaExceeded?: (error: Error, key: string, value: T) => void;
  /** Callback when parse error occurs */
  onParseError?: (error: Error, key: string, rawValue: string) => void;
  /** Whether to sync across tabs (default: true) */
  syncTabs?: boolean;
}

export interface UseLocalStorageReturn<T> {
  /** Current stored value */
  value: T;
  /** Set value (accepts value or updater function) */
  setValue: (value: SetValue<T>) => void;
  /** Remove the item from localStorage */
  removeValue: () => void;
  /** Whether localStorage is available */
  isAvailable: boolean;
  /** Last error that occurred */
  error: Error | null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__localStorage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get an item from localStorage
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T,
  deserializer: (value: string) => T = JSON.parse,
): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return deserializer(item);
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * Returns true if successful, false otherwise
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  serializer: (value: T) => string = JSON.stringify,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const serialized = serializer(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Check if it's a quota exceeded error
    if (isQuotaExceededError(error)) {
      console.warn(`localStorage quota exceeded for key "${key}"`);
    }
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an error is a quota exceeded error
 */
export function isQuotaExceededError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // Different browsers report quota exceeded differently
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    // Safari
    (error.name === "QUOTA_EXCEEDED_ERR" && error.message.includes("quota")) ||
    // Generic check
    error.message.toLowerCase().includes("quota")
  );
}

/**
 * Get localStorage usage statistics
 */
export function getStorageUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let used = 0;
    for (const key in window.localStorage) {
      if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
        used += (window.localStorage.getItem(key)?.length || 0) * 2; // UTF-16 = 2 bytes per char
      }
    }

    // Most browsers have 5MB limit
    const total = 5 * 1024 * 1024;

    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  } catch {
    return null;
  }
}

/**
 * Clear all items with a specific prefix from localStorage
 */
export function clearStorageByPrefix(prefix: string): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    return keysToRemove.length;
  } catch {
    return 0;
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * React hook for persisting state to localStorage with SSR support,
 * cross-tab synchronization, and error handling.
 *
 * @example
 * ```tsx
 * const { value, setValue, removeValue } = useLocalStorage('my-key', 'default');
 *
 * // With options
 * const { value, setValue } = useLocalStorage('settings', defaultSettings, {
 *   syncTabs: true,
 *   onQuotaExceeded: (error, key) => {
 *     console.error(`Storage full for ${key}`);
 *   },
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {},
): UseLocalStorageReturn<T> {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onQuotaExceeded,
    onParseError,
    syncTabs = true,
  } = options;

  // Track if localStorage is available
  const [isAvailable] = useState(() => isLocalStorageAvailable());

  // Track errors
  const [error, setError] = useState<Error | null>(null);

  // Use ref to avoid stale closure issues
  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR: return default value
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return deserializer(item);
    } catch (err) {
      const parseError = err instanceof Error ? err : new Error(String(err));
      if (onParseError) {
        const rawValue = window.localStorage.getItem(key) ?? "";
        onParseError(parseError, key, rawValue);
      }
      console.warn(`Error parsing localStorage key "${key}":`, parseError);
      return defaultValue;
    }
  });

  // Set value handler
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setError(null);

        // Handle function updater
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Update React state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          try {
            const serialized = serializer(valueToStore);
            window.localStorage.setItem(key, serialized);
          } catch (err) {
            const storageError =
              err instanceof Error ? err : new Error(String(err));
            setError(storageError);

            if (isQuotaExceededError(storageError)) {
              console.warn(`localStorage quota exceeded for key "${key}"`);
              if (onQuotaExceeded) {
                onQuotaExceeded(storageError, key, valueToStore);
              }
            } else {
              console.error(
                `Error saving to localStorage key "${key}":`,
                storageError,
              );
            }
          }
        }
      } catch (err) {
        const unexpectedError =
          err instanceof Error ? err : new Error(String(err));
        setError(unexpectedError);
        console.error(
          `Unexpected error in setValue for key "${key}":`,
          unexpectedError,
        );
      }
    },
    [key, storedValue, serializer, onQuotaExceeded],
  );

  // Remove value handler
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(defaultValueRef.current);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      const removeError = err instanceof Error ? err : new Error(String(err));
      setError(removeError);
      console.error(`Error removing localStorage key "${key}":`, removeError);
    }
  }, [key]);

  // Sync across tabs via storage event
  useEffect(() => {
    if (!syncTabs || typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      // Only handle events for our key
      if (event.key !== key) {
        return;
      }

      // Key was removed
      if (event.newValue === null) {
        setStoredValue(defaultValueRef.current);
        return;
      }

      // Key was updated
      try {
        const newValue = deserializer(event.newValue);
        setStoredValue(newValue);
      } catch (err) {
        const parseError = err instanceof Error ? err : new Error(String(err));
        if (onParseError) {
          onParseError(parseError, key, event.newValue);
        }
        console.warn(
          `Error parsing storage event for key "${key}":`,
          parseError,
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, syncTabs, deserializer, onParseError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isAvailable,
    error,
  };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Simple version that returns [value, setValue] tuple like useState
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  options?: UseLocalStorageOptions<T>,
): [T, (value: SetValue<T>) => void] {
  const { value, setValue } = useLocalStorage(key, defaultValue, options);
  return [value, setValue];
}

export default useLocalStorage;
