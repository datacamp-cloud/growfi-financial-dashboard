'use client'


import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { spendingEvolution, expenseBreakdown } from '@/lib/data'
import { formatFCFA, formatFCFACompact } from '@/lib/format'
import { ChartTooltip } from './shared'


const areaSeries = [
  { key: 'investment', color: 'var(--teal)' },
  { key: 'savings', color: 'var(--neon)' },
  { key: 'emergency', color: 'var(--primary)' },
  { key: 'entertainment', color: 'var(--gold)' },
]

export function SpendingEvolutionChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spendingEvolution} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {areaSeries.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={44}
            tickFormatter={(v) => formatFCFACompact(v as number)}
          />
          <Tooltip content={<ChartTooltip />} />
          {areaSeries.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ExpenseDonutChart() {
  const total = expenseBreakdown.reduce((s, c) => s + c.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseBreakdown}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={0}
            >
              {expenseBreakdown.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</span>
          <span className="font-mono text-sm font-bold">{formatFCFACompact(total)}</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {expenseBreakdown.map((c) => (
          <li key={c.name} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-muted-foreground">{c.name}</span>
            <span className="ml-auto font-mono text-xs font-semibold">{formatFCFA(c.value, false)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
