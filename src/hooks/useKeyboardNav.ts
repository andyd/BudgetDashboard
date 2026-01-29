import { useState, useCallback, useEffect, RefObject } from 'react';

export interface KeyboardNavItem {
  id: string;
  name: string;
  children?: KeyboardNavItem[];
}

export interface UseKeyboardNavOptions {
  items: KeyboardNavItem[];
  onDrillIn: (itemId: string) => void;
  onDrillOut: () => void;
  canDrillOut: boolean;
  containerRef?: RefObject<HTMLElement>;
  enabled?: boolean;
}

export interface UseKeyboardNavReturn {
  handleKeyDown: (event: React.KeyboardEvent) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  focusedItem: KeyboardNavItem | null;
  resetFocus: () => void;
}

/**
 * Custom hook for keyboard navigation in the Budget Dashboard
 *
 * Features:
 * - Arrow keys (Up/Down/Left/Right) to navigate between budget items
 * - Enter to drill into selected item (if it has children)
 * - Escape/Backspace to go up a level
 * - Tab to move between treemap and comparison panel
 * - Focus management with visual indicators
 *
 * @param options - Configuration options for keyboard navigation
 * @returns Navigation handlers and state
 */
export function useKeyboardNav({
  items,
  onDrillIn,
  onDrillOut,
  canDrillOut,
  containerRef,
  enabled = true,
}: UseKeyboardNavOptions): UseKeyboardNavReturn {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Get the currently focused item
  const focusedItem = focusedIndex >= 0 && focusedIndex < items.length
    ? items[focusedIndex]
    : null;

  // Reset focus when items change (e.g., after drill-in/out)
  useEffect(() => {
    setFocusedIndex(-1);
  }, [items]);

  // Reset focus handler
  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  // Navigate to previous item (Up/Left arrow)
  const navigatePrevious = useCallback(() => {
    if (items.length === 0) return;

    setFocusedIndex((prev) => {
      if (prev <= 0) return items.length - 1; // Wrap to last item
      return prev - 1;
    });
  }, [items.length]);

  // Navigate to next item (Down/Right arrow)
  const navigateNext = useCallback(() => {
    if (items.length === 0) return;

    setFocusedIndex((prev) => {
      if (prev >= items.length - 1) return 0; // Wrap to first item
      return prev + 1;
    });
  }, [items.length]);

  // Navigate to first item (Home key)
  const navigateFirst = useCallback(() => {
    if (items.length === 0) return;
    setFocusedIndex(0);
  }, [items.length]);

  // Navigate to last item (End key)
  const navigateLast = useCallback(() => {
    if (items.length === 0) return;
    setFocusedIndex(items.length - 1);
  }, [items.length]);

  // Drill into the focused item
  const drillIntoFocused = useCallback(() => {
    if (focusedItem && focusedItem.children && focusedItem.children.length > 0) {
      onDrillIn(focusedItem.id);
      // Focus will be reset by the useEffect when items change
    }
  }, [focusedItem, onDrillIn]);

  // Drill out to parent level
  const drillOutToParent = useCallback(() => {
    if (canDrillOut) {
      onDrillOut();
      // Focus will be reset by the useEffect when items change
    }
  }, [canDrillOut, onDrillOut]);

  // Main keyboard event handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!enabled) return;

    // Get the active element to check if we're in an input
    const activeElement = document.activeElement;
    const isInInput = activeElement instanceof HTMLInputElement ||
                     activeElement instanceof HTMLTextAreaElement ||
                     activeElement instanceof HTMLSelectElement;

    // Don't handle keyboard nav if user is typing in an input
    if (isInInput) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        navigatePrevious();
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        navigateNext();
        break;

      case 'Home':
        event.preventDefault();
        navigateFirst();
        break;

      case 'End':
        event.preventDefault();
        navigateLast();
        break;

      case 'Enter':
      case ' ': // Space bar
        event.preventDefault();
        if (focusedIndex >= 0) {
          drillIntoFocused();
        } else if (items.length > 0) {
          // If nothing is focused, focus the first item
          setFocusedIndex(0);
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (focusedIndex >= 0) {
          // If an item is focused, clear focus first
          resetFocus();
        } else {
          // If nothing is focused, drill out
          drillOutToParent();
        }
        break;

      case 'Backspace':
        event.preventDefault();
        drillOutToParent();
        break;

      case 'Tab':
        // Allow default Tab behavior for moving between treemap and other panels
        // Clear focus when tabbing away
        resetFocus();
        break;

      default:
        break;
    }
  }, [
    enabled,
    focusedIndex,
    items.length,
    navigatePrevious,
    navigateNext,
    navigateFirst,
    navigateLast,
    drillIntoFocused,
    drillOutToParent,
    resetFocus,
  ]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && containerRef?.current) {
      // Find the focused element by data attribute
      const focusedElement = containerRef.current.querySelector(
        `[data-nav-index="${focusedIndex}"]`
      );

      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, [focusedIndex, containerRef]);

  return {
    handleKeyDown,
    focusedIndex,
    setFocusedIndex,
    focusedItem,
    resetFocus,
  };
}

/**
 * Helper function to determine if an item can be drilled into
 */
export function canDrillInto(item: KeyboardNavItem): boolean {
  return Boolean(item.children && item.children.length > 0);
}

/**
 * Helper function to get keyboard shortcut hints for display
 */
export function getKeyboardShortcuts() {
  return {
    navigation: [
      { keys: ['↑', '↓', '←', '→'], description: 'Navigate between items' },
      { keys: ['Home'], description: 'Jump to first item' },
      { keys: ['End'], description: 'Jump to last item' },
    ],
    actions: [
      { keys: ['Enter', 'Space'], description: 'Drill into selected item' },
      { keys: ['Escape'], description: 'Clear selection or go back' },
      { keys: ['Backspace'], description: 'Go back to parent level' },
      { keys: ['Tab'], description: 'Move between panels' },
    ],
  };
}
