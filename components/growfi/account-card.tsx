import { Icon } from './icon'
import { Money } from './shared'

export type AccountRowData = {
  id: string
  name: string
  balance: number
  icon: string
  color: string
}

export function AccountRow({ account }: { account: AccountRowData }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3">
      <span
        className="flex size-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `color-mix(in srgb, ${account.color} 15%, transparent)`, color: account.color }}
      >
        <Icon name={account.icon} className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{account.name}</p>
        <Money value={account.balance} className="text-xs text-muted-foreground" suffix={false} />
      </div>
    </div>
  )
}
