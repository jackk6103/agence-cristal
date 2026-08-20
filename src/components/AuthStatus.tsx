import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AuthStatus() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return <Link className="ghost-btn" href="/auth">Connexion</Link>
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims?.sub)

  return <Link className="ghost-btn" href={signedIn ? '/create' : '/auth'}>{signedIn ? 'Mon espace' : 'Connexion'}</Link>
}
