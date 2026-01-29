import { ExternalLink, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceCitationProps {
  source: string;
  url: string;
  date?: string;
  className?: string;
}

export function SourceCitation({ source, url, date, className }: SourceCitationProps) {
  return (
    <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
      <span className="text-muted-foreground/70">Source:</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-foreground/50"
      >
        <span>{source}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
      {date && (
        <>
          <span className="text-muted-foreground/50">•</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground/70">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Last updated {date}</span>
          </span>
        </>
      )}
    </div>
  );
}
