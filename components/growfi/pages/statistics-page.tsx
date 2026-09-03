'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatFCFACompact, formatPercent } from '@/lib/format'
import { ChartTooltip, Money, PageHeader, StatBar } from '../shared'
import { TermTooltip } from '../term-tooltip'
import { Loader2 } from 'lucide-react'

type Period = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
type PeriodPoint = { label: string; income: number; expenses: number }
type CategoryStat = { name: string; spent: number; share: number; color: string }

const periodLabels: Record<Period, string> = { Daily: 'Jour', Weekly: 'Semaine', Monthly: 'Mois', Yearly: 'Année' }

export function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('Monthly')
  const [statsData, setStatsData] = useState<PeriodPoint[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/statistics?period=${period}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Erreur de chargement des statistiques')
        return response.json()
      })
      .then((data) => {
        setStatsData(data.statsData ?? [])
        setCategoryStats(data.categoryStats ?? [])
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Erreur de chargement des statistiques')
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [period])

  const totalIncome = statsData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = statsData.reduce((sum, item) => sum + item.expenses, 0)
  const netAmount = totalIncome - totalExpenses
  const netRate = totalIncome > 0 ? Math.round((netAmount / totalIncome) * 100) : 0

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="size-8 animate-spin text-neon" /></div>

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Statistiques" subtitle="Comprends où va ton argent et comment tes finances évoluent." action={<ToggleGroup type="single" value={[period] as string[]} onValueChange={(value) => { if (value?.length) setPeriod(value[0] as Period) }} className="rounded-xl border border-border bg-white/5 p-1">{(Object.keys(periodLabels) as Period[]).map((item) => <ToggleGroupItem key={item} value={item} className="rounded-lg px-3 text-xs data-[state=on]:bg-neon data-[state=on]:text-[#0a1a0c]">{periodLabels[item]}</ToggleGroupItem>)}</ToggleGroup>} />
      {error && <Card className="border-negative/20 bg-negative/5 backdrop-blur-xl"><CardContent className="pt-6"><p className="text-sm text-negative">{error}</p></CardContent></Card>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="backdrop-blur-xl"><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total revenus</p><Money value={totalIncome} className="mt-1 block text-lg font-extrabold text-neon" /></CardContent></Card>
        <Card className="backdrop-blur-xl"><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total dépenses</p><Money value={totalExpenses} className="mt-1 block text-lg font-extrabold text-negative" /></CardContent></Card>
        <Card className="backdrop-blur-xl"><CardContent className="pt-6"><p className="text-xs text-muted-foreground"><TermTooltip term="Reste après dépenses" definition="Ce qu’il reste après avoir soustrait tes dépenses de tes revenus sur la période sélectionnée. Ce montant peut ensuite être épargné, investi ou rester disponible." /></p><Money value={netAmount} className="mt-1 block text-lg font-extrabold" colored /><p className="mt-1 text-xs text-muted-foreground">{formatPercent(netRate, 0)} des revenus</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="backdrop-blur-xl"><CardHeader><CardTitle>Dépenses par période</CardTitle></CardHeader><CardContent><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={statsData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}><CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} /><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(value) => formatFCFACompact(value as number)} /><Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} /><Bar dataKey="expenses" name="Dépenses" fill="var(--neon)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="backdrop-blur-xl"><CardHeader><CardTitle>Revenus vs dépenses</CardTitle></CardHeader><CardContent><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={statsData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}><CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} /><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(value) => formatFCFACompact(value as number)} /><Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} /><Bar dataKey="income" name="Revenus" fill="var(--teal)" radius={[4, 4, 0, 0]} /><Bar dataKey="expenses" name="Dépenses" fill="var(--gold)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
      </div>
      <Card className="backdrop-blur-xl"><CardHeader><CardTitle>Dépenses par catégorie</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{categoryStats.length === 0 ? <p className="text-sm text-muted-foreground">Aucune dépense enregistrée ce mois-ci.</p> : categoryStats.map((category) => <div key={category.name} className="flex flex-col gap-1.5"><div className="flex items-center justify-between text-sm"><span className="font-medium">{category.name}</span><span className="text-muted-foreground"><Money value={category.spent} suffix={false} className="text-foreground" /> · {formatPercent(category.share, 0)}</span></div><StatBar percent={category.share} color={category.color} /><span className="text-xs text-muted-foreground">{formatPercent(category.share, 0)} de tes dépenses</span></div>)}</CardContent></Card>
    </div>
  )
}
