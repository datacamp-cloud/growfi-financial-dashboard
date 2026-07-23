'use client'

import { Card, CardContent } from '@/components/ui/card'
import { accounts, totalBalance } from '@/lib/data'
import { formatFCFA } from '@/lib/format'
import { Icon } from '../icon'
import { Money, PageHeader, StatBar, TrendBadge } from '../shared'

export function AccountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Comptes" 
        subtitle="Tous tes comptes en un endroit" 
      />

      <Card className="overflow-hidden border-0 bg-linear-to-br from-primary/20 via-card to-teal/10 backdrop-blur-xl ring-1 ring-neon/20">
        <CardContent className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Total net</span>
          <Money value={totalBalance} className="text-3xl font-extrabold sm:text-4xl" />
          <div className="mt-2">
            <TrendBadge value={5.4} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {accounts.map((a) => {
          const share = Math.round((a.balance / totalBalance) * 100)
          return (
            <Card key={a.id} className="backdrop-blur-xl">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${a.color} 15%, transparent)`,
                      color: a.color,
                    }}
                  >
                    <Icon name={a.icon} className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{share}% du total</p>
                  </div>
                  <TrendBadge value={a.trend} />
                </div>
                <Money value={a.balance} className="text-xl font-extrabold" suffix={false} />
                <StatBar percent={share} color={a.color} />
                <p className="text-xs text-muted-foreground">Represente {formatFCFA(a.balance)}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
