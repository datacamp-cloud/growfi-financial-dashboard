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
import { Bell, CreditCard, Globe, Lock, LogOut, Moon, ShieldCheck, Loader2 } from 'lucide-react'
import { EditProfileModal } from '../modals/edit-profile-modal'

const settings = [
  { icon: Bell, label: 'Notifications', desc: 'Alertes push, email et depassements de budget' },
  { icon: Lock, label: 'Securite', desc: 'Mot de passe, double authentification et appareils' },
  { icon: Globe, label: 'Langue & region', desc: 'Francais · FCFA (XOF)' },
  { icon: CreditCard, label: 'Moyens de paiement', desc: 'Wave, Orange Money, cartes bancaires' },
  { icon: Moon, label: 'Apparence', desc: 'Theme sombre' },
]

const professionLabels: Record<string, string> = {
  employe: 'Employe(e)', etudiant: 'Etudiant(e)', entrepreneur: 'Entrepreneur(e)', freelance: 'Freelance', retraite: 'Retraite(e)',
}

type Profile = {
  name: string
  email: string
  profession: string | null
  activity: string | null
  age: number | null
  globalGoal: string | null
  createdAt: string
}

export function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [goalsCount, setGoalsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then((r) => r.json()),
      fetch('/api/goals').then((r) => r.json()),
    ]).then(([profileData, goalsData]) => {
      setProfile(profileData)
      setGoalsCount(Array.isArray(goalsData) ? goalsData.length : 0)
      setLoading(false)
    })
  }, [])

  const displayName = profile?.name ?? session?.user?.name ?? ''
  const displayEmail = profile?.email ?? session?.user?.email ?? ''
  const displayProf = profile?.profession ? professionLabels[profile.profession] ?? profile.profession : null
  const displayActivity = profile?.activity ?? null
  const displayAge = profile?.age ?? null
  const displayGoal = profile?.globalGoal ?? null

  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="size-8 animate-spin text-neon" /></div>

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profil" subtitle="Gerez votre compte et vos preferences." />
      <Card className="backdrop-blur-xl">
        <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20"><AvatarFallback className="bg-primary/20 text-2xl font-bold text-neon">{initials || '?'}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row"><h2 className="text-xl font-bold">{displayName}</h2><Badge className="bg-gold/15 text-gold"><ShieldCheck className="mr-1 size-3" />Premium</Badge></div>
            <p className="mt-1 text-sm text-muted-foreground">{displayEmail}</p>
            {(displayProf || displayActivity) && <p className="text-sm text-muted-foreground">{[displayProf, displayActivity].filter(Boolean).join(' · ')}</p>}
            {displayAge && <p className="text-xs text-muted-foreground">{displayAge} ans</p>}
            {displayGoal && <p className="mt-1 text-xs text-neon/80 italic">« {displayGoal} »</p>}
          </div>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>Modifier</Button>
        </CardContent>
      </Card>

      {showEditModal && profile && (
        <EditProfileModal
          initial={{ name: profile.name ?? '', profession: profile.profession ?? '', activity: profile.activity ?? '', age: profile.age?.toString() ?? '', globalGoal: profile.globalGoal ?? '' }}
          onClose={() => setShowEditModal(false)}
          onSuccess={(data) => {
            setProfile((prev) => prev ? { ...prev, name: data.name, profession: data.profession || null, activity: data.activity || null, age: data.age ? Number(data.age) : null, globalGoal: data.globalGoal || null } : prev)
            setShowEditModal(false)
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="backdrop-blur-xl"><CardContent><p className="text-xs text-muted-foreground">Objectifs actifs</p><p className="mt-1 font-mono text-2xl font-extrabold text-neon">{goalsCount}</p></CardContent></Card>
        <Card className="backdrop-blur-xl"><CardContent><p className="text-xs text-muted-foreground"><TermTooltip term="Serie d’epargne" definition="Le nombre de mois consecutifs ou tu as atteint ton objectif d’epargne. Une longue serie est signe d’une excellente discipline financiere !" /></p><p className="mt-1 font-mono text-2xl font-extrabold text-gold">-- mois</p></CardContent></Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardHeader><CardTitle>Parametres</CardTitle></CardHeader>
        <CardContent className="flex flex-col">
          {settings.map((s, i) => <div key={s.label}><button type="button" className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-white/5"><span className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground"><s.icon className="size-5" /></span><div className="flex-1"><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div></button>{i < settings.length - 1 && <Separator className="opacity-50" />}</div>)}
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full sm:w-auto" onClick={() => signOut({ callbackUrl: '/login' })}><LogOut className="mr-2 size-4" />Se deconnecter</Button>
    </div>
  )
}
