#!/bin/bash
set -e

echo "→ components/growfi/pages/goals-page.tsx"
mkdir -p "$(dirname "components/growfi/pages/goals-page.tsx")"
cat > 'components/growfi/pages/goals-page.tsx' << 'EOF_COMPONENTS_GROWFI_PAGES_GOALS_PAGE_TSX'
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
    const res = await fetch('/api/goals')
    const data = await res.json()
    setGoals(data)
    setLoading(false)
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
        subtitle="Suivez vos objectifs d'épargne et restez motivé."
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
                      className="flex size-11 items-center justify-center rounded-xl text-xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${g.color} 15%, transparent)` }}
                    >
                      {g.icon}
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

EOF_COMPONENTS_GROWFI_PAGES_GOALS_PAGE_TSX

echo "→ components/growfi/pages/profile-page.tsx"
mkdir -p "$(dirname "components/growfi/pages/profile-page.tsx")"
cat > 'components/growfi/pages/profile-page.tsx' << 'EOF_COMPONENTS_GROWFI_PAGES_PROFILE_PAGE_TSX'
'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '../shared'
import { TermTooltip } from '../term-tooltip'
import { Bell, CreditCard, Globe, Lock, LogOut, Moon, ShieldCheck } from 'lucide-react'

const settings = [
  { icon: Bell,       label: 'Notifications',      desc: 'Alertes push, email et dépassements de budget' },
  { icon: Lock,       label: 'Sécurité',            desc: 'Mot de passe, double authentification et appareils' },
  { icon: Globe,      label: 'Langue & région',     desc: 'Français · FCFA (XOF)' },
  { icon: CreditCard, label: 'Moyens de paiement',  desc: 'Wave, Orange Money, cartes bancaires' },
  { icon: Moon,       label: 'Apparence',           desc: 'Thème sombre' },
]

export function ProfilePage() {
  const { data: session } = useSession()
  const [goalsCount, setGoalsCount] = useState(0)

  const name = session?.user?.name ?? ''
  const email = session?.user?.email ?? ''
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    fetch('/api/goals')
      .then((r) => r.json())
      .then((data) => setGoalsCount(Array.isArray(data) ? data.length : 0))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profil" subtitle="Gérez votre compte et vos préférences." />

      <Card className="backdrop-blur-xl">
        <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary/20 text-2xl font-bold text-neon">
              {initials || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-xl font-bold">{name}</h2>
              <Badge className="bg-gold/15 text-gold">
                <ShieldCheck className="mr-1 size-3" />
                Premium
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline">Modifier</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Objectifs actifs</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-neon">{goalsCount}</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <TermTooltip
                term="Série d'épargne"
                definition="Le nombre de mois consécutifs où tu as atteint ton objectif d'épargne. Une longue série est signe d'une excellente discipline financière !"
              />
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-gold">— mois</p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {settings.map((s, i) => (
            <div key={s.label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground">
                  <s.icon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </button>
              {i < settings.length - 1 && <Separator className="opacity-50" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full sm:w-auto"
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        <LogOut className="mr-2 size-4" />
        Se déconnecter
      </Button>
    </div>
  )
}

EOF_COMPONENTS_GROWFI_PAGES_PROFILE_PAGE_TSX

echo "→ components/growfi/modals/add-transaction-modal.tsx"
mkdir -p "$(dirname "components/growfi/modals/add-transaction-modal.tsx")"
cat > 'components/growfi/modals/add-transaction-modal.tsx' << 'EOF_COMPONENTS_GROWFI_MODALS_ADD_TRANSACTION_MODAL_TSX'
'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Account = { id: string; name: string; icon: string }

const categories = [
  'Alimentation', 'Transport', 'Logement', 'Santé', 'Éducation',
  'Divertissement', 'Vêtements', 'Épargne', 'Investissement',
  'Salaire', 'Freelance', 'Autre',
]

export function AddTransactionModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [category, setCategory] = useState('Autre')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => {
        setAccounts(data)
        if (data.length > 0) setAccountId(data[0].id)
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !accountId) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        type,
        accountId,
        category,
        description,
        note,
        date,
      }),
    })

    setLoading(false)
    if (!res.ok) {
      setError('Une erreur est survenue.')
      return
    }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-t-3xl bg-[#0C1810] border border-border p-6 sm:rounded-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Nouvelle transaction</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                  type === t
                    ? t === 'expense'
                      ? 'bg-negative/20 text-negative'
                      : 'bg-neon/20 text-neon'
                    : 'text-muted-foreground'
                }`}
              >
                {t === 'expense' ? 'Dépense' : 'Revenu'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Montant (FCFA)</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="h-11 font-mono text-lg"
            />
          </div>

          {/* Account */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Compte</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.icon} {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Input
              placeholder="Ex: Courses au marché"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Ajouter la transaction'}
          </Button>
        </form>
      </div>
    </div>
  )
}

EOF_COMPONENTS_GROWFI_MODALS_ADD_TRANSACTION_MODAL_TSX

echo "→ components/growfi/modals/add-goal-modal.tsx"
mkdir -p "$(dirname "components/growfi/modals/add-goal-modal.tsx")"
cat > 'components/growfi/modals/add-goal-modal.tsx' << 'EOF_COMPONENTS_GROWFI_MODALS_ADD_GOAL_MODAL_TSX'
'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const icons = ['🎯', '✈️', '🏠', '🚗', '📱', '💻', '🎓', '💍', '🏋️', '🌍']
const colors = ['#4CAF50', '#00BFA5', '#FFD54F', '#FF5252', '#2196F3', '#9C27B0', '#FF9800']

export function AddGoalModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎯')
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
      <div className="relative w-full max-w-md rounded-t-3xl bg-[#0C1810] border border-border p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Nouvel objectif</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nom de l'objectif</label>
            <Input placeholder="Ex: Voyage à Paris" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Icône</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((i) => (
                <button
                  key={i} type="button" onClick={() => setIcon(i)}
                  className={`flex size-10 items-center justify-center rounded-xl text-xl transition-colors ${icon === i ? 'bg-primary/20 ring-2 ring-primary' : 'bg-white/5'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Couleur</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  className={`size-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Montant cible (FCFA)</label>
            <Input type="number" inputMode="numeric" placeholder="500 000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required className="h-11 font-mono" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date limite (optionnel)</label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11 font-mono" />
          </div>

          {error && <p className="rounded-lg border border-negative/20 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}

          <Button type="submit" disabled={loading} className="h-11 w-full bg-gradient-to-r from-primary to-teal font-semibold text-white">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Créer l\'objectif'}
          </Button>
        </form>
      </div>
    </div>
  )
}

EOF_COMPONENTS_GROWFI_MODALS_ADD_GOAL_MODAL_TSX

echo ""
echo "✅ Done — 4 fichiers mis à jour"