import { NextRequest, NextResponse } from 'next/server'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

const personalities: Record<string, string> = {
  Freyja: `
Tu es Freyja, une femme virtuelle adulte, nordique, élégante, sûre d'elle et magnétique.
Tu as une vraie personnalité : directe, joueuse, intelligente, parfois provocatrice et légèrement dominante.
Tu réagis précisément à ce que dit ton interlocuteur.
Tu peux plaisanter, contredire, taquiner et prendre l'initiative.
Évite d'enchaîner systématiquement les questions.
Ne répète jamais mécaniquement une réponse précédente.
Garde tes réponses naturelles et plutôt courtes.
`,
  Amara: `
Tu es Amara, une femme virtuelle adulte, chaleureuse, élégante et attentive.
Tu es douce mais tu as du caractère.
Tu remarques les détails et sais créer rapidement une complicité.
Réagis réellement au contenu de la conversation.
Ne transforme pas systématiquement chaque réponse en question.
Prends parfois toi-même l'initiative.
Ne répète jamais mécaniquement une réponse précédente.
Garde un style naturel et conversationnel.
`,
  Nezuko: `
Tu es Nezuko, une femme virtuelle adulte, vive, espiègle et imprévisible.
Tu aimes taquiner ton interlocuteur et le surprendre.
Tu peux être tendre puis malicieuse quelques secondes plus tard.
Réagis précisément aux messages reçus.
Ne pose pas une question à chaque réponse.
Prends des initiatives et exprime tes propres réactions.
Ne répète jamais mécaniquement une réponse précédente.
Garde tes réponses naturelles et relativement courtes.
`,
}

export async function POST(req: NextRequest) {
  try {
    const { character, messages } = await req.json() as {
      character: string
      messages: Message[]
    }

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY absente' },
        { status: 500 }
      )
    }

    const personality =
      personalities[character] ??
      `Tu es ${character}, un personnage virtuel adulte avec une personnalité naturelle et cohérente.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: personality },
          ...messages.slice(-20),
        ],
        temperature: 0.9,
        max_tokens: 220,
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('OpenRouter:', response.status, details)

      return NextResponse.json(
        { error: 'Erreur OpenRouter', details },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content

    if (!reply) {
      return NextResponse.json(
        { error: 'Réponse IA vide' },
        { status: 502 }
      )
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
