'use client'

import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function TermTooltip({
  term,
  definition,
  className,
}: {
  term: string
  definition: string
  className?: string
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex cursor-help items-center gap-1 border-b border-dashed border-muted-foreground/50 text-foreground',
              className,
            )}
          >
            {term}
            <HelpCircle className="size-3 shrink-0 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-60 rounded-xl border border-border bg-popover/95 p-3 text-xs leading-relaxed shadow-xl backdrop-blur-xl"
        >
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}