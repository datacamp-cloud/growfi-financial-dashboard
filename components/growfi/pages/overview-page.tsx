"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KpiCard, CircularProgress } from "../kpi-card"
import { SpendingEvolutionChart, ExpenseDonutChart } from "../overview-charts"
import { TransactionsTable } from "../transactions-table"
import { AccountRow } from "../account-card"
import { PageHeader } from "../shared"
import { formatFCFA } from "@/lib/format"
import { Loader2 } from "lucide-react"

type DashboardData = {
  user: { name: string; email: string }
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  accounts: any[]
  recentTransactions: any[]
  goals: any[]
}

export function OverviewPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="size-8 animate-spin text-neon" /></div>

  const firstName = data?.user?.name?.split(" ")[0] ?? "toi"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Bienvenue, ${firstName}`} subtitle="Voici l'évolution de tes finances ce mois-ci." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Solde total" value={formatFCFA(data?.totalBalance ?? 0)} icon="Wallet" trend={5.4} accent="neon" />
        <KpiCard label="Revenus du mois" value={formatFCFA(data?.monthlyIncome ?? 0)} icon="ArrowDownLeft" trend={3.1} accent="primary" />
        <KpiCard label="Dépenses du mois" value={formatFCFA(data?.monthlyExpenses ?? 0)} icon="ArrowUpRight" trend={-2.4} accent="negative" />
        <KpiCard label="Reste après dépenses" value={`${data?.savingsRate ?? 0}%`} icon="TrendingUp" accent="gold">
          <CircularProgress value={data?.savingsRate ?? 0} />
        </KpiCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-xl lg:col-span-2">
          <CardHeader><CardTitle>Revenus et dépenses</CardTitle></CardHeader>
          <CardContent><SpendingEvolutionChart /></CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardHeader><CardTitle>Répartition des dépenses</CardTitle></CardHeader>
          <CardContent><ExpenseDonutChart /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-xl lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Transactions récentes</CardTitle><Button variant="ghost" size="sm" onClick={() => router.push("/transactions")}>Voir tout</Button></CardHeader>
          <CardContent><TransactionsTable items={data?.recentTransactions ?? []} /></CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Comptes</CardTitle><Button variant="ghost" size="sm" onClick={() => router.push("/accounts")}>Gérer</Button></CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {data?.accounts?.length ? data.accounts.map((a: any) => <AccountRow key={a.id} account={a} />) : <p className="text-sm text-muted-foreground">Aucun compte pour l'instant.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
