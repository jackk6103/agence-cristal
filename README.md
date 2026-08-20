# Agence Cristal — SaaS V0.2 connecté à Supabase

Cette version reprend l'interface SaaS déjà créée et la relie au projet Supabase **Agence Cristal**.

## État actuel

- application Next.js 16 + React 19 ;
- connexion Supabase configurée ;
- Project URL configuré ;
- Publishable key configurée côté client ;
- authentification par lien magique ;
- création de personnage utilisateur ;
- personnages signature Freyja, Amara et Nezuko ;
- écran de chat responsive ;
- base Supabase composée de 6 tables :
  - `profiles`
  - `characters`
  - `conversations`
  - `messages`
  - `memories`
  - `subscriptions`
- RLS activé sur les 6 tables ;
- réponse de chat encore locale/démonstration : le vrai modèle IA sera le prochain jalon.

## Variables Supabase

Le projet utilise :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

La configuration locale se trouve dans `.env.local`.

**Ne jamais ajouter à cette application une clé `sb_secret_...`, une clé `service_role`, un mot de passe PostgreSQL ou un secret de paiement.**

`.env.local` est exclu de Git par `.gitignore`.

## Important : base déjà créée

La base du projet Supabase **Agence Cristal** a déjà été créée dans le Dashboard.

Ne relance pas `supabase/RECOVERY_REBUILD_V1.sql` sur une base contenant des utilisateurs ou des données : ce fichier est uniquement une copie de secours du script de reconstruction utilisé pendant l'installation initiale et il supprime les tables avant de les recréer.

## Installation locale

Node.js 20.9+ est requis par Next.js 16.

```bash
npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

## Authentification Supabase

Avant de tester le lien magique sur une adresse publique, il faudra configurer dans Supabase les URLs autorisées pour le site déployé et le callback `/auth/callback`.

## Prochain jalon

1. déployer l'application ;
2. tester l'inscription/connexion réelle ;
3. vérifier la création d'un personnage dans Supabase ;
4. créer automatiquement une conversation ;
5. brancher le vrai modèle IA côté serveur ;
6. enregistrer messages et mémoire ;
7. seulement ensuite brancher l'abonnement.
