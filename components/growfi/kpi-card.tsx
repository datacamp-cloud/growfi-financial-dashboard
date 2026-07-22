import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Icon } from './icon'
import { TrendBadge } from './shared'

export function KpiCard({
  label,
  value,
  icon,
  trend,
  accent = 'neon',
  children,
}: {
  label: string
  value: string
  icon: string
  trend?: number
  accent?: 'neon' | 'primary' | 'negative' | 'gold'
  children?: React.ReactNode
}) {
  const accentColor = {
    neon: 'text-neon',
    primary: 'text-primary',
    negative: 'text-negative',
    gold: 'text-gold',
  }[accent]
  const accentBg = {
    neon: 'bg-neon/10',
    primary: 'bg-primary/15',
    negative: 'bg-negative/10',
    gold: 'bg-gold/10',
  }[accent]

  return (
    <Card className="backdrop-blur-xl">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={cn('flex size-9 items-center justify-center rounded-xl', accentBg, accentColor)}>
            <Icon name={icon} className="size-5" />
          </span>
          {trend !== undefined && <TrendBadge value={trend} />}
          {children}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-mono text-xl font-extrabold tracking-tight tabular-nums sm:text-2xl">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/** Small circular progress ring for savings rate. */
export function CircularProgress({
  value,
  size = 44,
  stroke = 5,
}: {
  value: number
  size?: number
  stroke?: number
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, value) / 100) * circumference
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--neon)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  )
}
