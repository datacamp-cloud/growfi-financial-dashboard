import { AppShell } from "@/components/growfi/app-shell"
import { GoalsPage } from "@/components/growfi/pages/goals-page"

export default function Page() {
  return (
    <AppShell title="Goals" action={{ label: "New goal", icon: "plus" }}>
      <GoalsPage />
    </AppShell>
  )
}
