# 🚀 ShareStream - Plateforme de Location de Comptes Streaming

Plateforme moderne de partage et location d'abonnements de streaming (Netflix, Spotify, Disney+, Prime Video, ChatGPT Plus, YouTube Premium) avec tarification en FCFA et synchronisation Cloud Firestore.

---

## 📁 Structures du Projet Disponibles

Le projet propose deux architectures prêtes à l'emploi :

### 1. Application Web Progressive (PWA) Standalone (`/standalone`)
Projet web autonome sans build tool, prêt pour un déploiement instantané sur Firebase Hosting, GitHub Pages ou hébergeur cPanel :
```text
/standalone/
├── index.html                  # Interface utilisateur HTML5 sémantique & responsive
├── manifest.json               # Manifeste PWA pour installation Android / iOS / Desktop
├── service-worker.js           # Cache hors-ligne, stratégie Network-First & fallback
├── firebase-config.js          # Initialisation du SDK Firebase v10 et Cloud Firestore
├── app.js                      # Logique applicative, temps-réel Firestore, filtres & WhatsApp
├── style.css                   # Thème sombre moderne, design responsive & variables CSS
├── translations.js             # Dictionnaire bilingue Français (FR) & Anglais (EN)
└── README.md                   # Guide complet d'installation et de déploiement