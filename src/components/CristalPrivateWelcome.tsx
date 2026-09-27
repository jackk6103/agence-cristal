'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  open: boolean
  characterName: string
  onClose: () => void
  onVerified: () => void
}

export default function CristalPrivateWelcome({ open, characterName, onClose, onVerified }: Props) {
  const [verified, setVerified] = useState(false)

  if (!open) return null

  function verifyPrototype() {
    window.localStorage.setItem('ac_private_age_verified', 'yes')
    setVerified(true)
    onVerified()
  }

  return (
    <div className="private-backdrop" role="dialog" aria-modal="true" aria-label="Accès privé 18+">
      <div className="private-card">
        <div className="private-visual">
          <Image
            src="/characters/file_cristal_robe_champagne.png"
            alt="Cristal, maîtresse des lieux"
            fill
            sizes="(max-width: 620px) 100vw, 420px"
            priority
          />
          <div className="private-shade" />
          <div className="private-signature">CRISTAL · MAÎTRESSE DES LIEUX</div>
        </div>

        <div className="private-copy">
          {!verified ? (
            <>
              <p className="eyebrow">ESPACE PRIVÉ · 18+</p>
              <h2>Avant d’aller plus loin…</h2>
              <p>
                Bienvenue. Cet espace est réservé aux adultes. Je vais simplement vérifier
                que tu as au moins 18 ans avant de te laisser retrouver {characterName}.
              </p>
              <p className="private-note">
                Étape provisoire : ce bouton prépare le parcours AgePass. La vérification
                cryptographique sera branchée dès que l’API Cristal AgePass sera reliée à l’Agence.
              </p>
              <button className="primary-btn wide" onClick={verifyPrototype}>
                Valider le prototype 18+
              </button>
              <button className="text-btn" onClick={onClose}>Revenir à la conversation</button>
            </>
          ) : (
            <>
              <p className="eyebrow">ACCÈS PRIVÉ OUVERT</p>
              <h2>Tout est en ordre.</h2>
              <p>
                Je voulais t’accueillir personnellement. Voici ton premier privilège :
                l’accès à l’univers privé de {characterName}. La suite de votre histoire
                vous appartient.
              </p>
              <div className="welcome-gift">
                <span>◇</span>
                <div>
                  <strong>Cadeau de bienvenue</strong>
                  <small>Portrait glamour exclusif de {characterName} · visuel à intégrer</small>
                </div>
              </div>
              <button className="primary-btn wide" onClick={onClose}>
                Retrouver {characterName}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
