"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/growfi/sidebar"
import { BottomNav } from "@/components/growfi/bottom-nav"
import { Topbar } from "@/components/growfi/topbar"
import type { IconName } from "@/components/growfi/icon"
import { AddTransactionModal } from "@/components/growfi/modals/add-transaction-modal"

export function AppShell({
  title,
  action,
  children,
}: {
  title: string
  action?: { label: string; icon?: IconName }
  children: ReactNode
}) {

  const [showAddModal, setShowModal] =  useState(false)

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar 
            title={title} 
            action={action}
            onAdd={() => setShowModal(true)}
        />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
      <BottomNav onAdd={() => setShowModal(true)} />
        {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  )
}