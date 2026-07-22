import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Transaction } from '@/lib/data'
import { Icon } from './icon'
import { Money } from './shared'
import { cn } from '@/lib/utils'

const statusVariant: Record<Transaction['status'], { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-neon/10 text-neon' },
  pending: { label: 'Pending', className: 'bg-gold/10 text-gold' },
  failed: { label: 'Failed', className: 'bg-negative/10 text-negative' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export function TransactionsTable({ items }: { items: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden sm:table-cell">Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="hidden text-right md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id} className="border-border/60">
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(t.date)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                    <Icon name={t.icon} className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{t.account}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                {t.account}
              </TableCell>
              <TableCell className="text-right">
                <Money value={t.amount} colored signed className="text-sm font-semibold" suffix={false} />
              </TableCell>
              <TableCell className="hidden text-right md:table-cell">
                <Badge className={cn('rounded-full', statusVariant[t.status].className)}>
                  {statusVariant[t.status].label}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
