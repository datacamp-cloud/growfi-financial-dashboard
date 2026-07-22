import { AppShell } from "@/components/growfi/app-shell"
import { AccountsPage } from "@/components/growfi/pages/accounts-page"

export default function Page() {
  return (
    <AppShell title="Accounts" action={{ label: "Link account", icon: "plus" }}>
      <AccountsPage />
    </AppShell>
  )
}
