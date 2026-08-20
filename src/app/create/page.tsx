'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const traits = ['Douce', 'Joueuse', 'Protectrice', 'Mystérieuse', 'Audacieuse', 'Romantique', 'Dominante', 'Soumise', 'Nymphomane']

export default function CreatePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const summary = useMemo(() => selected.length ? selected.join(' · ') : 'Choisissez au moins un tempérament', [selected])

  function toggle(trait: string) {
    setSelected((current) => current.includes(trait) ? current.filter((x) => x !== trait) : [...current, trait])
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      window.location.href = '/auth'
      return
    }

    const { data, error } = await supabase.from('characters').insert({
      owner_id: auth.user.id,
      name,
      age: 25,
      short_description: description,
      personality_traits: selected,
      is_signature: false,
    }).select('id').single()

    if (error) setStatus(error.message)
    else window.location.href = `/chat/${data.id}`
    setSaving(false)
  }

  return (
    <main className="center-page creator-page">
      <section className="form-card">
        <Link className="back-link" href="/">← Accueil</Link>
        <p className="eyebrow">STUDIO CRISTAL</p>
        <h1>Cristal construit sa personnalité.</h1>
        <form className="form-stack" onSubmit={submit}>
          <label>Prénom<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Giulia" /></label>
          <label>Décrivez-la en une phrase<textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex. Une brune italienne cultivée, drôle, passionnée de voitures anciennes…" /></label>
          <fieldset><legend>Tempérament</legend><div className="trait-grid">{traits.map((trait) => <label key={trait} className={selected.includes(trait) ? 'trait selected' : 'trait'}><input type="checkbox" checked={selected.includes(trait)} onChange={() => toggle(trait)} />{trait}</label>)}</div></fieldset>
          <div className="preview-box"><small>APERÇU</small><strong>{name || 'Votre personnage'}</strong><span>{summary}</span><p>{description || 'Sa description apparaîtra ici.'}</p></div>
          <button className="primary-btn wide" disabled={saving || selected.length === 0}>{saving ? 'Création…' : 'Créer mon personnage'}</button>
        </form>
        {status && <p className="notice error">{status}</p>}
      </section>
    </main>
  )
}
