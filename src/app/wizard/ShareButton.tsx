"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

export interface ShareButtonProps {
  className?: string;
}

/**
 * ShareButton - Copies current URL to clipboard for sharing wizard results
 *
 * Features:
 * - Copies current page URL to clipboard
 * - Shows visual feedback ("Copied!" state change)
 * - Graceful fallback if clipboard API unavailable
 * - Dark theme styling with secondary button variant
 */
export function ShareButton({ className }: ShareButtonProps) {
  const { copy, copied, error } = useClipboard({ timeout: 2000 });
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Get current URL on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleShare = async () => {
    if (currentUrl) {
      await copy(currentUrl);
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="secondary"
      size="default"
      className={cn(
        "gap-2 transition-all duration-200 min-h-[44px] w-full sm:w-auto",
        copied && "bg-green-600 hover:bg-green-700 text-white",
        error && "bg-red-600 hover:bg-red-700 text-white",
        className,
      )}
      disabled={!currentUrl}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 shrink-0" />
          <span>Copied!</span>
        </>
      ) : error ? (
        <>
          <Share2 className="h-4 w-4 shrink-0" />
          <span className="hidden xs:inline">Failed to Copy</span>
          <span className="inline xs:hidden">Error</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Share Your Priorities</span>
          <span className="inline sm:hidden">Share Results</span>
        </>
      )}
    </Button>
  );
}
