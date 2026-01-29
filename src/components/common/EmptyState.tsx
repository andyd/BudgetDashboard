import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  /** Title text displayed prominently */
  title: string;
  /** Description text providing additional context */
  description?: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Optional action button configuration */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  /** Additional CSS classes */
  className?: string;
  /** Icon size variant */
  iconSize?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable empty state component for displaying when content is not available.
 * Uses muted colors and centered layout with optional CTA button.
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
  iconSize = 'md',
}: EmptyStateProps) {
  const iconSizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-12 px-4',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-4 rounded-full bg-muted/50 p-3',
          'flex items-center justify-center'
        )}
      >
        <Icon
          className={cn(
            iconSizeClasses[iconSize],
            'text-muted-foreground/60'
          )}
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Optional Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          size="sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
