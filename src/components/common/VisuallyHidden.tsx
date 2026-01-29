/**
 * VisuallyHidden Component
 *
 * Renders content that is accessible to screen readers but visually hidden.
 * Uses CSS to hide content without removing it from the accessibility tree.
 *
 * Use cases:
 * - Providing context for screen reader users that's obvious visually
 * - Skip navigation links
 * - Descriptive labels for icon-only buttons
 * - Additional context for data visualizations
 */

import React from 'react';

export interface VisuallyHiddenProps {
  /** Content to hide visually but expose to screen readers */
  children: React.ReactNode;

  /** HTML element to render (default: 'span') */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a';

  /** Whether the element should be focusable (useful for skip links) */
  focusable?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * VisuallyHidden Component
 *
 * Hides content visually while keeping it accessible to assistive technologies.
 * Uses the "sr-only" pattern recommended by accessibility experts.
 *
 * @example
 * // Basic usage
 * <button>
 *   <TrashIcon />
 *   <VisuallyHidden>Delete budget item</VisuallyHidden>
 * </button>
 *
 * @example
 * // Skip navigation link (focusable)
 * <VisuallyHidden as="a" focusable>
 *   Skip to main content
 * </VisuallyHidden>
 *
 * @example
 * // Heading for screen readers only
 * <VisuallyHidden as="h2">
 *   Budget Allocation Details
 * </VisuallyHidden>
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
  focusable = false,
  className = '',
}: VisuallyHiddenProps) {
  // Combine base sr-only class with optional custom classes
  const combinedClassName = focusable
    ? `sr-only-focusable ${className}`.trim()
    : `sr-only ${className}`.trim();

  return <Component className={combinedClassName}>{children}</Component>;
}

/**
 * Convenience component for skip navigation links
 *
 * @example
 * <SkipLink href="#main-content">
 *   Skip to main content
 * </SkipLink>
 */
export function SkipLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <VisuallyHidden as="a" focusable>
      <a
        href={href}
        className="sr-only-focusable focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:no-underline"
      >
        {children}
      </a>
    </VisuallyHidden>
  );
}

// Export individual components
export default VisuallyHidden;
