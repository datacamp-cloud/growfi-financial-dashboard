import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Icon } from './icon'
import { Money } from './shared'

export type ApiTransaction = {
  id: string
  amount: number
  type: string
  category: string
  description: string
  note: string | null
  date: string
  source: string
  accountId: string
  goalId?: string | null
  relatedAccountId?: string | null
  account?: { name: string; icon: string | null }
  relatedAccount?: { name: string; icon: string | null } | null
  goal?: { name: string } | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

export function TransactionsTable({ items }: { items: ApiTransaction[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden sm:table-cell">Compte</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((t) => {
            const accountName = t.account?.name ?? 'Inconnu'
            const accountIcon = t.account?.icon ?? 'Wallet'
            const destination = t.goalId ? `Objectif : ${t.goal?.name ?? 'Objectif'}` : `Compte : ${t.relatedAccount?.name ?? 'destination'}`
            const isTransfer = t.type === 'transfer'
            const displayAmount = Math.abs(t.amount)

            return (
              <TableRow key={t.id} className="border-border/60">
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(t.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-muted-foreground"><Icon name={accountIcon} className="size-4" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{isTransfer ? `${accountName} → ${destination}` : accountName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{isTransfer ? `${accountName} → ${destination}` : accountName}</TableCell>
                <TableCell className="text-right"><Money value={displayAmount} colored={!isTransfer} signed={!isTransfer} className="text-sm font-semibold" suffix={false} /></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
