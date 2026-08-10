'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon, type IconName } from '@/components/growfi/icon'

const goalIcons: { name: IconName; label: string }[] = [
  { name: 'Target',        label: 'Objectif'    },
  { name: 'Plane',         label: 'Voyage'      },
  { name: 'House',         label: 'Immobilier'  },
  { name: 'Car',           label: 'Voiture'     },
  { name: 'Smartphone',    label: 'Téléphone'   },
  { name: 'Laptop',        label: 'Ordinateur'  },
  { name: 'GraduationCap', label: 'Études'      },
  { name: 'Trophy',        label: 'Réussite'    },
  { name: 'Dumbbell',      label: 'Sport'       },
  { name: 'Globe',         label: 'International'},
]

const colors = [
  '#4CAF50', '#00BFA5', '#FFD54F',
  '#FF5252', '#2196F3', '#9C27B0', '#FF9800',
]

export function AddGoalModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconName>('Target')
  const [targetAmount, setTargetAmount] = useState('')
  const [color, setColor] = useState('#4CAF50')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        icon,
        targetAmount: parseFloat(targetAmount),
        color,
        deadline: deadline || null,
      }),
    })

    setLoading(false)
    if (!res.ok) { setError('Une erreur est survenue.'); return }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-[#0C1810] p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Nouvel objectif</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nom de l'objectif</label>
            <Input
              placeholder="Ex: Voyage à Paris"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Icône</label>
            <div className="flex flex-wrap gap-2">
              {goalIcons.map((i) => (
                <button
                  key={i.name}
                  type="button"
                  onClick={() => setIcon(i.name)}
                  title={i.label}
                  className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                    icon === i.name
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon name={i.name} className="size-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Couleur</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-8 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Montant cible (FCFA)</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="500 000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              className="h-11 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date limite (optionnel)</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-11 font-mono"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-negative/20 bg-negative/10 px-3 py-2 text-xs text-negative">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-to-r from-primary to-teal font-semibold text-white"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Créer l'objectif"}
          </Button>
        </form>
      </div>
    </div>
  )
}