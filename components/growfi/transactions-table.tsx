import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icon } from './icon'
import { Money } from './shared'

// 1. Déclaration du type local calqué sur le retour de votre API Prisma
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
  account?: {
    name: string
    icon: string | null
  }
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
            // Extraction sécurisée des données de la relation compte de Prisma
            const accountName = t.account?.name ?? 'Inconnu'
            const accountIcon = (t.account?.icon as any) ?? 'Wallet' // 'Wallet' ou autre icône par défaut si null

            return (
              <TableRow key={t.id} className="border-border/60">
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                      <Icon name={accountIcon} className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{accountName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {accountName}
                </TableCell>
                <TableCell className="text-right">
                  <Money 
                    value={t.amount} 
                    colored 
                    signed 
                    className="text-sm font-semibold" 
                    suffix={false} 
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
