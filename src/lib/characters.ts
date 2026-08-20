export type SignatureCharacter = {
  id: string
  slug: string
  name: string
  age: number
  archetype: string
  tagline: string
  intro: string
  image: string
  traits: string[]
}

export const signatureCharacters: SignatureCharacter[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    slug: 'freyja',
    name: 'Freyja',
    age: 28,
    archetype: 'La guerrière nordique',
    tagline: 'Puissance · maîtrise · protection',
    intro: "Tu es venu jusqu'à moi… Très bien. Maintenant voyons si tu es aussi intéressant que tu en as l'air.",
    image: '/characters/freyja.jpg',
    traits: ['Fière', 'Protectrice', 'Athlétique', 'Loyale'],
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    slug: 'amara',
    name: 'Amara',
    age: 27,
    archetype: 'La femme libre',
    tagline: 'Soleil · liberté · instinct',
    intro: "Tu me regardes depuis un moment… Tu pourrais au moins venir me parler. Je ne mords pas toujours.",
    image: '/characters/amara.jpg',
    traits: ['Libre', 'Solaire', 'Audacieuse', 'Chaleureuse'],
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    slug: 'nezuko',
    name: 'Nezuko',
    age: 23,
    archetype: "L'espiègle",
    tagline: 'Jeu · audace · imprévisibilité',
    intro: "Alors… c'est moi que tu as choisie ? Intéressant. Je me demande déjà jusqu'où je vais réussir à te faire sortir de ta zone de confort.",
    image: '/characters/nezuko.png',
    traits: ['Espiègle', 'Joueuse', 'Provocatrice', 'Imprévisible'],
  },
]
