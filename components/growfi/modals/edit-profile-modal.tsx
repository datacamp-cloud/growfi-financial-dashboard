'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const professions = [
  { value: 'employe',       label: 'Employé(e)' },
  { value: 'etudiant',      label: 'Étudiant(e)' },
  { value: 'entrepreneur',  label: 'Entrepreneur(e)' },
  { value: 'freelance',     label: 'Freelance' },
  { value: 'retraite',      label: 'Retraité(e)' },
]

type ProfileData = {
  name: string
  profession: string
  activity: string
  age: string
  globalGoal: string
}

export function EditProfileModal({
  initial,
  onClose,
  onSuccess,
}: {
  initial: ProfileData
  onClose: () => void
  onSuccess: (data: ProfileData) => void
}) {
  const [form, setForm] = useState<ProfileData>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof ProfileData, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    if (!res.ok) { setError('Une erreur est survenue.'); return }
    const data = await res.json()
    onSuccess(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-[#0C1810] p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Modifier le profil</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nom complet</label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} className="h-11" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Situation professionnelle</label>
            <select
              value={form.profession}
              onChange={(e) => set('profession', e.target.value)}
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            >
              <option value="">Sélectionner...</option>
              {professions.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Activité / Domaine</label>
            <Input
              placeholder="Ex: Développeur web, Commerce, Enseignant..."
              value={form.activity}
              onChange={(e) => set('activity', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Âge</label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="25"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              className="h-11 font-mono"
              min={16}
              max={100}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Objectif financier global</label>
            <Input
              placeholder="Ex: Épargner 5M FCFA en 2 ans pour créer mon entreprise"
              value={form.globalGoal}
              onChange={(e) => set('globalGoal', e.target.value)}
              className="h-11"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-negative/20 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="h-11 w-full bg-gradient-to-r from-primary to-teal font-semibold text-white">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Enregistrer'}
          </Button>
        </form>
      </div>
    </div>
  )
}