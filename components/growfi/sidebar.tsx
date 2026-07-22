'use client'

import type { ViewId } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Icon } from './icon'
import { Logo } from './logo'
import { navItems } from './nav-items'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Sidebar({
  active,
  onNavigate,
}: {
  active: ViewId
  onNavigate: (id: ViewId) => void
}) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-neon'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-neon" />
              )}
              <Icon name={item.icon} className="size-5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/[0.03] p-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/20 text-sm font-semibold text-neon">
            AK
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Amara Koné</p>
          <p className="truncate text-xs text-muted-foreground">Premium member</p>
        </div>
      </div>
    </aside>
  )
}
