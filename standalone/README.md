# ShareStream - Version Autonome & Déploiement

Cette version autonome comprend tout le nécessaire pour être hébergée sur n'importe quel serveur HTTP standard (Apache, Nginx, GitHub Pages, Firebase Hosting, Vercel) sans étape de build Node.js.

### 📦 Structure des fichiers
- `index.html` : Interface utilisateur et structure HTML
- `style.css` : Feuilles de style avec responsive design
- `app.js` : Moteur applicatif, gestion du catalogue et synchronisation Firestore
- `translations.js` : Module bilingue FR / EN
- `firebase-config.js` : Configuration des identifiants Firebase Firestore & Auth
- `service-worker.js` : Mise en cache et support hors-ligne PWA
- `manifest.json` : Métadonnées d'installation smartphone (Android / iOS)

### 🚀 Déploiement rapide sur Firebase Hosting
1. Installez le CLI Firebase : `npm install -g firebase-tools`
2. Connectez-vous : `firebase login`
3. Initialisez dans ce dossier : `firebase init hosting`
4. Déployez en une commande : `firebase deploy`