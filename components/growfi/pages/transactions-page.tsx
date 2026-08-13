'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { TransactionsTable } from '../transactions-table'
import { Money, PageHeader } from '../shared'
import { Search, Loader2 } from 'lucide-react'

// Définition du type basé sur le retour de votre API Prisma
type ApiTransaction = {
  id: string
  amount: number
  type: string
  category: string
  description: string
  note: string | null
  date: string
  source: string
  accountId: string
  account?: {
    name: string
    icon: string | null
  }
}

export function TransactionsPage() {
  const [query, setQuery] = useState('')
  const [account, setAccount] = useState('all')
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Récupération des transactions depuis l'API
  // 1. Récupération des transactions depuis l'API avec re-mapping pour le tableau
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/transactions')
        
        if (!res.ok) {
          throw new Error('Impossible de charger les transactions')
        }
        
        const data: ApiTransaction[] = await res.json()

        // On transforme les données de l'API pour correspondre à ce qu'attend le tableau statique
        const mappedData = data.map((t) => ({
          ...t,
          account: t.account?.name ?? 'Inconnu', // Si le tableau attendait une string pour account
          icon: t.account?.icon ?? 'Wallet',     // On extrait l'icône du compte vers la racine
          status: 'completed',                    // Valeur par défaut pour satisfaire le type requis
        }))

        // @ts-ignore ou transtypage si nécessaire pour forcer l'acceptation
        setTransactions(mappedData as any)
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])


  // 2. Extraction dynamique de la liste des comptes uniques présents dans les transactions
  const uniqueAccounts = useMemo(() => {
    const names = new Set<string>()
    transactions.forEach((t) => {
      if (t.account?.name) names.add(t.account.name)
    })
    return Array.from(names)
  }, [transactions])

  // 3. Filtrage côté client des données reçues
  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const matchesQuery = t.description.toLowerCase().includes(query.toLowerCase())
        // Correction ici : l'API renvoie le compte dans l'objet imbriqué `account`
        const matchesAccount = account === 'all' || t.account?.name === account
        return matchesQuery && matchesAccount
      }),
    [query, account, transactions],
  )

  // 4. Calculs des totaux dynamiques
  const inflow = useMemo(() => 
    filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  
  const outflow = useMemo(() => 
    filtered.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0),
    [filtered]
  )

  // Affichage de l'état de chargement
  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="size-8 animate-spin text-neon" />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Transactions" subtitle="Chaque mouvement au travers de tes comptes" />

      {error ? (
        <Card className="border-negative/20 bg-negative/5 backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-sm text-negative">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Entrant</p>
            <Money value={inflow} className="mt-1 block text-lg font-extrabold text-neon" suffix={false} />
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Sortant</p>
            <Money value={outflow} className="mt-1 block text-lg font-extrabold text-negative" suffix={false} />
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select 
              value={account} 
              onValueChange={(val) => val && setAccount(val)}
            >
              <SelectTrigger className="h-10 w-full sm:w-48">
                <SelectValue placeholder="Choisir un compte" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tous les comptes</SelectItem>
                  {uniqueAccounts.map((accountName) => (
                    <SelectItem key={accountName} value={accountName}>
                      {accountName}
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
              <p className="text-sm font-medium">Aucune transaction trouvée</p>
              <p className="text-xs text-muted-foreground">Essaie d'ajuster ta recherche ou tes filtres.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
