import { AppShell } from "@/components/growfi/app-shell"
import { TransactionsPage } from "@/components/growfi/pages/transactions-page"

export default function Page() {
  return (
    <AppShell title="Transactions" action={{ label: "Add transaction", icon: "plus" }}>
      <TransactionsPage />
    </AppShell>
  )
}
