'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

const contactEmail = 'cristal.et.jeanmarie@gmail.com'
const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent('Contact — Agence Cristal')}`

export default function CristalContact() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const chatPage = pathname?.startsWith('/chat/')
  const bottom = chatPage ? 88 : 18

  return (
    <aside aria-label="Assistance Agence Cristal" style={{ position: 'fixed', right: 16, bottom, zIndex: 90, fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {open && (
        <section role="dialog" aria-modal="false" aria-label="Contacter Cristal" style={{ width: 'min(338px, calc(100vw - 32px))', marginBottom: 12, borderRadius: 22, border: '1px solid rgba(236,213,161,.45)', background: '#12100e', boxShadow: '0 18px 60px rgba(0,0,0,.7)', overflow: 'hidden', color: '#f7f3ec' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '16px 16px 8px' }}>
            <img src="/characters/cristal-portrait-mobile.jpg" alt="Portrait de Cristal" width="64" height="74" style={{ width: 64, height: 74, borderRadius: 13, objectFit: 'cover', border: '1px solid #b99457' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#e5c88d', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Votre accueil personnel</div>
              <strong style={{ fontFamily: 'Georgia,serif', fontSize: 27, fontWeight: 500 }}>Cristal</strong>
              <div style={{ fontSize: 12, color: '#b8b0a7' }}>Gérante virtuelle de l'agence</div>
            </div>
            <button type="button" aria-label="Fermer la fenêtre Cristal" onClick={() => setOpen(false)} style={{ background: 'transparent', border: 0, color: '#f7f3ec', fontSize: 25, alignSelf: 'flex-start', cursor: 'pointer' }}>×</button>
          </div>
          <p style={{ padding: '0 17px', lineHeight: 1.55, fontSize: 14, color: '#e4ddd3' }}>Bonjour et bienvenue à l'Agence Cristal. Une question sur nos personnages ou sur le fonctionnement du site ? Je suis là pour vous orienter.</p>
          <p style={{ padding: '0 17px', lineHeight: 1.5, fontSize: 12, color: '#b8b0a7' }}>Le dialogue IA en direct est en préparation. Pour l'instant, contactez l'agence par e-mail.</p>
          <a href={emailHref} style={{ display: 'block', margin: '0 16px 16px', padding: '13px 16px', textAlign: 'center', textDecoration: 'none', borderRadius: 999, background: 'linear-gradient(135deg,#e8c983,#ad7f3f)', color: '#17110a', fontWeight: 800, fontSize: 14 }}>Écrire à Cristal par e-mail</a>
        </section>
      )}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Fermer le contact Cristal' : 'Parler à Cristal'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', gap: 9, border: '1px solid #b99457', borderRadius: 999, background: '#1b1510', color: '#f4dfb2', boxShadow: '0 7px 26px rgba(0,0,0,.55)', padding: '13px 17px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
        <span aria-hidden="true" style={{ fontSize: 18 }}>◇</span>
        {open ? 'Fermer' : 'Parler à Cristal'}
      </button>
    </aside>
  )
}
