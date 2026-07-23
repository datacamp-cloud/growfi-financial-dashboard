"use client"

import { useState } from "react"
import { AppShell } from "@/components/growfi/app-shell"
import { OverviewPage } from "@/components/growfi/pages/overview-page"
import type { ViewId } from "@/lib/data"

export default function Page() {
  const [activePage, setActivePage] = useState<ViewId>("overview")

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage onNavigate={(id) => setActivePage(id as ViewId)} />
      // Décommente au fur et à mesure que les pages sont générées
      // case "transactions":
      //   return <TransactionsPage />
      // case "accounts":
      //   return <AccountsPage />
      // case "statistics":
      //   return <StatisticsPage />
      // case "goals":
      //   return <GoalsPage />
      // case "calculators":
      //   return <CalculatorsPage />
      // case "profile":
      //   return <ProfilePage />
      default:
        return <OverviewPage onNavigate={(id) => setActivePage(id as ViewId)} />
    }
  }

  return (
    <AppShell
      onAdd={() => console.log("Add transaction")}
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
      action={{ label: "Add transaction", icon: "plus" }}
    >
      {renderPage()}
    </AppShell>
  )
}