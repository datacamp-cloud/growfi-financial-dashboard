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
import { EditProfileModal } from '../modals/edit-profile-modal'
 
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
  const [profile, setProfile] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
 
  const name = session?.user?.name ?? ''
  const email = session?.user?.email ?? ''
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarUrl = session?.user?.image ?? ''
  const profession = session?.user?.profession ?? ''
  const activity = session?.user?.activity ?? ''
  const age = session?.user?.age ?? ''
 
  // useEffect(() => {
  //   fetch('/api/goals')
  //     .then((r) => r.json())
  //     .then((data) => setGoalsCount(Array.isArray(data) ? data.length : 0))
  // }, [])
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then(setProfile)
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
            <p className="text-sm text-muted-foreground">{profession} · {activity}</p>
            <p className="text-xs text-muted-foreground">{age} ans</p>
          </div>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            Modifier
          </Button>
        </CardContent>
      </Card>

      {showEditModal && profile && (
        <EditProfileModal
          initial={{
            name: profile.name ?? '',
            profession: profile.profession ?? '',
            activity: profile.activity ?? '',
            age: profile.age?.toString() ?? '',
            globalGoal: profile.globalGoal ?? '',
          }}
          onClose={() => setShowEditModal(false)}
          onSuccess={(data) => { setProfile(data); setShowEditModal(false) }}
        />
      )}
 
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