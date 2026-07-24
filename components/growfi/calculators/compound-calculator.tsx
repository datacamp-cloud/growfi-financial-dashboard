'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { computeCompound, type CompoundFreq } from '@/lib/calculators'
import { formatFCFA, formatFCFACompact } from '@/lib/format'
import { MoneyField, RateField, SliderField, ResultStat } from '../calc-inputs'
import { ChartTooltip } from '../shared'
import { TermTooltip } from '../term-tooltip'

export function CompoundCalculator() {
  const [initial, setInitial] = useState(500_000)
  const [monthly, setMonthly] = useState(75_000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(10)
  const [freq, setFreq] = useState<CompoundFreq>('monthly')

  const result = useMemo(
    () => computeCompound({ initial, monthly, annualRate: rate, years, freq }),
    [initial, monthly, rate, years, freq],
  )

  const contribShare =
    result.final > 0 ? Math.round((result.contributed / result.final) * 100) : 0

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* Inputs */}
      <Card className="h-fit backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <MoneyField
            label={
              <TermTooltip
                term="Capital Initial"
                definition="La somme d'argent que tu places au départ. Plus ce montant est élevé, plus ton investissement croît rapidement."
              />
            }
            value={initial}
            onChange={setInitial}
          />
          <MoneyField
            label={
              <TermTooltip
                term="Contribution Mensuelle"
                definition="Le montant que tu ajoutes à ton investissement chaque mois. Des versements réguliers, même modestes, font une grande différence sur le long terme."
              />
            }
            value={monthly}
            onChange={setMonthly}
          />
          <RateField
            label={
              <TermTooltip
                term="Taux d'Intérêt Annuel"
                definition="Le pourcentage que ton placement rapporte chaque année. Par exemple, 8% signifie que 100 000 FCFA placés rapportent 8 000 FCFA en un an."
              />
            }
            value={rate}
            onChange={setRate}
          />
          <SliderField label="Durée (années)" value={years} onChange={setYears} min={1} max={30} unit="ans" />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              <TermTooltip
                term="Fréquence de Capitalisation"
                definition="La fréquence à laquelle les intérêts sont ajoutés à ton capital. Plus c'est fréquent, plus ton argent croît vite — c'est la magie des intérêts composés."
              />
            </span>
            <Select value={freq} onValueChange={(v) => setFreq(v as CompoundFreq)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                  <SelectItem value="quarterly">Trimestrielle</SelectItem>
                  <SelectItem value="annually">Annuelle</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <Card className="backdrop-blur-xl">
          <CardContent className="flex flex-col gap-5">
            <ResultStat label="Capital final" value={formatFCFA(result.final)} accent="neon" large />

            <div className="flex flex-col gap-2">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div className="bg-white/25" style={{ width: `${contribShare}%` }} />
                <div className="bg-neon" style={{ width: `${100 - contribShare}%` }} />
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/25" />
                  Montant versé{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {formatFCFA(result.contributed, false)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-neon" />
                  Intérêts générés{' '}
                  <span className="font-mono font-semibold text-neon">
                    {formatFCFA(result.interest, false)}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Croissance dans le temps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-interest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `An ${v}`} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} tickFormatter={(v) => formatFCFACompact(v as number)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="contributed" name="Versé" stackId="1" stroke="#4b5f4e" fill="#1c2b1e" strokeWidth={2} />
                  <Area type="monotone" dataKey="interest" name="Intérêts" stackId="1" stroke="var(--neon)" fill="url(#grad-interest)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Détail année par année</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Année</TableHead>
                    <TableHead className="text-right">Montant versé</TableHead>
                    <TableHead className="text-right">Intérêts</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row) => (
                    <TableRow key={row.year} className="border-border/60">
                      <TableCell className="text-sm">Année {row.year}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatFCFA(row.contributed, false)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-neon">
                        {formatFCFA(row.interest, false)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold">
                        {formatFCFA(row.balance, false)}
                      </TableCell>
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
