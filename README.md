# Stracity

Collection de mini-jeux créée avec Vue 3, Vite et Tailwind CSS : morpion, Memory, Snake et 2048. Les autres jeux affichés sont en préparation.

## Développement

Node.js 22.19 ou ultérieur compatible avec Vite 7.

```sh
npm ci
npm run dev
```

Le terminal reste ouvert pendant que le serveur fonctionne. Si les fichiers sont sur iCloud, conserver le dossier téléchargé dans Finder.

## Production

```sh
npm run build
docker build -t stracity .
docker run --rm -p 8080:80 stracity
```

Docker compile les sources puis sert uniquement les fichiers statiques avec Nginx. Les routes `/accueil`, `/jeux` et `/contact` fonctionnent aussi lors d’un accès direct. Aucune base de données ni variable secrète nécessaire.

Dans Dokploy : dépôt `tbirostweb/stracity`, branche `main`, build Dockerfile, chemin `Dockerfile`, contexte `.`, port du domaine `80`. Sonde HTTP : `/healthz`.
