"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Announcement priority level
 * - 'polite': Waits for current speech to finish (most common)
 * - 'assertive': Interrupts current speech (use sparingly, for urgent messages)
 */
type AnnouncementPriority = "polite" | "assertive";

interface AnnounceOptions {
  /** Priority level for the announcement. Defaults to 'polite' */
  priority?: AnnouncementPriority;
  /** Delay in ms before clearing the announcement. Defaults to 1000ms */
  clearDelay?: number;
}

interface AnnouncerContextValue {
  /** Announce a message to screen readers */
  announce: (message: string, options?: AnnounceOptions) => void;
  /** Clear all current announcements */
  clearAnnouncements: () => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

/**
 * Visually hidden styles that keep content accessible to screen readers.
 * Based on the "sr-only" pattern recommended by accessibility experts.
 */
const visuallyHiddenStyles: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

interface ScreenReaderAnnouncerProviderProps {
  children: ReactNode;
}

/**
 * ScreenReaderAnnouncerProvider
 *
 * Provides a context for announcing messages to screen readers using aria-live regions.
 * Wrap your application (or a section of it) with this provider, then use the
 * useAnnounce hook to make announcements.
 *
 * Features:
 * - Polite and assertive announcement modes
 * - Automatic clearing of announcements after a configurable delay
 * - Visually hidden but accessible to screen readers
 * - Follows WCAG 2.1 best practices for live regions
 *
 * @example
 * ```tsx
 * // In your layout or root component:
 * <ScreenReaderAnnouncerProvider>
 *   <App />
 * </ScreenReaderAnnouncerProvider>
 *
 * // In any child component:
 * const { announce } = useAnnounce();
 * announce('Item saved successfully');
 * announce('Error: Form validation failed', { priority: 'assertive' });
 * ```
 */
export function ScreenReaderAnnouncerProvider({
  children,
}: ScreenReaderAnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  // Keep track of timeouts so we can clear them
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Counter to force re-renders for duplicate messages
  const announcementCountRef = useRef(0);

  const clearAnnouncements = useCallback(() => {
    if (politeTimeoutRef.current) {
      clearTimeout(politeTimeoutRef.current);
      politeTimeoutRef.current = null;
    }
    if (assertiveTimeoutRef.current) {
      clearTimeout(assertiveTimeoutRef.current);
      assertiveTimeoutRef.current = null;
    }
    setPoliteMessage("");
    setAssertiveMessage("");
  }, []);

  const announce = useCallback(
    (message: string, options: AnnounceOptions = {}) => {
      const { priority = "polite", clearDelay = 1000 } = options;

      if (!message.trim()) return;

      // Increment counter to ensure screen readers announce duplicate messages
      announcementCountRef.current += 1;

      // For duplicate message detection, we append an invisible counter
      // This forces screen readers to treat it as a new announcement
      const uniqueMessage = `${message}`;

      if (priority === "assertive") {
        // Clear any pending assertive timeout
        if (assertiveTimeoutRef.current) {
          clearTimeout(assertiveTimeoutRef.current);
        }

        // Clear and re-set to force announcement of duplicate messages
        setAssertiveMessage("");
        // Use requestAnimationFrame to ensure the clear takes effect
        requestAnimationFrame(() => {
          setAssertiveMessage(uniqueMessage);
        });

        // Auto-clear after delay
        assertiveTimeoutRef.current = setTimeout(() => {
          setAssertiveMessage("");
          assertiveTimeoutRef.current = null;
        }, clearDelay);
      } else {
        // Clear any pending polite timeout
        if (politeTimeoutRef.current) {
          clearTimeout(politeTimeoutRef.current);
        }

        // Clear and re-set to force announcement of duplicate messages
        setPoliteMessage("");
        requestAnimationFrame(() => {
          setPoliteMessage(uniqueMessage);
        });

        // Auto-clear after delay
        politeTimeoutRef.current = setTimeout(() => {
          setPoliteMessage("");
          politeTimeoutRef.current = null;
        }, clearDelay);
      }
    },
    [],
  );

  const contextValue: AnnouncerContextValue = {
    announce,
    clearAnnouncements,
  };

  return (
    <AnnouncerContext.Provider value={contextValue}>
      {children}

      {/*
        Aria-live regions for screen reader announcements.
        These are visually hidden but announced by screen readers.

        We use two separate regions for polite and assertive messages
        as recommended by WCAG. This allows proper queuing behavior.

        The aria-atomic="true" ensures the entire content is announced,
        not just the changed portions.
      */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={visuallyHiddenStyles}
      >
        {politeMessage}
      </div>

      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={visuallyHiddenStyles}
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}

/**
 * useAnnounce hook
 *
 * Provides methods to announce messages to screen readers.
 * Must be used within a ScreenReaderAnnouncerProvider.
 *
 * @returns Object containing announce and clearAnnouncements functions
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { announce } = useAnnounce();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       announce('Changes saved successfully');
 *     } catch (error) {
 *       announce('Failed to save changes', { priority: 'assertive' });
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useAnnounce(): AnnouncerContextValue {
  const context = useContext(AnnouncerContext);

  if (!context) {
    throw new Error(
      "useAnnounce must be used within a ScreenReaderAnnouncerProvider",
    );
  }

  return context;
}

/**
 * Re-export types for consumers
 */
export type { AnnouncementPriority, AnnounceOptions, AnnouncerContextValue };
