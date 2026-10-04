# Stracity

Collection de mini-jeux créée avec Vue 3, Vite et Tailwind CSS : morpion, Memory, Snake et 2048. Les autres jeux affichés sont en préparation.

## Développement

Node.js 22.19 ou ultérieur compatible avec Vite 7.

```sh
npm ci
npm run dev
```

Le terminal reste ouvert pendant que le serveur fonctionne. Si les fichiers sont sur iCloud, conserver le dossier téléchargé dans Finder.

## Tests

```sh
npm ci
npm test            # Vitest : routage/404, contact, accessibilité de la modale, nginx/Dockerfile
npm run audit:prod  # npm audit --omit=dev
```

## Production

```sh
npm run build
docker build -t stracity .
docker run --rm -p 8080:8080 stracity
```

Docker compile les sources puis sert uniquement les fichiers statiques avec Nginx non-root (UID 101, port **8080**), images épinglées au digest. Les routes `/accueil`, `/jeux`, `/contact`, `/mentions-legales` et `/confidentialite` fonctionnent aussi en accès direct ; toute autre URL renvoie un vrai statut 404 (page « introuvable » du site). Aucune base de données ni variable secrète : voir `.env.example`.

Dans Dokploy : dépôt `tbirostweb/stracity`, branche `main`, build Dockerfile, chemin `Dockerfile`, contexte `.`, **port du domaine `8080`** (changé depuis 80). Sonde HTTP : `/healthz`. À régler côté Dokploy/VPS (hors dépôt) : HTTPS + redirection 80→443, HSTS au reverse proxy après validation HTTPS, limites CPU/RAM, restart policy, `read_only`/`cap_drop: ALL`/`no-new-privileges` si possible (nginx-unprivileged a besoin de /tmp inscriptible), rétention et accès des journaux, sauvegarde du dépôt/config Dokploy, alertes uptime/5xx/certificat.

## Points à compléter par l'exploitant

- Mentions légales et confidentialité : marqueurs `[À COMPLÉTER : ...]` dans `src/pages/`.
- Formulaire de contact : désactivé (`CONTACT_ENABLED = false` dans `src/pages/Contact.vue`) tant que destinataire/canal ne sont pas fournis.
- Domaine public : canonical, `og:url`, `og:image`, `sitemap.xml` et ligne `Sitemap:` de `public/robots.txt`.
