"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  spendingId: string;
  unitId: string;
  className?: string;
}

export default function ShareButtons({
  spendingId,
  unitId,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getCompareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/compare/${spendingId}/${unitId}`;
  };

  const getOgImageUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/api/og/compare/${spendingId}/${unitId}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCompareUrl());
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadCard = () => {
    const ogImageUrl = getOgImageUrl();
    window.open(ogImageUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const shareUrl = getCompareUrl();
    const text = "Check out this federal budget comparison";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(
      twitterUrl,
      "_blank",
      "noopener,noreferrer,width=550,height=420",
    );
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-1.5"
      >
        {copied ? (
          <Check className="size-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="size-4" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadCard}
        className="gap-1.5"
      >
        <Download className="size-4" />
        Download Card
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareTwitter}
        className="gap-1.5"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share to X
      </Button>
    </div>
  );
}
