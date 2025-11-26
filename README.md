# Italie — 2 cartes

Version statique — Mapbox + Vue (CDN)

Ce dépôt a été converti en une version entièrement statique : tout le code nécessaire pour afficher les cartes est dans `index.html` et `static/standalone.js` (utilisant Vue via CDN). Tu peux ouvrir la page directement avec `file://` ou la servir depuis n'importe quel serveur statique.

---

## Usage — version statique

Tu peux utiliser le projet de deux façons simples :

- Ouvrir directement le fichier (file://) — double-clique sur `index.html` dans ton explorateur de fichiers.
- Le servir via un serveur HTTP simple (ex. pour tester sur un appareil mobile).

Exemples de serveur HTTP simple :

```bash
# Python 3
python3 -m http.server 8000

# ou, si tu as Node.js installé mais ne veux pas Vite
npx http-server -p 8000
```

Ensuite ouvre dans ton navigateur : http://localhost:8000/

---

Mapbox nécessite un token — deux façons de le fournir :

- Dans l'URL :

  file:///chemin/vers/index.html?token=TON_MAPBOX_TOKEN

- Ou dans le fichier :

  Édite `static/standalone.js` (attention : évite de committer un token réel dans le repo). La méthode par URL est recommandée.

Si le token est absent, la page affichera une erreur expliquant comment l'ajouter.

---

## Déploiement

Le site est prêt à être servi tel quel (les fichiers statiques sont `index.html`, `static/standalone.js` et `src/assets/*`). Copie-les sur n'importe quel hébergeur de fichiers statiques (GitHub Pages, Netlify, S3, etc.).

### Déploiement sur Vercel (avec token sécurisé)

Si tu veux rendre le site public sans demander le token aux utilisateur·ices, la méthode recommandée est :

1. Créer un token Mapbox public (pk._) et **restreindre** ce token dans le tableau de bord Mapbox aux domaines autorisés (ex: `_.vercel.app`et`localhost` pour dev). Cela empêche l'utilisation du token depuis d'autres sites.

2. Dans ton projet Vercel, ajoute une variable d'environnement nommée `MAPBOX_TOKEN` (Settings → Environment Variables) et colle ton token public `pk.*`.

3. Définis la commande de build dans Vercel :

```bash
# build command
npm run build

# output directory (pour servir le site statique) :
.
```

Le build exécute `scripts/inject-token.js` et écrit `static/config.js` contenant le token (non commité dans le repo). `index.html` charge `static/config.js` au runtime, donc les visiteur·ices ne voient pas le token dans les sources du dépôt et n'ont rien à fournir.

Important : même si le token n'est pas dans le repo, il est nécessaire côté client pour Mapbox et reste visible par des usagers avancés (outils réseau). La restriction d'origine (Mapbox dashboard) empêche l'abus du token depuis d'autres domaines.

---

## Dépannage rapide

### Dépannage rapide

- Page vide ou erreurs JS ? Ouvre la console devtools (F12) pour voir le message. Si l'erreur concerne Mapbox (`mapboxgl` ou token manquant), fournis un token via l'URL.
- Si les tuiles Mapbox n'apparaissent pas : vérifie que le token est valide et que l'accès réseau est disponible.

---

## Sécurité

### Sécurité

Ne commite jamais de token privé dans le dépôt (même si tu peux localement copier un token dans `static/standalone.js`, évite de le pousser). Utilise la méthode URL pour les tests rapides.

---

Si tu veux que je repasse le projet en mode développeur (avec Vite et SFCs) ou que je nettoie encore plus le dépôt, dis-le et je m'en occuperai.
