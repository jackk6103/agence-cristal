import Link from 'next/link'
import type { SignatureCharacter } from '@/lib/characters'

export default function CharacterCard({ character }: { character: SignatureCharacter }) {
  return (
    <article className="character-card">
      <img src={character.image} alt={`${character.name}, personnage virtuel adulte`} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div className="card-shade" />
      <div className="card-topline"><span>{character.age} ans</span><span>{character.traits[0]}</span></div>
      <div className="card-copy">
        <p className="persona">{character.tagline}</p>
        <h3>{character.name}</h3>
        <p>{character.archetype}. {character.traits.slice(0, 3).join(', ')}.</p>
        <Link className="card-cta" href={`/chat/${character.id}`}>Rencontrer {character.name} <span>→</span></Link>
      </div>
    </article>
  )
}
