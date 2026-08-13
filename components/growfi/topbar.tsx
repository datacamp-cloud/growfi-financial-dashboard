"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Icon, type IconName } from "@/components/growfi/icon"
import { Logo } from "@/components/growfi/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar({ title, action, onAdd }: { title: string; action?: { label: string; icon?: IconName }; onAdd: () => void }) {
  const { data: session } = useSession()
  const name = session?.user?.name ?? ""
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="md:hidden" aria-label="GrowFi home">
          <Logo showText={false} />
        </Link>
        <div>
          <h1 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
          <p className="hidden text-sm text-muted-foreground md:block">
            Bienvenue — faisons grandir ton patrimoine
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action && (
          <button
            type="button"
            onClick={onAdd}
            className="hidden items-center gap-2 rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-[#0a1a0c] transition hover:brightness-110 sm:inline-flex"
          >
            {action.icon ? <Icon name={action.icon} className="size-4" /> : null}
            {action.label}
          </button>
        )}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-border/60 bg-card/50 text-muted-foreground transition hover:text-foreground"
        >
          <Icon name="bell" className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-neon" />
        </button>
        <Avatar className="size-10 border border-border/60">
          <AvatarFallback className="bg-primary/20 text-sm font-semibold text-neon">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}