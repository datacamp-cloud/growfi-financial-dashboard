"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  accounts,
  monthlyExpenses,
  monthlyIncome,
  savingsRate,
  totalBalance,
  transactions,
} from '@/lib/data'
import { formatFCFA } from '@/lib/format'
import { KpiCard, CircularProgress } from '../kpi-card'
import { SpendingEvolutionChart, ExpenseDonutChart } from '../overview-charts'
import { TransactionsTable } from '../transactions-table'
import { AccountRow } from '../account-card'
import { PageHeader } from '../shared'

export function OverviewPage({ onNavigate }: { onNavigate: (id: 'transactions' | 'accounts') => void }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Welcome back, Amara"
        subtitle="Here's how your money is growing this month."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Balance" value={formatFCFA(totalBalance)} icon="Wallet" trend={5.4} accent="neon" />
        <KpiCard label="Monthly Income" value={formatFCFA(monthlyIncome)} icon="ArrowDownLeft" trend={3.1} accent="primary" />
        <KpiCard label="Monthly Expenses" value={formatFCFA(monthlyExpenses)} icon="ArrowUpRight" trend={-2.4} accent="negative" />
        <KpiCard label="Savings Rate" value={`${savingsRate}%`} icon="TrendingUp" accent="gold">
          <CircularProgress value={savingsRate} />
        </KpiCard>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Evolution</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingEvolutionChart />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* Transactions + accounts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-xl lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('transactions')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <TransactionsTable items={transactions.slice(0, 6)} />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Accounts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('accounts')}>
              Manage
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {accounts.map((a) => (
              <AccountRow key={a.id} account={a} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
