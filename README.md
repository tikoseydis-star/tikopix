# TikoPix

**Visual stories, captured with intention.** Site portfolio de Djonko Seydi (TikoPix), photographe et vidéaste à Montréal.

Next.js 16 · Tailwind 4 · Motion · Lenis · React Three Fiber · Sanity Studio

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3010 (redirige vers /fr ou /en)
```

Sans configuration, le site tourne sur du **contenu de démo** (`lib/seed.ts`, photos Unsplash/Pexels). Dès que le Studio contient des projets, le vrai contenu remplace la démo automatiquement (collection par collection).

## Bilingue FR / EN

- URLs : `/fr/...` et `/en/...`. La racine `/` redirige selon le choix mémorisé (cookie `tikopix-lang`), sinon la langue du navigateur, sinon le français (règles de redirection dans `next.config.ts`).
- Sélecteur **FR / EN** dans le header : reste sur la même page.
- Textes d'interface : `lib/i18n.ts` (dictionnaires FR + EN).
- Contenu : chaque champ texte du Studio a un jumeau **(English)** optionnel. S'il est vide, la version anglaise affiche le texte français.
- SEO : `canonical` + `hreflang` sur chaque page, sitemap avec alternates.

## Pages

| Route | Contenu |
|---|---|
| `/[lang]` | Hero vidéo + intro diaphragme, spécialités (cartes 3D tilt), projets en vedette, showreel qui s'agrandit au scroll, bandeau, **objectif 3D** (WebGL) dont le diaphragme s'ouvre au scroll, À propos, CTA |
| `/[lang]/work` | Tous les projets, filtres par catégorie (`?cat=sport`) |
| `/[lang]/work/[slug]` | Étude de projet : couverture, infos, quelques mots, galerie, vidéo, projet suivant |
| `/[lang]/photo` | Mur masonry de toutes les photos + lightbox (clavier, swipe) |
| `/[lang]/video` | Showreel + vidéos (aperçu au survol, lecture avec son au clic) |
| `/[lang]/about` | Présentation, compétences, façon de travailler |
| `/[lang]/contact` | Formulaire (Resend) + coordonnées |
| `/studio` | **Espace admin de Tiko** (Sanity Studio) |

## Le Studio : comment Tiko ajoute ses créations

1. Aller sur **tikopix.com/studio** et se connecter (compte Sanity, Google ou courriel).
2. **Projets → +** : titre, catégorie, « quelques mots », image principale.
3. (Optionnel) remplir les champs **(English)** pour la version anglaise.
4. Onglet **Photos & vidéo** : glisser-déposer plusieurs photos d'un coup dans *Galerie* (réordonnables), et/ou un MP4 ou un lien YouTube/Vimeo.
5. Cocher **Mettre en vedette** pour l'afficher sur l'accueil (les 4 premiers).
6. **Publish**. Le site se met à jour en moins d'une minute (instantané avec le webhook).

Le point focal (hotspot) de chaque image se règle en cliquant sur l'image : le recadrage du site le respecte.
**Réglages du site** permet de changer le texte d'accueil, la vidéo de fond, le showreel, le portrait, les compétences, le courriel et les réseaux.

## Mise en place de Sanity (une fois)

1. Créer un projet gratuit sur <https://www.sanity.io/manage> (dataset `production`).
2. Mettre le Project ID dans `NEXT_PUBLIC_SANITY_PROJECT_ID` (`.env.local` + Vercel).
3. **API → CORS origins** : ajouter `http://localhost:3010` et l'URL du site (cocher *Allow credentials*).
4. **Members** : inviter Tiko en *Editor*.
5. (Optionnel) **API → Webhooks** : URL `https://tikopix.com/api/revalidate`, secret = `SANITY_REVALIDATE_SECRET`.

## Formulaire de contact

Créer une clé sur <https://resend.com>, renseigner `RESEND_API_KEY` et `CONTACT_TO_EMAIL`. Sans clé, le formulaire affiche un message invitant à écrire directement par courriel (rien n'est perdu silencieusement).

## Déploiement

Vercel : importer le repo, ajouter les variables de `.env.example`, déployer. Les pages sont statiques et revalidées toutes les 60 s.

## Structure

```
app/[lang]/          pages publiques FR/EN (layout racine : header, footer, intro, curseur, smooth scroll)
app/studio/          Sanity Studio embarqué
app/api/             contact (Resend), revalidate (webhook Sanity)
components/motion/   Reveal, MaskLines, Intro (diaphragme), Cursor, Magnetic, SmoothScroll
components/sections/ sections de pages
components/three/    LensScene : objectif 3D procédural (R3F)
lib/content.ts       lecture Sanity + repli sur la démo
sanity/              schémas (project, category, settings) + structure du Studio
```

Accessibilité : `prefers-reduced-motion` respecté (pas d'intro, pas de smooth scroll, pas de vidéo de fond), navigation clavier, lien d'évitement, labels ARIA.
