import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agence Cristal',
  description: 'Compagnes virtuelles IA premium — personnages fictifs adultes.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
