/**
 * DataFreshnessIndicator Component
 * Shows when budget data was last updated with freshness status
 */

"use client"

import { ExternalLink, Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface DataFreshnessIndicatorProps {
  lastUpdated: Date
  source: string
  sourceUrl: string
}

export function DataFreshnessIndicator({
  lastUpdated,
  source,
  sourceUrl,
}: DataFreshnessIndicatorProps) {
  // Calculate freshness status
  const now = new Date()
  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  )
  const isFresh = daysSinceUpdate <= 7

  // Format human-readable time ago
  const getTimeAgo = () => {
    if (daysSinceUpdate === 0) return "today"
    if (daysSinceUpdate === 1) return "1 day ago"
    if (daysSinceUpdate < 7) return `${daysSinceUpdate} days ago`
    if (daysSinceUpdate < 30) {
      const weeks = Math.floor(daysSinceUpdate / 7)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    }
    const months = Math.floor(daysSinceUpdate / 30)
    return months === 1 ? "1 month ago" : `${months} months ago`
  }

  // Format full date for tooltip
  const fullDate = lastUpdated.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {/* Status indicator with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 cursor-help">
              <div
                className={`size-2 rounded-full ${
                  isFresh ? "bg-green-500" : "bg-yellow-500"
                }`}
                aria-label={isFresh ? "Data is fresh" : "Data may be outdated"}
              />
              <Info className="size-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">
                {isFresh ? "Fresh data" : "Older data"}
              </p>
              <p className="text-xs">
                Last updated: {fullDate}
              </p>
              {!isFresh && (
                <p className="text-xs text-yellow-400">
                  Data is more than a week old
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Last updated display */}
        <span>Last updated: {getTimeAgo()}</span>

        {/* Source with link */}
        <span className="flex items-center gap-1">
          <span>•</span>
          <span>Source:</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          >
            {source}
            <ExternalLink className="size-3" />
          </a>
        </span>
      </div>
    </TooltipProvider>
  )
}
