"use client";

import React, { memo } from "react";

interface PageLayoutProps {
  /** Optional header banner displayed above all content */
  headerBanner?: React.ReactNode;
  mainModule: React.ReactNode;
  secondaryContent?: React.ReactNode;
  sideContent?: React.ReactNode;
}

/**
 * PageLayout
 *
 * The main layout wrapper for the homepage.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 */
export const PageLayout = memo<PageLayoutProps>(function PageLayout({
  headerBanner,
  mainModule,
  secondaryContent,
  sideContent,
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Banner - Full width above the grid */}
      {headerBanner && (
        <header className="px-4 pt-6 pb-2 sm:px-6 sm:pt-8 md:px-8 md:pt-10 lg:px-12">
          {headerBanner}
        </header>
      )}

      {/* Main Grid Layout */}
      <div
        className={`
          grid gap-4 p-3
          grid-cols-1
          [grid-template-areas:'main'_'secondary'_'side']
          sm:gap-5 sm:p-4
          md:gap-6 md:p-5
          lg:grid-cols-[2fr_1fr] lg:gap-6 lg:p-6
          lg:[grid-template-areas:'main_side'_'secondary_side']
          lg:grid-rows-[auto_1fr]
          xl:grid-cols-[2.5fr_1fr] xl:gap-8 xl:p-8
        `}
      >
        {/* Main Module - First in DOM, displays first on mobile, left column on desktop */}
        <section className="[grid-area:main] w-full" aria-label="Main content">
          {mainModule}
        </section>

        {/* Secondary Content - Second in DOM, displays last on mobile, left column below main on desktop */}
        {secondaryContent && (
          <section
            className="[grid-area:secondary] w-full"
            aria-label="Secondary content"
          >
            {secondaryContent}
          </section>
        )}

        {/* Side Content - Third in DOM, displays second on mobile, right column spanning both rows on desktop */}
        {sideContent && (
          <section
            className="[grid-area:side] w-full lg:self-start lg:sticky lg:top-6"
            aria-label="Sidebar content"
          >
            {sideContent}
          </section>
        )}
      </div>
    </div>
  );
});

export default PageLayout;
