'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionsTable, type ApiTransaction } from '../transactions-table'
import { Money, PageHeader } from '../shared'
import { Search, Loader2 } from 'lucide-react'

export function TransactionsPage() {
  const [query, setQuery] = useState('')
  const [account, setAccount] = useState('all')
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true); setError(null)
        const res = await fetch('/api/transactions')
        if (!res.ok) throw new Error('Impossible de charger les transactions')
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Réponse serveur invalide')
        const mappedData: ApiTransaction[] = data.map((t) => ({ ...t, amount: t.type === 'expense' ? -Math.abs(Number(t.amount)) : Math.abs(Number(t.amount)), account: t.account }))
        setTransactions(mappedData)
      } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue') }
      finally { setLoading(false) }
    }
    fetchTransactions()
  }, [])

  const uniqueAccounts = useMemo(() => {
    const names = new Set<string>()
    transactions.forEach((t) => { if (t.account?.name) names.add(t.account.name) })
    return Array.from(names)
  }, [transactions])

  const filtered = useMemo(() => transactions.filter((t) => {
    const searchable = `${t.description ?? ''} ${t.category ?? ''}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (account === 'all' || t.account?.name === account)
  }), [query, account, transactions])

  const inflow = useMemo(() => filtered.filter((t) => t.type === 'income').reduce((sum, t) => sum + Math.abs(t.amount), 0), [filtered])
  const outflow = useMemo(() => filtered.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0), [filtered])

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="size-8 animate-spin text-neon" /></div>

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Transactions" subtitle="Chaque mouvement au travers de tes comptes" />
      {error && <Card className="border-negative/20 bg-negative/5 backdrop-blur-xl"><CardContent className="pt-6"><p className="text-sm text-negative">{error}</p></CardContent></Card>}
      <div className="grid grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl"><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total Entrant</p><Money value={inflow} className="mt-1 block text-lg font-extrabold text-neon" suffix={false} /></CardContent></Card>
        <Card className="backdrop-blur-xl"><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total Sortant</p><Money value={outflow} className="mt-1 block text-lg font-extrabold text-negative" suffix={false} /></CardContent></Card>
      </div>
      <Card className="backdrop-blur-xl"><CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Rechercher une transaction..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 pl-9" /></div><Select value={account} onValueChange={(val) => val && setAccount(val)}><SelectTrigger className="h-10 w-full sm:w-48"><SelectValue placeholder="Choisir un compte" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">Tous les comptes</SelectItem>{uniqueAccounts.map((accountName) => <SelectItem key={accountName} value={accountName}>{accountName}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
        {filtered.length > 0 ? <TransactionsTable items={filtered} /> : <div className="flex flex-col items-center gap-2 py-12 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground"><Search className="size-6" /></span><p className="text-sm font-medium">Aucune transaction trouvée</p><p className="text-xs text-muted-foreground">Essaie d’ajuster ta recherche ou tes filtres.</p></div>}
      </CardContent></Card>
    </div>
  )
}
