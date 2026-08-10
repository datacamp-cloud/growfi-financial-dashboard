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