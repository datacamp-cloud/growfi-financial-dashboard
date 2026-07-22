'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { goals } from '@/lib/data'
import { formatFCFA } from '@/lib/format'
import { Icon } from '../icon'
import { Money, PageHeader, StatBar } from '../shared'
import { Plus } from 'lucide-react'

export function GoalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Goals"
        subtitle="Track your savings targets and stay motivated."
        action={
          <Button className="bg-gradient-to-r from-primary to-teal text-primary-foreground">
            <Plus data-icon="inline-start" />
            Add New Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100)
          return (
            <Card key={g.id} className="backdrop-blur-xl">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${g.color} 15%, transparent)`,
                      color: g.color,
                    }}
                  >
                    <Icon name={g.icon} className="size-5" />
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${g.color} 15%, transparent)`,
                      color: g.color,
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">{g.name}</h3>
                  <p className="text-xs text-muted-foreground">{g.daysRemaining} days remaining</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <Money value={g.current} suffix={false} className="text-base font-extrabold" />
                    <span className="text-xs text-muted-foreground">/ {formatFCFA(g.target, false)}</span>
                  </div>
                  <StatBar percent={pct} color={g.color} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
