'use client'

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatFCFA, formatFCFACompact, formatPercent } from '@/lib/format'
import { ChartTooltip, Money, PageHeader, StatBar } from '../shared'
import { TermTooltip } from '../term-tooltip'
import { Loader2 } from 'lucide-react'

type Period = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

type PeriodPoint = {
  label: string
  income: number
  expenses: number
}

type CategoryStat = {
  name: string
  spent: number
  budget: number
  color: string
}

const periodLabels: Record<Period, string> = {
  Daily: 'Jour',
  Weekly: 'Semaine',
  Monthly: 'Mois',
  Yearly: 'Année',
}

export function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('Monthly')
  const [statsData, setStatsData] = useState<PeriodPoint[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Ajout de l'état d'erreur

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/statistics?period=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error('Erreur de chargement des statistiques')
        return r.json()
      })
      .then((d) => {
        // Adaptation selon le format réel de votre API
        setStatsData(d.statsData ?? d.periods?.[period] ?? [])
        setCategoryStats(d.categoryStats ?? d.categories ?? [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [period])

  // Calculs dynamiques basés sur les données chargées
  const totalIncome = statsData.reduce((s, d) => s + d.income, 0)
  const totalExpenses = statsData.reduce((s, d) => s + d.expenses, 0)

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="size-8 animate-spin text-neon" />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Statistiques"
        subtitle="Analyse ton flux de trésorerie selon plusieurs périodes"
        action={
          <ToggleGroup
            type="single" // Ajout de type="single" obligatoire pour ToggleGroup
            value={[period] as string[]}
            onValueChange={(value) => 
                if (value && value.length > 0) {
                setPeriod(value[0] as Period)
              }
            }
            className="rounded-xl border border-border bg-white/5 p-1"
          >
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <ToggleGroupItem
                key={p}
                value={p}
                className="rounded-lg px-3 text-xs aria-pressed:bg-neon aria-pressed:text-[#0a1a0c] data-[state=on]:bg-neon data-[state=on]:text-[#0a1a0c]"
              >
                {periodLabels[p] ?? p}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      {error ? (
        <Card className="backdrop-blur-xl border-negative/20 bg-negative/5">
          <CardContent className="pt-6">
            <p className="text-sm text-negative">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total revenus</p>
            <Money value={totalIncome} className="mt-1 block text-lg font-extrabold text-neon" />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total dépenses</p>
            <Money value={totalExpenses} className="mt-1 block text-lg font-extrabold text-negative" />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">
              <TermTooltip
                term="Épargne nette"
                definition="La différence entre ce que tu gagnes et ce que tu dépenses sur la période. C'est l'argent qui reste disponible pour épargner ou investir."
              />
            </p>
            <Money value={totalIncome - totalExpenses} className="mt-1 block text-lg font-extrabold" colored />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Dépenses par période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={44}
                    tickFormatter={(value) => formatFCFACompact(value as number)}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
                  <Bar dataKey="expenses" name="Dépenses" fill="var(--neon)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Revenus vs Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={44}
                    tickFormatter={(value) => formatFCFACompact(value as number)}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
                  <Bar dataKey="income" name="Revenus" fill="var(--teal)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Dépenses" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Répartition par catégorie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {categoryStats.map((category) => {
            const pct = category.budget > 0 ? (category.spent / category.budget) * 100 : 0
            const over = category.spent > category.budget
            return (
              <div key={category.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    <Money value={category.spent} suffix={false} className="text-foreground" /> / {formatFCFA(category.budget, false)}
                  </span>
                </div>
                <StatBar percent={pct} color={over ? 'var(--negative)' : category.color} />
                <span className={over ? 'text-xs text-negative' : 'text-xs text-muted-foreground'}>
                  {formatPercent(pct, 0)} du budget{over ? ' — budget dépassé ⚠️' : ''}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
