'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { computeProjection } from '@/lib/calculators'
import { formatFCFA, formatFCFACompact } from '@/lib/format'
import { MoneyField, RateField, SliderField, ResultStat } from '../calc-inputs'
import { ChartTooltip } from '../shared'
import { CircularProgress } from '../kpi-card'

const lines = [
  { key: 'income', color: 'var(--teal)' },
  { key: 'expenses', color: 'var(--negative)' },
  { key: 'savings', color: 'var(--gold)' },
  { key: 'netWorth', color: 'var(--neon)' },
]

export function ProjectionCalculator() {
  const [income, setIncome] = useState(1_450_000)
  const [expenses, setExpenses] = useState(842_500)
  const [savingsTarget, setSavingsTarget] = useState(25)
  const [incomeGrowth, setIncomeGrowth] = useState(6)
  const [returnRate, setReturnRate] = useState(9)
  const [years, setYears] = useState(15)

  const result = useMemo(
    () =>
      computeProjection({
        monthlyIncome: income,
        monthlyExpenses: expenses,
        savingsTargetPct: savingsTarget,
        incomeGrowthPct: incomeGrowth,
        returnPct: returnRate,
        years,
      }),
    [income, expenses, savingsTarget, incomeGrowth, returnRate, years],
  )

  const label =
    result.yearsToFi !== null
      ? `Tu peux indépendant financièrement dans ${result.yearsToFi} ans`
      : `Continue ainsi — independance projetée au-dela de ${years} years`

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card className="h-fit backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Ta situation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <MoneyField label="Revenu Mensuel Actuel" value={income} onChange={setIncome} />
          <MoneyField label="Dépenses Mensuelles Actuelles" value={expenses} onChange={setExpenses} />
          <SliderField label="Objectif d'Epargne Mensuelle" value={savingsTarget} onChange={setSavingsTarget} min={0} max={80} unit="%" />
          <RateField label="Croissance Annuelle Attendue du Revenu" value={incomeGrowth} onChange={setIncomeGrowth} />
          <RateField label="Taux de Retour sur Investissement" value={returnRate} onChange={setReturnRate} />
          <SliderField label="Projection horizon" value={years} onChange={setYears} min={1} max={40} unit="yrs" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
          <Card className="backdrop-blur-xl">
            <CardContent className="flex h-full flex-col justify-center gap-2">
              <ResultStat label={`Valeur nette projetée dans ${years} ans`} value={formatFCFA(result.finalNetWorth)} accent="neon" large />
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl">
            <CardContent className="flex items-center gap-4">
              <div className="relative">
                <CircularProgress value={result.fiScore} size={72} stroke={7} />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold">
                  {result.fiScore}
                </span>
              </div>
              <div className="max-w-44">
                <p className="text-xs font-medium text-muted-foreground">Financial independence score</p>
                <p className="mt-1 text-sm font-semibold text-pretty">{label}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(v) => formatFCFACompact(v as number)} />
                  <Tooltip content={<ChartTooltip />} />
                  {lines.map((l) => (
                    <Line key={l.key} type="monotone" dataKey={l.key} name={l.key} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {lines.map((l) => (
                <span key={l.key} className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.key === 'netWorth' ? 'net worth' : l.key}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Year-by-year projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Revenu</TableHead>
                    <TableHead className="text-right">Depenses</TableHead>
                    <TableHead className="text-right">Epargnes</TableHead>
                    <TableHead className="text-right">Valeur nette</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row) => (
                    <TableRow key={row.year} className="border-border/60">
                      <TableCell className="text-sm">Year {row.year}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-teal">{formatFCFA(row.income, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-negative">{formatFCFA(row.expenses, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-gold">{formatFCFA(row.savings, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-neon">{formatFCFA(row.netWorth, false)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
