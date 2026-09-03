'use client'

import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatFCFA, formatFCFACompact } from '@/lib/format'
import { ChartTooltip } from './shared'

type Stats = {
  statsData: { label: string; income: number; expenses: number }[]
  categoryStats: { name: string; spent: number; budget: number; color: string }[]
}

export function SpendingEvolutionChart() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/statistics?period=Monthly').then((r) => r.json()).then(setStats).catch(() => setStats(null))
  }, [])

  const data = stats?.statsData ?? []

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(v) => formatFCFACompact(v as number)} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="income" name="Revenus" stroke="var(--neon)" fill="var(--neon)" fillOpacity={0.12} strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="var(--negative)" fill="var(--negative)" fillOpacity={0.08} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ExpenseDonutChart() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/statistics?period=Monthly').then((r) => r.json()).then(setStats).catch(() => setStats(null))
  }, [])

  const expenseBreakdown = useMemo(() => stats?.categoryStats?.filter((c) => c.spent > 0) ?? [], [stats])
  const total = expenseBreakdown.reduce((sum, c) => sum + c.spent, 0)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={expenseBreakdown} dataKey="spent" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2} strokeWidth={0}>
              {expenseBreakdown.map((c) => <Cell key={c.name} fill={c.color} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Dépenses</span>
          <span className="font-mono text-sm font-bold">{formatFCFACompact(total)}</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {expenseBreakdown.slice(0, 6).map((c) => (
          <li key={c.name} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-muted-foreground">{c.name}</span>
            <span className="ml-auto font-mono text-xs font-semibold">{formatFCFA(c.spent, false)}</span>
          </li>
        ))}
        {expenseBreakdown.length === 0 && <li className="text-sm text-muted-foreground">Aucune dépense ce mois-ci.</li>}
      </ul>
    </div>
  )
}
