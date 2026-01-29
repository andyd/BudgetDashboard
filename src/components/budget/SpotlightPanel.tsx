'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { InfoIcon, ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpotlightSource {
  label: string;
  url: string;
}

export interface SpotlightPanelProps {
  budgetItemId: string;
  title: string;
  description: string;
  sources: SpotlightSource[];
  className?: string;
  defaultOpen?: boolean;
}

export function SpotlightPanel({
  budgetItemId,
  title,
  description,
  sources,
  className,
  defaultOpen = false,
}: SpotlightPanelProps) {
  return (
    <Card
      className={cn(
        'bg-blue-50/50 border-blue-200/60 dark:bg-blue-950/20 dark:border-blue-900/40',
        className
      )}
    >
      <Accordion
        type="single"
        collapsible
        {...(defaultOpen && { defaultValue: budgetItemId })}
      >
        <AccordionItem value={budgetItemId} className="border-none">
          <CardHeader className="pb-0">
            <AccordionTrigger className="hover:no-underline py-0">
              <div className="flex items-start gap-3 text-left">
                <InfoIcon className="text-blue-600 dark:text-blue-400 size-5 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base font-semibold">
                    What is this?
                  </CardTitle>
                  <CardDescription className="text-sm font-normal">
                    {title}
                  </CardDescription>
                </div>
              </div>
            </AccordionTrigger>
          </CardHeader>

          <AccordionContent>
            <CardContent className="pt-4 space-y-4">
              {/* Description/What the money pays for */}
              <div className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </div>

              {/* Sources */}
              {sources.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    Sources
                  </h4>
                  <ul className="space-y-1.5">
                    {sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>{source.label}</span>
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
