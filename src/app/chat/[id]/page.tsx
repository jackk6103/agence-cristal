'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { signatureCharacters } from '@/lib/characters'
import { createClient } from '@/lib/supabase/client'

type Message = { role: 'assistant' | 'user'; content: string }
type Character = {
  id: string
  name: string
  short_description?: string | null
  personality_traits?: string[] | null
}

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const signature = useMemo(
    () => signatureCharacters.find((c) => c.id === id),
    [id]
  )

  const [character, setCharacter] = useState<Character | null>(
    signature
      ? {
          id: signature.id,
          name: signature.name,
          short_description: signature.archetype,
          personality_traits: signature.traits,
        }
      : null
  )

  const [messages, setMessages] = useState<Message[]>(
    signature ? [{ role: 'assistant', content: signature.intro }] : []
  )

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (signature) return

    const supabase = createClient()

    supabase
      .from('characters')
      .select('id,name,short_description,personality_traits')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCharacter(data)
          setMessages([
            {
              role: 'assistant',
              content: `Je m'appelle ${data.name}. Tu m'as imaginée ainsi… maintenant apprenons à nous connaître.`,
            },
          ])
        }
      })
  }, [id, signature])

  async function send(e: FormEvent) {
    e.preventDefault()

    const clean = text.trim()

    if (!clean || !character || loading) return

    const userMessage: Message = {
      role: 'user',
      content: clean,
    }

    const conversation = [...messages, userMessage]

    setMessages(conversation)
    setText('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: character.name,
          messages: conversation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Erreur IA')
      }

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: "Je n'arrive pas à répondre pour le moment. Réessaie dans quelques secondes.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!character) {
    return (
      <main className="center-page">
        <p>Chargement du personnage…</p>
      </main>
    )
  }

  return (
    <main className="chat-page">
      <section className="chat-shell">
        <header className="chat-header">
          <Link href="/">←</Link>

          <div>
            <strong>{character.name}</strong>
            <span>Personnage IA · en ligne</span>
          </div>

          <span className="online-dot">●</span>
        </header>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble assistant">
              …
            </div>
          )}
        </div>

        <form className="chat-compose" onSubmit={send}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={loading ? 'Elle réfléchit…' : 'Écrire un message…'}
            disabled={loading}
          />

          <button aria-label="Envoyer" disabled={loading}>
            ↑
          </button>
        </form>
      </section>
    </main>
  )
}
