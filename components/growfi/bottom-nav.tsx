'use client'

import type { ViewId } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Icon } from './icon'
import { mobileNavItems } from './nav-items'
import { Plus } from 'lucide-react'

export function BottomNav({
  active,
  onNavigate,
  onAdd,
}: {
  active: ViewId
  onNavigate: (id: ViewId) => void
  onAdd: () => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {mobileNavItems.map((item) => {
          if (item.id === 'add') {
            return (
              <li key="add">
                <button
                  type="button"
                  onClick={onAdd}
                  aria-label="Add transaction"
                  className="-mt-6 flex size-14 items-center justify-center rounded-full bg-neon text-[#0a1a0c] shadow-lg shadow-neon/30 transition-transform active:scale-95"
                >
                  <Plus className="size-7" strokeWidth={2.5} />
                </button>
              </li>
            )
          }
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.id as ViewId)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-16 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-neon' : 'text-muted-foreground',
                )}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
