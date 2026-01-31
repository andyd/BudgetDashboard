"use client";

import React from "react";

interface PageLayoutProps {
  mainModule: React.ReactNode;
  secondaryContent?: React.ReactNode;
  sideContent?: React.ReactNode;
}

export function PageLayout({
  mainModule,
  secondaryContent,
  sideContent,
}: PageLayoutProps) {
  return (
    <div
      className={`
        min-h-screen bg-slate-950 grid gap-6 p-4 lg:p-6
        grid-cols-1
        [grid-template-areas:'main'_'secondary'_'side']
        lg:grid-cols-[2fr_1fr]
        lg:[grid-template-areas:'main_side'_'secondary_side']
        lg:grid-rows-[auto_1fr]
      `}
    >
      {/* Main Module - First in DOM, displays first on mobile, left column on desktop */}
      <section className="[grid-area:main]">{mainModule}</section>

      {/* Secondary Content - Second in DOM, displays last on mobile, left column below main on desktop */}
      {secondaryContent && (
        <section className="[grid-area:secondary]">{secondaryContent}</section>
      )}

      {/* Side Content - Third in DOM, displays second on mobile, right column spanning both rows on desktop */}
      {sideContent && (
        <section className="[grid-area:side] lg:self-start">
          {sideContent}
        </section>
      )}
    </div>
  );
}

export default PageLayout;
