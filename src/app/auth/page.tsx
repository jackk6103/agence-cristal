'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/create` },
      })
      if (error) throw error
      setMessage('Lien de connexion envoyé. Vérifiez votre boîte mail.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible d’envoyer le lien.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="center-page">
      <section className="form-card small">
        <Link className="back-link" href="/">← Accueil</Link>
        <p className="eyebrow">MON ESPACE CRISTAL</p>
        <h1>Connexion sans mot de passe.</h1>
        <p className="muted">Entrez votre e-mail. Supabase vous envoie un lien sécurisé pour ouvrir votre espace.</p>
        <form onSubmit={submit} className="form-stack">
          <label>E-mail<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" /></label>
          <button className="primary-btn wide" disabled={loading}>{loading ? 'Envoi…' : 'Recevoir mon lien'}</button>
        </form>
        {message && <p className="notice">{message}</p>}
      </section>
    </main>
  )
}
