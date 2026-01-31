"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  createElement,
  type ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

export type ModifierKey = "meta" | "ctrl" | "alt" | "shift";

export interface KeyboardShortcut {
  /** The key to listen for (e.g., 'k', 'Enter', 'Escape', 'ArrowUp') */
  key: string;
  /** Modifier keys required (meta = Cmd on Mac, Ctrl on Windows) */
  modifiers?: ModifierKey[];
  /** Handler function called when shortcut is triggered */
  handler: (event: KeyboardEvent) => void;
  /** Description for accessibility and help dialogs */
  description?: string;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  /** Whether to stop event propagation */
  stopPropagation?: boolean;
  /** Only trigger when this element or its children are focused */
  scope?: "global" | "focused";
}

export interface KeyboardShortcutsContextValue {
  /** Whether shortcuts are currently enabled */
  enabled: boolean;
  /** Enable keyboard shortcuts */
  enable: () => void;
  /** Disable keyboard shortcuts (e.g., when typing in inputs) */
  disable: () => void;
  /** Toggle shortcuts enabled state */
  toggle: () => void;
  /** Register a new shortcut */
  registerShortcut: (id: string, shortcut: KeyboardShortcut) => void;
  /** Unregister a shortcut */
  unregisterShortcut: (id: string) => void;
  /** Get all registered shortcuts for help dialogs */
  getShortcuts: () => Map<string, KeyboardShortcut>;
}

export interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  /** Whether shortcuts are enabled by default */
  defaultEnabled?: boolean;
  /** Whether to auto-disable when user is typing in inputs */
  disableInInputs?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  /** Whether to use platform-aware modifier (Cmd on Mac, Ctrl on Windows) */
  usePlatformModifier?: boolean;
}

// ============================================================================
// Context
// ============================================================================

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null);

// ============================================================================
// Utilities
// ============================================================================

/**
 * Detects if the current platform is macOS
 */
function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

/**
 * Checks if the active element is an input-like element
 */
function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  const isInput =
    tagName === "input" || tagName === "textarea" || tagName === "select";
  const isContentEditable = element.getAttribute("contenteditable") === "true";
  return isInput || isContentEditable;
}

/**
 * Checks if a keyboard event matches the required modifiers
 */
function matchesModifiers(
  event: KeyboardEvent,
  modifiers?: ModifierKey[],
): boolean {
  if (!modifiers || modifiers.length === 0) {
    // No modifiers required, but make sure none are pressed
    return !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
  }

  const required = new Set(modifiers);
  const mac = isMac();

  // Check meta/ctrl (platform-aware: meta on Mac, ctrl on Windows/Linux)
  const metaPressed = mac ? event.metaKey : event.ctrlKey;
  const ctrlPressed = mac ? event.ctrlKey : event.metaKey;

  // meta modifier means Cmd on Mac, Ctrl on Windows
  if (required.has("meta") && !metaPressed) return false;
  if (!required.has("meta") && metaPressed) return false;

  // ctrl modifier means actual Ctrl key
  if (required.has("ctrl") && !ctrlPressed) return false;
  if (!required.has("ctrl") && ctrlPressed) return false;

  // alt modifier
  if (required.has("alt") && !event.altKey) return false;
  if (!required.has("alt") && event.altKey) return false;

  // shift modifier
  if (required.has("shift") && !event.shiftKey) return false;
  if (!required.has("shift") && event.shiftKey) return false;

  return true;
}

/**
 * Normalizes the key for comparison
 */
function normalizeKey(key: string): string {
  return key.toLowerCase();
}

// ============================================================================
// Provider Component
// ============================================================================

export function KeyboardShortcutsProvider({
  children,
  defaultEnabled = true,
  disableInInputs = true,
}: KeyboardShortcutsProviderProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [shortcuts, setShortcuts] = useState<Map<string, KeyboardShortcut>>(
    new Map(),
  );

  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => setEnabled(false), []);
  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  const registerShortcut = useCallback(
    (id: string, shortcut: KeyboardShortcut) => {
      setShortcuts((prev) => {
        const next = new Map(prev);
        next.set(id, shortcut);
        return next;
      });
    },
    [],
  );

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const getShortcuts = useCallback(() => shortcuts, [shortcuts]);

  // Global keydown listener
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if shortcuts are enabled
      if (!enabled) return;

      // Check if we should disable in input elements
      if (disableInInputs && isInputElement(document.activeElement)) {
        // Still allow Escape key in inputs (to close modals, clear focus, etc.)
        if (event.key !== "Escape") {
          return;
        }
      }

      // Find matching shortcut
      for (const [, shortcut] of shortcuts) {
        const keyMatches =
          normalizeKey(event.key) === normalizeKey(shortcut.key);
        const modifiersMatch = matchesModifiers(event, shortcut.modifiers);

        if (keyMatches && modifiersMatch) {
          // Check scope if applicable
          if (shortcut.scope === "focused") {
            // Only trigger for focused scope shortcuts if the target is within document
            continue;
          }

          // Prevent default if specified
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }

          // Stop propagation if specified
          if (shortcut.stopPropagation) {
            event.stopPropagation();
          }

          // Call the handler
          shortcut.handler(event);
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, disableInInputs, shortcuts]);

  const value = useMemo<KeyboardShortcutsContextValue>(
    () => ({
      enabled,
      enable,
      disable,
      toggle,
      registerShortcut,
      unregisterShortcut,
      getShortcuts,
    }),
    [
      enabled,
      enable,
      disable,
      toggle,
      registerShortcut,
      unregisterShortcut,
      getShortcuts,
    ],
  );

  return createElement(KeyboardShortcutsContext.Provider, { value }, children);
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access the keyboard shortcuts context
 */
export function useKeyboardShortcutsContext(): KeyboardShortcutsContextValue {
  const context = useContext(KeyboardShortcutsContext);

  if (!context) {
    throw new Error(
      "useKeyboardShortcutsContext must be used within a KeyboardShortcutsProvider",
    );
  }

  return context;
}

/**
 * Hook to register keyboard shortcuts
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   'search': {
 *     key: 'k',
 *     modifiers: ['meta'],
 *     handler: () => openSearchDialog(),
 *     description: 'Open search',
 *   },
 *   'close': {
 *     key: 'Escape',
 *     handler: () => closeModal(),
 *     description: 'Close modal',
 *   },
 * });
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: Record<string, KeyboardShortcut>,
  deps: React.DependencyList = [],
): void {
  const context = useContext(KeyboardShortcutsContext);

  useEffect(() => {
    // If no provider is present, set up local listeners
    if (!context) {
      function handleKeyDown(event: KeyboardEvent) {
        // Don't handle if typing in an input
        if (isInputElement(document.activeElement) && event.key !== "Escape") {
          return;
        }

        for (const [, shortcut] of Object.entries(shortcuts)) {
          const keyMatches =
            normalizeKey(event.key) === normalizeKey(shortcut.key);
          const modifiersMatch = matchesModifiers(event, shortcut.modifiers);

          if (keyMatches && modifiersMatch) {
            if (shortcut.preventDefault !== false) {
              event.preventDefault();
            }
            if (shortcut.stopPropagation) {
              event.stopPropagation();
            }
            shortcut.handler(event);
            return;
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    // If provider is present, register shortcuts
    const entries = Object.entries(shortcuts);

    for (const [id, shortcut] of entries) {
      context.registerShortcut(id, shortcut);
    }

    return () => {
      for (const id of ids) {
        context.unregisterShortcut(id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, ...deps]);
}

// ============================================================================
// Preset Shortcut Creators
// ============================================================================

/**
 * Creates a search shortcut (Cmd/Ctrl+K)
 */
export function createSearchShortcut(handler: () => void): KeyboardShortcut {
  return {
    key: "k",
    modifiers: ["meta"],
    handler,
    description: "Open search",
    preventDefault: true,
  };
}

/**
 * Creates arrow navigation shortcuts
 */
export function createNavigationShortcuts(handlers: {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}): Record<string, KeyboardShortcut> {
  const shortcuts: Record<string, KeyboardShortcut> = {};

  if (handlers.onUp) {
    shortcuts["nav-up"] = {
      key: "ArrowUp",
      handler: handlers.onUp,
      description: "Navigate up",
      preventDefault: true,
    };
  }

  if (handlers.onDown) {
    shortcuts["nav-down"] = {
      key: "ArrowDown",
      handler: handlers.onDown,
      description: "Navigate down",
      preventDefault: true,
    };
  }

  if (handlers.onLeft) {
    shortcuts["nav-left"] = {
      key: "ArrowLeft",
      handler: handlers.onLeft,
      description: "Navigate left",
      preventDefault: true,
    };
  }

  if (handlers.onRight) {
    shortcuts["nav-right"] = {
      key: "ArrowRight",
      handler: handlers.onRight,
      description: "Navigate right",
      preventDefault: true,
    };
  }

  return shortcuts;
}

/**
 * Creates an Enter key shortcut for selection
 */
export function createSelectionShortcut(handler: () => void): KeyboardShortcut {
  return {
    key: "Enter",
    handler,
    description: "Select item",
    preventDefault: true,
  };
}

/**
 * Creates an Escape key shortcut for closing modals
 */
export function createEscapeShortcut(handler: () => void): KeyboardShortcut {
  return {
    key: "Escape",
    handler,
    description: "Close / Cancel",
    preventDefault: true,
  };
}

// ============================================================================
// Shortcut Display Utilities
// ============================================================================

/**
 * Returns the platform-appropriate modifier key symbol
 */
export function getModifierSymbol(modifier: ModifierKey): string {
  const mac = isMac();

  switch (modifier) {
    case "meta":
      return mac ? "⌘" : "Ctrl";
    case "ctrl":
      return mac ? "⌃" : "Ctrl";
    case "alt":
      return mac ? "⌥" : "Alt";
    case "shift":
      return mac ? "⇧" : "Shift";
    default:
      return modifier;
  }
}

/**
 * Formats a shortcut for display (e.g., "⌘K" or "Ctrl+K")
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const mac = isMac();
  const parts: string[] = [];

  if (shortcut.modifiers) {
    for (const modifier of shortcut.modifiers) {
      parts.push(getModifierSymbol(modifier));
    }
  }

  // Capitalize the key for display
  const displayKey =
    shortcut.key.length === 1
      ? shortcut.key.toUpperCase()
      : shortcut.key.replace("Arrow", "");

  parts.push(displayKey);

  return mac ? parts.join("") : parts.join("+");
}

/**
 * Gets keyboard shortcuts info for display in help dialogs
 */
export function getKeyboardShortcutsInfo() {
  return {
    global: [
      {
        keys: ["⌘", "K"],
        description: "Open search",
        windowsKeys: ["Ctrl", "K"],
      },
      { keys: ["Esc"], description: "Close modal / Clear selection" },
    ],
    navigation: [
      { keys: ["↑", "↓"], description: "Navigate up/down" },
      { keys: ["←", "→"], description: "Navigate left/right" },
      { keys: ["Enter"], description: "Select item" },
    ],
  };
}
