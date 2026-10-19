# Agence Cristal — audit de sécurité (19 octobre 2026)

## Constats vérifiés dans le code

- `src/app/api/chat/route.ts` accepte les appels sans vérification de session et transmet les messages à OpenRouter.
- Aucune limitation de fréquence côté serveur n'est visible dans cette route.
- Les messages reçus ne font pas l'objet d'une validation stricte de structure, taille et rôle.
- La route accepte un nom de personnage arbitraire via une personnalité de repli.
- En cas d'échec d'OpenRouter, la route renvoie le détail brut de l'erreur au navigateur.
- `src/app/chat/[id]/page.tsx` stocke l'historique dans `localStorage` par personnage, sans séparation par compte.
- Le contrôle d'âge privé repose sur une valeur `localStorage` modifiable par le navigateur : ce n'est pas une preuve d'âge serveur.

## Plan d'intervention, avant déploiement

1. Authentifier chaque appel à `/api/chat` côté serveur (session Supabase vérifiée) et refuser les appels anonymes, sauf mode démo explicitement séparé et bridé.
2. Appliquer une limitation de fréquence et un quota par utilisateur dans un stockage partagé, compatible avec les instances serverless. Refuser les dépassements avec HTTP 429.
3. Valider les entrées avec schéma strict : personnages autorisés, rôles `user|assistant`, tailles des messages, nombre et volume total. Limiter aussi les coûts via les paramètres OpenRouter et les plafonds du compte.
4. Ne jamais exposer les erreurs détaillées du fournisseur au client; journaliser sans données privées ni secrets.
5. Concevoir les tables Supabase conversations/messages avec `user_id`, politiques RLS, et tests de cloisonnement entre deux comptes.
6. Faire vérifier les jetons AgePass côté serveur, y compris signature, expiration, audience et protection contre la réutilisation selon le protocole retenu.
7. Tester les cas normaux et abusifs en préproduction, puis soumettre les changements à revue avant fusion et déploiement.

## Tests d'acceptation

- Un appel sans session valide ne déclenche aucun appel payant OpenRouter.
- Les rafales et quotas dépassés renvoient HTTP 429 et n'engendrent pas de coût OpenRouter.
- Les personnages non autorisés et messages malformés sont rejetés.
- Un utilisateur A ne peut ni lire ni écrire les messages d'un utilisateur B.
- Une simple modification de `localStorage` ne donne aucun accès privé vérifié.
- Les trois personnages répondent toujours normalement après correction.

**Statut :** audit documentaire seulement. Aucune correction appliquée au code de production; aucun test de déploiement réalisé.
