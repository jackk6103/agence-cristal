'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { signatureCharacters } from '@/lib/characters'
import { createClient } from '@/lib/supabase/client'

type Message = { role: 'assistant' | 'user'; content: string }
type Character = { id: string; name: string; short_description?: string | null; personality_traits?: string[] | null }

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const signature = useMemo(() => signatureCharacters.find((c) => c.id === id), [id])
  const [character, setCharacter] = useState<Character | null>(signature ? { id: signature.id, name: signature.name, short_description: signature.archetype, personality_traits: signature.traits } : null)
  const [messages, setMessages] = useState<Message[]>(signature ? [{ role: 'assistant', content: signature.intro }] : [])
  const [text, setText] = useState('')

  useEffect(() => {
    if (signature) return
    const supabase = createClient()
    supabase.from('characters').select('id,name,short_description,personality_traits').eq('id', id).single().then(({ data }) => {
      if (data) {
        setCharacter(data)
        setMessages([{ role: 'assistant', content: `Je m'appelle ${data.name}. Tu m'as imaginée ainsi… maintenant apprenons à nous connaître.` }])
      }
    })
  }, [id, signature])

  async function send(e: FormEvent) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean || !character) return
    setMessages((m) => [...m, { role: 'user', content: clean }])
    setText('')

    // V0.1: réponse locale de démonstration. Le prochain jalon branchera le vrai modèle IA.
    const reply = character.name === 'Freyja'
      ? "Intéressant. Mais je veux comprendre ce qui compte vraiment pour toi derrière cette réponse."
      : character.name === 'Amara'
        ? "J'aime ta façon de le dire. Raconte-moi la partie que tu n'aurais pas racontée à tout le monde."
        : character.name === 'Nezuko'
          ? "Hmm… tu viens de piquer ma curiosité. Maintenant, donne-moi un détail auquel je ne m'attends pas."
          : `Alors, ${clean.length > 45 ? 'tu as beaucoup à raconter' : 'tu vas devoir m’en dire un peu plus'}… qu’est-ce que je dois retenir de toi ?`
    setTimeout(() => setMessages((m) => [...m, { role: 'assistant', content: reply }]), 250)
  }

  if (!character) return <main className="center-page"><p>Chargement du personnage…</p></main>

  return (
    <main className="chat-page">
      <section className="chat-shell">
        <header className="chat-header"><Link href="/">←</Link><div><strong>{character.name}</strong><span>Personnage IA · en ligne</span></div><span className="online-dot">●</span></header>
        <div className="chat-messages">{messages.map((m, i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>)}</div>
        <form className="chat-compose" onSubmit={send}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" /><button aria-label="Envoyer">↑</button></form>
      </section>
    </main>
  )
}
