import { AppShell } from "@/components/growfi/app-shell"
import { OverviewPage } from "@/components/growfi/pages/overview-page"

export default function Page() {
  return (
    <AppShell title="Overview" action={{ label: "Add transaction", icon: "plus" }}>
      <OverviewPage />
    </AppShell>
  )
}
