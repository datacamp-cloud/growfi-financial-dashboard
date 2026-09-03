'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatFCFA } from '@/lib/format'
import { Icon } from '../icon'
import { Money, PageHeader, StatBar } from '../shared'
import { Plus, Loader2, ArrowDownToLine, X, CheckCircle2 } from 'lucide-react'
import { AddGoalModal } from '../modals/add-goal-modal'

type Goal = { id: string; name: string; icon: string; targetAmount: number; currentAmount: number; color: string; deadline: string | null }
type Account = { id: string; name: string; balance: number; icon: string }
type GoalTransaction = { id: string; amount: number; date: string; note: string | null; account: { name: string; icon: string | null } }

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [contributions, setContributions] = useState<GoalTransaction[]>([])
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [today] = useState(() => Date.now())

  async function fetchGoals() {
    try {
      const res = await fetch('/api/goals')
      if (!res.ok) throw new Error('Impossible de charger les objectifs')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Réponse serveur invalide')
      setGoals(data)
    } finally { setLoading(false) }
  }

  async function openGoal(goal: Goal) {
    setSelectedGoal(goal); setError(''); setAmount(''); setNote('')
    try {
      const [transactionsRes, accountsRes] = await Promise.all([fetch(`/api/goals/${goal.id}/contributions`), fetch('/api/accounts')])
      const transactions = await transactionsRes.json(); const accountData = await accountsRes.json()
      setContributions(Array.isArray(transactions) ? transactions : [])
      const usableAccounts = Array.isArray(accountData) ? accountData : []
      setAccounts(usableAccounts); setAccountId(usableAccounts[0]?.id ?? '')
    } catch { setError('Impossible de charger les détails de l’objectif') }
  }

  useEffect(() => { fetchGoals() }, [])

  function daysRemaining(deadline: string | null) {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline).getTime() - today) / 86400000)
    return diff > 0 ? `${diff} jours restants` : 'Échéance dépassée'
  }

  async function addContribution(e: React.FormEvent) {
    e.preventDefault(); if (!selectedGoal) return
    setSaving(true); setError('')
    try {
      const res = await fetch(`/api/goals/${selectedGoal.id}/contributions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId, amount: Number(amount), note: note || null }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Impossible d’ajouter la contribution')
      setSelectedGoal(data.goal); setGoals((current) => current.map((g) => g.id === data.goal.id ? data.goal : g)); setContributions((current) => [data.transaction, ...current]); setAmount(''); setNote('')
      setAccounts((current) => current.map((a) => a.id === accountId ? { ...a, balance: a.balance - Number(amount) } : a))
    } catch (err) { setError(err instanceof Error ? err.message : 'Impossible d’ajouter la contribution') }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Objectifs" subtitle="Chaque contribution est enregistrée comme une transaction liée à l’objectif." action={<Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-primary to-teal text-primary-foreground"><Plus className="mr-2 size-4" />Nouvel objectif</Button>} />
      {loading ? <div className="flex h-48 items-center justify-center"><Loader2 className="size-8 animate-spin text-neon" /></div> : goals.length === 0 ? <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground"><p>Aucun objectif pour l’instant.</p><Button variant="outline" onClick={() => setShowModal(true)}>Créer mon premier objectif</Button></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {goals.map((g) => { const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0; return <button key={g.id} type="button" onClick={() => openGoal(g)} className="rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neon"><Card className="h-full backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-neon/40"><CardContent className="flex flex-col gap-4"><div className="flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${g.color} 15%, transparent)`, color: g.color }}><Icon name={g.icon} className="size-5" /></span><span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: `color-mix(in srgb, ${g.color} 15%, transparent)`, color: g.color }}>{pct >= 100 ? 'Atteint' : `${pct}%`}</span></div><div><h3 className="font-semibold">{g.name}</h3>{daysRemaining(g.deadline) && <p className="text-xs text-muted-foreground">{daysRemaining(g.deadline)}</p>}</div><div className="flex flex-col gap-2"><div className="flex items-baseline justify-between"><Money value={g.currentAmount} suffix={false} className="text-base font-extrabold" /><span className="text-xs text-muted-foreground">/ {formatFCFA(g.targetAmount, false)}</span></div><StatBar percent={pct} color={g.color} /><p className="text-[11px] text-muted-foreground">Cliquer pour voir les contributions et ajouter de l’argent.</p></div></CardContent></Card></button> })}
      </div>}
      {showModal && <AddGoalModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchGoals() }} />}
      {selectedGoal && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-[#0C1810] p-6 sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${selectedGoal.color} 15%, transparent)`, color: selectedGoal.color }}><Icon name={selectedGoal.icon} className="size-5" /></span><div><h2 className="font-bold">{selectedGoal.name}</h2><p className="text-xs text-muted-foreground">{Math.min(100, Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100))}% de l’objectif atteint</p></div></div><button type="button" onClick={() => setSelectedGoal(null)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"><X className="size-5" /></button></div>
        <div className="mb-6 rounded-2xl border border-border bg-white/5 p-4"><div className="mb-2 flex justify-between text-sm"><span>Progression</span><span className="font-semibold">{formatFCFA(selectedGoal.currentAmount, false)} / {formatFCFA(selectedGoal.targetAmount, false)}</span></div><StatBar percent={Math.min(100, Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100))} color={selectedGoal.color} />{selectedGoal.currentAmount >= selectedGoal.targetAmount && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-neon"><CheckCircle2 className="size-4" />Objectif atteint</p>}</div>
        {selectedGoal.currentAmount < selectedGoal.targetAmount && <form onSubmit={addContribution} className="mb-6 flex flex-col gap-3 rounded-2xl border border-border p-4"><div className="flex items-center gap-2 text-sm font-semibold"><ArrowDownToLine className="size-4 text-neon" />Ajouter une contribution</div><p className="text-xs text-muted-foreground">Le montant est retiré du compte choisi et ajouté à cet objectif. La transaction reste visible dans l’historique.</p><select value={accountId} onChange={(e) => setAccountId(e.target.value)} required className="h-11 rounded-lg border border-border bg-[#0C1A10] px-3 text-sm text-foreground"><option value="">Choisir un compte</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name} — {formatFCFA(a.balance, false)}</option>)}</select><Input type="number" min="1" step="1" inputMode="numeric" placeholder="Montant de la contribution" value={amount} onChange={(e) => setAmount(e.target.value)} required className="h-11 font-mono" /><Input placeholder="Note (optionnel)" value={note} onChange={(e) => setNote(e.target.value)} className="h-11" />{error && <p className="rounded-lg border border-negative/20 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}<Button type="submit" disabled={saving || !accountId} className="h-11 bg-gradient-to-r from-primary to-teal font-semibold">{saving ? <Loader2 className="size-4 animate-spin" /> : 'Enregistrer la contribution'}</Button></form>}
        <div><h3 className="mb-3 text-sm font-semibold">Contributions récentes</h3>{contributions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune contribution pour le moment.</p> : <div className="flex flex-col divide-y divide-border rounded-xl border border-border">{contributions.map((t) => <div key={t.id} className="flex items-center justify-between gap-3 px-3 py-3"><div><p className="text-sm font-medium">{t.account?.name ?? 'Compte'}</p><p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('fr-FR')}{t.note ? ` · ${t.note}` : ''}</p></div><span className="text-sm font-bold text-neon">+{formatFCFA(t.amount, false)}</span></div>)}</div>}</div>
      </div></div>}
    </div>
  )
}
