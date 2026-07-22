import { cn } from '@/lib/utils'
import { formatFCFA } from '@/lib/format'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

/** Monospace, color-coded money figure. */
export function Money({
  value,
  className,
  colored = false,
  signed = false,
  suffix = true,
}: {
  value: number
  className?: string
  colored?: boolean
  signed?: boolean
  suffix?: boolean
}) {
  const display = signed && value > 0 ? `+${formatFCFA(value, suffix)}` : formatFCFA(value, suffix)
  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        colored && (value >= 0 ? 'text-neon' : 'text-negative'),
        className,
      )}
    >
      {display}
    </span>
  )
}

/** Small trend pill: green up / red down. */
export function TrendBadge({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
        positive ? 'bg-neon/10 text-neon' : 'bg-negative/10 text-negative',
        className,
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {Math.abs(value).toFixed(1).replace('.', ',')}%
    </span>
  )
}

/** Themed, variable-color, variable-thickness progress bar. */
export function StatBar({
  percent,
  color = 'var(--neon)',
  thickness = 6,
  className,
}: {
  percent: number
  color?: string
  thickness?: number
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-white/10', className)}
      style={{ height: thickness }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Shared Recharts tooltip that renders FCFA values. */
export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-xl backdrop-blur-xl">
      {label && <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-mono font-semibold text-foreground">
              {formatFCFA(entry.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
