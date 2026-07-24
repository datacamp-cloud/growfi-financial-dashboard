'use client'

import { useMemo, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { computeAmortization } from '@/lib/calculators'
import { formatFCFA, formatFCFACompact } from '@/lib/format'
import { MoneyField, RateField, SliderField, ResultStat } from '../calc-inputs'
import { ChartTooltip } from '../shared'
import { TermTooltip } from '../term-tooltip'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'

const PAGE_SIZE = 12

export function DebtCalculator() {
  const [loan, setLoan] = useState(5_000_000)
  const [rate, setRate] = useState(12)
  const [months, setMonths] = useState(36)
  const [start, setStart] = useState('2026-08-01')
  const [page, setPage] = useState(0)

  const result = useMemo(
    () => computeAmortization({ loan, annualRate: rate, months }),
    [loan, rate, months],
  )

  const pageCount = Math.ceil(result.schedule.length / PAGE_SIZE)
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = result.schedule.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const chartData = useMemo(() => {
    const stepSize = Math.max(1, Math.round(result.schedule.length / 24))
    return result.schedule.filter((_, i) => i % stepSize === 0)
  }, [result.schedule])

  function download() {
    const header = 'Mois,Paiement,Principal,Intérêt,Solde\n'
    const body = result.schedule
      .map((r) => `${r.month},${r.payment},${r.principal},${r.interest},${r.balance}`)
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'growfi-amortissement.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function monthLabel(monthIndex: number) {
    const d = new Date(start)
    d.setMonth(d.getMonth() + monthIndex - 1)
    return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
      <Card className="h-fit backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Détails du prêt</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <MoneyField label="Montant emprunté" value={loan} onChange={setLoan} />
          <RateField
            label={
              <TermTooltip
                term="Taux d'intérêt annuel"
                definition="Le coût annuel de ton prêt exprimé en pourcentage. Un taux de 12% signifie que tu paies 12% du montant restant dû chaque année en intérêts."
              />
            }
            value={rate}
            onChange={setRate}
          />
          <SliderField label="Durée (mois)" value={months} onChange={setMonths} min={6} max={120} step={6} unit="mois" />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Date de début</span>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-10 font-mono" />
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="backdrop-blur-xl">
          <CardContent className="flex flex-col gap-5">
            <ResultStat label="Mensualité" value={formatFCFA(result.payment)} accent="neon" large />
            <div className="grid grid-cols-2 gap-4">
              <ResultStat label="Total remboursé" value={formatFCFA(result.totalRepaid)} />
              <ResultStat label="Total intérêts payés" value={formatFCFA(result.totalInterest)} accent="negative" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              <TermTooltip
                term="Principal vs Intérêts"
                definition="Chaque mensualité est composée de deux parties : le principal (ce qui réduit ta dette) et les intérêts (le coût du prêt). Au début, tu paies surtout des intérêts. À la fin, tu rembourses surtout le principal."
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `M${v}`} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(v) => formatFCFACompact(v as number)} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
                  <Bar dataKey="principal" name="Principal" stackId="a" fill="var(--teal)" />
                  <Bar dataKey="interest" name="Intérêts" stackId="a" fill="var(--negative)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              <TermTooltip
                term="Tableau d'amortissement"
                definition="Le détail mois par mois de ton remboursement : combien tu paies, quelle part réduit ta dette, quelle part correspond aux intérêts, et ce qu'il te reste à rembourser."
              />
            </CardTitle>
            <Button variant="outline" size="sm" onClick={download}>
              <Download data-icon="inline-start" />
              CSV
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Mensualité</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Intérêts</TableHead>
                    <TableHead className="text-right">Solde restant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((row) => (
                    <TableRow key={row.month} className="border-border/60">
                      <TableCell className="whitespace-nowrap text-xs">
                        <span className="font-medium">{row.month}</span>{' '}
                        <span className="text-muted-foreground">{monthLabel(row.month)}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatFCFA(row.payment, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-teal">{formatFCFA(row.principal, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-negative">{formatFCFA(row.interest, false)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">{formatFCFA(row.balance, false)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Page {safePage + 1} sur {pageCount}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon-sm" disabled={safePage === 0} onClick={() => setPage(safePage - 1)} aria-label="Page précédente">
                  <ChevronLeft />
                </Button>
                <Button variant="outline" size="icon-sm" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} aria-label="Page suivante">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}