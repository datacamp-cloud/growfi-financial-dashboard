'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { accounts, transactions } from '@/lib/data'
import { TransactionsTable } from '../transactions-table'
import { Money, PageHeader } from '../shared'
import { Search } from 'lucide-react'

export function TransactionsPage() {
  const [query, setQuery] = useState('')
  const [account, setAccount] = useState('all')

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const matchesQuery = t.description.toLowerCase().includes(query.toLowerCase())
        const matchesAccount = account === 'all' || t.account === account
        return matchesQuery && matchesAccount
      }),
    [query, account],
  )

  const inflow = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const outflow = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Transactions" subtitle="Every movement across your accounts." />

      <div className="grid grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Total inflow</p>
            <Money value={inflow} className="mt-1 block text-lg font-extrabold text-neon" suffix={false} />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Total outflow</p>
            <Money value={outflow} className="mt-1 block text-lg font-extrabold text-negative" suffix={false} />
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="h-10 w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All accounts</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {filtered.length > 0 ? (
            <TransactionsTable items={filtered} />
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
                <Search className="size-6" />
              </span>
              <p className="text-sm font-medium">No transactions found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
