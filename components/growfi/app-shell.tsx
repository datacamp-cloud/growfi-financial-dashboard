"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/growfi/sidebar"
import { BottomNav } from "@/components/growfi/bottom-nav"
import { Topbar } from "@/components/growfi/topbar"
import type { IconName } from "@/components/growfi/icon"


export function AppShell({
  title,
  action,
  onAdd,
  children,
}: {
  title: string
  action?: { label: string; icon?: IconName }
  onAdd?: () => void
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar title={title} action={action} />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
      <BottomNav onAdd={onAdd} />
    </div>
  )
}