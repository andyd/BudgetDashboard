import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  icon?: LucideIcon;
}

export function Loading({
  size = 'md',
  text,
  variant = 'spinner',
  className,
  icon: Icon = Loader2,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'animate-pulse rounded-full bg-current',
                  size === 'sm' && 'h-2 w-2',
                  size === 'md' && 'h-3 w-3',
                  size === 'lg' && 'h-4 w-4',
                  size === 'xl' && 'h-5 w-5'
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div
            className={cn(
              'animate-pulse rounded-full bg-current',
              size === 'sm' && 'h-4 w-4',
              size === 'md' && 'h-8 w-8',
              size === 'lg' && 'h-12 w-12',
              size === 'xl' && 'h-16 w-16'
            )}
          />
        );
      default:
        return <Icon className={cn('animate-spin', sizeClasses[size])} />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-2',
        className
      )}
    >
      {renderLoader()}
      {text && (
        <p
          className={cn(
            'text-muted-foreground text-center',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-lg'
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
