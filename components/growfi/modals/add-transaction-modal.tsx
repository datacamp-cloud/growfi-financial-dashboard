'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Account = { id: string; name: string; icon: string }
type TransactionType = 'expense' | 'income' | 'transfer'

const expenseCategories = ['Alimentation', 'Transport', 'Logement', 'Santé', 'Éducation', 'Divertissement', 'Vêtements', 'Abonnements', 'Autre']
const incomeCategories = ['Salaire', 'Freelance', 'Business', 'Prime', 'Autre']

export function AddTransactionModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [relatedAccountId, setRelatedAccountId] = useState('')
  const [category, setCategory] = useState('Alimentation')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/accounts').then((r) => r.json()).then((data) => {
      setAccounts(data)
      if (data.length > 0) setAccountId(data[0].id)
      if (data.length > 1) setRelatedAccountId(data[1].id)
    })
  }, [])

  const categories = useMemo(() => type === 'income' ? incomeCategories : expenseCategories, [type])

  function changeType(next: TransactionType) {
    setType(next)
    if (next === 'income') setCategory('Salaire')
    if (next === 'expense') setCategory('Alimentation')
    if (next === 'transfer') setCategory('Transfert')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !accountId || (type === 'transfer' && !relatedAccountId)) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), type, accountId, relatedAccountId: type === 'transfer' ? relatedAccountId : null, category, description, note, date }),
    })

    setLoading(false)
    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      setError(payload?.error ?? 'Une erreur est survenue.')
      return
    }
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-[#0C1810] p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Nouvelle transaction</h2>
            <p className="mt-1 text-xs text-muted-foreground">Enregistre un mouvement d'argent.</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button key={t} type="button" onClick={() => changeType(t)} className={`rounded-lg py-2 text-xs font-semibold transition-colors ${type === t ? 'bg-primary/15 text-neon' : 'text-muted-foreground'}`}>
                {t === 'expense' ? 'Dépense' : t === 'income' ? 'Revenu' : 'Transfert'}
              </button>
            ))}
          </div>

          {type === 'transfer' && <p className="rounded-lg border border-neon/15 bg-neon/5 px-3 py-2 text-xs text-muted-foreground">Un transfert déplace ton argent entre deux comptes. Il ne compte ni comme revenu ni comme dépense.</p>}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Montant (FCFA)</label>
            <Input type="number" inputMode="numeric" min="1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required className="h-11 font-mono text-lg" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">{type === 'transfer' ? 'Compte source' : 'Compte'}</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-secondary">
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
              </select>
            </div>
            {type === 'transfer' && <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Compte destination</label>
              <select value={relatedAccountId} onChange={(e) => setRelatedAccountId(e.target.value)} required className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-secondary">
                {accounts.filter((a) => a.id !== accountId).map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
              </select>
            </div>}
          </div>

          {type !== 'transfer' && <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-secondary">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Input placeholder={type === 'transfer' ? 'Ex : Alimentation du compte épargne' : type === 'income' ? 'Ex : Salaire de septembre' : 'Ex : Courses au marché'} value={description} onChange={(e) => setDescription(e.target.value)} className="h-11" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 font-mono" />
          </div>

          {error && <p className="rounded-lg border border-negative/20 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}
          <Button type="submit" disabled={loading} className="h-11 w-full bg-gradient-to-r from-primary to-teal font-semibold text-white">
            {loading ? <Loader2 className="size-4 animate-spin" /> : type === 'transfer' ? 'Effectuer le transfert' : type === 'income' ? 'Ajouter le revenu' : 'Enregistrer la dépense'}
          </Button>
        </form>
      </div>
    </div>
  )
}
