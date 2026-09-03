'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatFCFA } from '@/lib/format'
import { Icon } from '../icon'
import { Money, PageHeader, StatBar } from '../shared'
import { Plus, Loader2 } from 'lucide-react'
import { AddGoalModal } from '../modals/add-goal-modal'

type Goal = {
  id: string
  name: string
  icon: string
  targetAmount: number
  currentAmount: number
  color: string
  deadline: string | null
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  async function fetchGoals() {
    try {
      const res = await fetch('/api/goals')
      if (!res.ok) throw new Error('Impossible de charger les objectifs')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Réponse serveur invalide')
      setGoals(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGoals() }, [])

  function daysRemaining(deadline: string | null) {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    return diff > 0 ? `${diff} jours restants` : 'Échéance dépassée'
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Objectifs"
        subtitle="Planifie tes projets et suis ta progression sans modifier le solde de tes comptes."
        action={
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-primary to-teal text-primary-foreground"
          >
            <Plus className="mr-2 size-4" />
            Nouvel objectif
          </Button>
        }
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-neon" />
        </div>
      ) : goals.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
          <p>Aucun objectif pour l'instant.</p>
          <Button variant="outline" onClick={() => setShowModal(true)}>
            Créer mon premier objectif
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => {
            const pct = g.targetAmount > 0
              ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
              : 0
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
                    {daysRemaining(g.deadline) && (
                      <p className="text-xs text-muted-foreground">{daysRemaining(g.deadline)}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <Money value={g.currentAmount} suffix={false} className="text-base font-extrabold" />
                      <span className="text-xs text-muted-foreground">/ {formatFCFA(g.targetAmount, false)}</span>
                    </div>
                    <StatBar percent={pct} color={g.color} />
                    <p className="text-[11px] text-muted-foreground">Progression suivie — aucun argent n'est déplacé automatiquement.</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {showModal && (
        <AddGoalModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchGoals() }}
        />
      )}
    </div>
  )
}