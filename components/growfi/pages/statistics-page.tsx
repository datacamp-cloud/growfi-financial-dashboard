'use client'

import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { statsData, categoryStats } from '@/lib/data'
import { formatFCFA, formatFCFACompact, formatPercent } from '@/lib/format'
import { ChartTooltip, Money, PageHeader, StatBar } from '../shared'

type Period = keyof typeof statsData

export function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('Monthly')
  const data = statsData[period]

  // highlight the last (current) period bar
  const activeIndex = data.length - 1
  const totalIncome = data.reduce((s, d) => s + d.income, 0)
  const totalExpenses = data.reduce((s, d) => s + d.expenses, 0)
  const net = totalIncome - totalExpenses

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Statistics"
        subtitle="Analyse your cash flow across different periods."
        action={
          <ToggleGroup
            value={[period]}
            onValueChange={(v) => v[0] && setPeriod(v[0] as Period)}
            spacing={2}
            className="rounded-xl border border-border bg-white/3 p-1"
          >
            {(Object.keys(statsData) as Period[]).map((p) => (
              <ToggleGroupItem
                key={p}
                value={p}
                className="rounded-lg px-3 text-xs aria-pressed:bg-neon aria-pressed:text-[#0a1a0c] data-[state=on]:bg-neon data-[state=on]:text-[#0a1a0c]"
              >
                {p}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Income</p>
            <Money value={totalIncome} className="mt-1 block text-lg font-extrabold text-neon" />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Expenses</p>
            <Money value={totalExpenses} className="mt-1 block text-lg font-extrabold text-negative" />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Net Savings</p>
            <Money value={net} className="mt-1 block text-lg font-extrabold" colored />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Expenses by {period.slice(0, -2) || period}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={44}
                    tickFormatter={(v) => formatFCFACompact(v as number)}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
                  <Bar dataKey="expenses" radius={[6, 6, 0, 0]}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={i === activeIndex ? 'var(--neon)' : '#1C2B1E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={44}
                    tickFormatter={(v) => formatFCFACompact(v as number)}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
                  <Bar dataKey="income" fill="var(--teal)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {categoryStats.map((c) => {
            const pct = (c.spent / c.budget) * 100
            const over = c.spent > c.budget
            return (
              <div key={c.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    <Money value={c.spent} suffix={false} className="text-foreground" /> / {formatFCFA(c.budget, false)}
                  </span>
                </div>
                <StatBar percent={pct} color={over ? 'var(--negative)' : c.color} />
                <span className={over ? 'text-xs text-negative' : 'text-xs text-muted-foreground'}>
                  {formatPercent(pct, 0)} of budget{over ? ' — over budget' : ''}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
