'use client'

import { useEffect, useState } from 'react'

export default function AdultGate() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(localStorage.getItem('ac_age_verified') !== 'yes')
  }, [])

  if (!open) return null

  return (
    <div className="gate-backdrop" role="dialog" aria-modal="true" aria-label="Confirmation d'âge">
      <div className="gate-card">
        <div className="diamond">◇</div>
        <p className="eyebrow">AGENCE CRISTAL · 18+</p>
        <h2>Un univers réservé aux adultes.</h2>
        <p>Les personnages sont fictifs et générés par IA. Confirmez que vous avez au moins 18 ans pour continuer.</p>
        <button
          className="primary-btn wide"
          onClick={() => {
            localStorage.setItem('ac_age_verified', 'yes')
            setOpen(false)
          }}
        >
          J’ai 18 ans ou plus
        </button>
        <button className="text-btn" onClick={() => (window.location.href = 'https://www.google.com')}>Quitter</button>
      </div>
    </div>
  )
}
