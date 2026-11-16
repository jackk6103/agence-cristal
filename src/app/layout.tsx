import type { Metadata } from 'next'
import './globals.css'
import CristalContact from '@/components/CristalContact'

export const metadata: Metadata = {
  title: 'Agence Cristal',
  description: 'Compagnes virtuelles IA premium — personnages fictifs adultes.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}<CristalContact /></body>
    </html>
  )
}
