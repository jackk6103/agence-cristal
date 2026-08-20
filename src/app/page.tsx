import Link from 'next/link'
import AdultGate from '@/components/AdultGate'
import AuthStatus from '@/components/AuthStatus'
import CharacterCard from '@/components/CharacterCard'
import { signatureCharacters } from '@/lib/characters'

export default function Home() {
  return (
    <main>
      <AdultGate />
      <div className="ambient ambient-a" />
      <div className="shell">
        <header className="topbar">
          <Link className="brand" href="/"><span className="diamond">◇</span><span><strong>AGENCE</strong><em>CRISTAL</em></span></Link>
          <AuthStatus />
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">PERSONNAGES IA · 18+ · ENTIÈREMENT FICTIFS</p>
            <h1>Une présence.<br/><span>Une personnalité.</span><br/>Votre histoire.</h1>
            <p className="lede">Rencontrez une compagne virtuelle conçue pour se souvenir, évoluer et rester fidèle à sa personnalité — ou créez la vôtre en quelques minutes.</p>
            <div className="hero-actions">
              <a className="primary-btn" href="#profils">Découvrir les profils</a>
              <Link className="secondary-btn" href="/create">Créer ma compagne</Link>
            </div>
            <div className="trust-row"><span>✦ Mémoire personnelle</span><span>✦ Personnalité cohérente</span><span>✦ Pensé mobile</span></div>
          </div>
          <div className="hero-stack" aria-hidden="true">
            {signatureCharacters.map((c, i) => <img key={c.id} className={`stack s${i+1}`} src={c.image} alt="" />)}
          </div>
        </section>

        <section className="section" id="profils">
          <div className="section-head"><div><p className="eyebrow">NOS CRÉATIONS SIGNATURE</p><h2>Qui voulez-vous rencontrer ?</h2></div><p>Trois univers. Trois tempéraments. Une seule règle : elles restent elles-mêmes.</p></div>
          <div className="character-grid">
            {signatureCharacters.map((c) => <CharacterCard key={c.id} character={c} />)}
            <Link className="create-card" href="/create"><div className="create-icon">＋</div><p className="persona">STUDIO CRISTAL</p><h3>Créez la vôtre</h3><p>Prénom, tempérament et univers : le moteur construit une fiche cohérente que vous pourrez faire évoluer.</p><span className="primary-btn">Commencer</span></Link>
          </div>
        </section>
      </div>
    </main>
  )
}
