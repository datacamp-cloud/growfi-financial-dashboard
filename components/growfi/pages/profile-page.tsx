'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '../shared'
import { Bell, CreditCard, Globe, Lock, LogOut, Moon, ShieldCheck } from 'lucide-react'

const settings = [
  { icon: Bell, label: 'Notifications', desc: 'Push, email and budget alerts' },
  { icon: Lock, label: 'Security', desc: 'Password, 2FA and devices' },
  { icon: Globe, label: 'Language & region', desc: 'English · FCFA (XOF)' },
  { icon: CreditCard, label: 'Payment methods', desc: 'Wave, Orange Money, cards' },
  { icon: Moon, label: 'Appearance', desc: 'Dark theme' },
]

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" subtitle="Manage your account and preferences." />

      <Card className="backdrop-blur-xl">
        <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary/20 text-2xl font-bold text-neon">AK</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-xl font-bold">Amara Koné</h2>
              <Badge className="bg-gold/15 text-gold">
                <ShieldCheck data-icon="inline-start" />
                Premium
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">amara.kone@growfi.africa</p>
            <p className="text-xs text-muted-foreground">Member since March 2024 · Dakar, Senegal</p>
          </div>
          <Button variant="outline">Edit profile</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Credit score</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-neon">742</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Active goals</p>
            <p className="mt-1 font-mono text-2xl font-extrabold">4</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-xl">
          <CardContent>
            <p className="text-xs text-muted-foreground">Savings streak</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-gold">18 mo</p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
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

      <Button variant="destructive" className="w-full sm:w-auto">
        <LogOut data-icon="inline-start" />
        Sign out
      </Button>
    </div>
  )
}
