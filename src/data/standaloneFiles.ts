export interface StandaloneFile {
  name: string;
  lang: string;
  path: string;
  code: string;
  description: string;
}

export const STANDALONE_PWA_FILES: Record<string, StandaloneFile> = {
  'index.html': {
    name: 'index.html',
    lang: 'html',
    path: 'index.html',
    description: "Point d'entrée principal avec balises PWA, mise en page sombre et conteneurs dynamiques",
    code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ShareStream - Location & Partage de Comptes Streaming</title>
  <meta name="theme-color" content="#0F0F12" />

  <!-- PWA Manifest & Favicons -->
  <link rel="manifest" href="./manifest.json" />
  <link rel="icon" type="image/svg+xml" href="/icon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Feuille de style CSS moderne -->
  <link rel="stylesheet" href="./style.css" />
</head>
<body>

  <!-- En-tête de navigation -->
  <header>
    <div class="container header-content">
      <div class="brand" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
        <div class="brand-icon">▶</div>
        <div>
          <span class="brand-title">ShareStream</span>
          <span class="badge-tag">PWA Standalone</span>
        </div>
      </div>

      <div class="nav-actions">
        <div class="badge-cloud">
          <span class="badge-cloud-dot"></span>
          <span>Firestore Cloud</span>
        </div>

        <button id="btn-open-reservations" class="btn-icon">
          <span>📦</span>
          <span data-i18n="myReservations">Mes Réservations</span>
        </button>

        <div class="lang-switch">
          <button id="btn-lang-fr" class="lang-btn active">FR</button>
          <button id="btn-lang-en" class="lang-btn">EN</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Contenu Principal -->
  <main class="container">
    <section class="hero">
      <h1 data-i18n="appSubtitle">Location & Partage de Comptes Streaming</h1>
      <p data-i18n="tagline">Profitez de vos abonnements premium favoris à tarif solidaire et partagé en Afrique de l'Ouest.</p>

      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          id="search-input" 
          type="text" 
          data-i18n-placeholder="searchPlaceholder" 
          placeholder="Rechercher une plateforme ou une offre..." 
        />
      </div>

      <div class="filter-tabs">
        <button class="tab-btn active" data-category="all" data-i18n="allCategories">Tous</button>
        <button class="tab-btn" data-category="netflix">Netflix</button>
        <button class="tab-btn" data-category="spotify">Spotify</button>
        <button class="tab-btn" data-category="disney+">Disney+</button>
        <button class="tab-btn" data-category="youtube">YouTube</button>
        <button class="tab-btn" data-category="prime">Prime Video</button>
        <button class="tab-btn" data-category="chatgpt">ChatGPT</button>
      </div>
    </section>

    <!-- Grille des Offres Firestore -->
    <section id="catalog-grid" class="catalog-grid"></section>
  </main>

  <!-- Modal Réservations Utilisateur -->
  <div id="reservations-modal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" data-i18n="myReservations">Mes Réservations</h3>
        <button id="modal-close-btn" class="modal-close">&times;</button>
      </div>
      <div id="reservations-list"></div>
      <div style="margin-top: 1.5rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <p style="font-size: 0.8rem; color: var(--text-dim);">
          Service client WhatsApp : 
          <a href="https://wa.me/221777059102" target="_blank" style="color: var(--color-whatsapp); font-weight: 700; text-decoration: none;">+221 77 705 91 02</a>
        </p>
      </div>
    </div>
  </div>

  <div id="toast-container" class="toast-container"></div>

  <footer>
    <div class="container">
      <p>© 2026 ShareStream. PWA Pure HTML/JS/CSS/Firebase. WhatsApp : <strong>+221 77 705 91 02</strong></p>
    </div>
  </footer>

  <!-- Application Logic ES Module -->
  <script type="module" src="./app.js"></script>
</body>
</html>`
  },

  'manifest.json': {
    name: 'manifest.json',
    lang: 'json',
    path: 'manifest.json',
    description: "Manifeste Web App standard pour installation sur l'écran d'accueil Android et iOS",
    code: `{
  "name": "ShareStream - Location de Comptes Streaming",
  "short_name": "ShareStream",
  "description": "Plateforme solidaire de partage et location de comptes streaming premium en FCFA",
  "start_url": "./index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0F0F12",
  "theme_color": "#0F0F12",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["entertainment", "utilities", "shopping"]
}`
  },

  'service-worker.js': {
    name: 'service-worker.js',
    lang: 'javascript',
    path: 'service-worker.js',
    description: "Worker de cache hors-ligne avec stratégie Network-First et fallback automatique",
    code: `// Service Worker PWA pour ShareStream
const CACHE_NAME = 'sharestream-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './translations.js',
  './firebase-config.js',
  './manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW Standalone] Mise en cache des ressources');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});`
  },

  'firebase-config.js': {
    name: 'firebase-config.js',
    lang: 'javascript',
    path: 'firebase-config.js',
    description: "Configuration officielle Firebase v10 et connexion Cloud Firestore",
    code: `// Firebase Configuration pour ShareStream PWA (Firestore + Authentication)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  onSnapshot, 
  setDoc, 
  updateDoc,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAMseI4KUxanP8C_u91t3dNJg4D5DDj19M",
  authDomain: "sharestream-2f374.firebaseapp.com",
  projectId: "sharestream-2f374",
  storageBucket: "sharestream-2f374.firebasestorage.app",
  messagingSenderId: "33094694566",
  appId: "1:33094694566:web:47bb1b90db244fc6d3a667",
  measurementId: "G-Y516R9GBC3"
};

// Initialisation de l'application Firebase
export const app = initializeApp(firebaseConfig);

// Base de données Firestore (Pas de Realtime Database)
export const db = getFirestore(app);

// Authentication Firebase
export const auth = getAuth(app);

export { 
  collection, 
  doc, 
  getDocs, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};`
  },

  'app.js': {
    name: 'app.js',
    lang: 'javascript',
    path: 'app.js',
    description: "Logique applicative JavaScript, réactivité temps réel Firestore, commandes WhatsApp",
    code: `// Application Logic ShareStream
import { db, collection, doc, onSnapshot, setDoc, updateDoc } from './firebase-config.js';
import { translations, t } from './translations.js';

const FALLBACK_ACCOUNTS = [
  {
    id: "acc-1",
    name: "Netflix Premium 4K",
    platform: "Netflix",
    price: 2500,
    status: "available",
    description: "Accès profil privé Ultra HD 4K avec audio spatial.",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
    quality: "4K HDR"
  },
  {
    id: "acc-2",
    name: "Spotify Famille Individuel",
    platform: "Spotify",
    price: 1500,
    status: "available",
    description: "Musique illimitée sans pub, son très haute fidélité.",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800",
    quality: "Lossless"
  },
  {
    id: "acc-3",
    name: "Disney+ Privilège",
    platform: "Disney+",
    price: 2000,
    status: "available",
    description: "Marvel, Star Wars, Pixar, Disney en streaming 4K.",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    quality: "4K UHD"
  }
];

const state = {
  lang: localStorage.getItem('sharestream_lang') || 'fr',
  currentCategory: 'all',
  searchQuery: '',
  accounts: FALLBACK_ACCOUNTS,
  reservations: [],
  currentUser: {
    id: "uid_firebase",
    name: "Jean Dupont",
    email: "jean@email.com"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initLanguageSwitcher();
  initSearchAndFilters();
  initFirestoreLiveSync();
  initModalListeners();
  renderApp();
});

function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => console.log('[PWA] SW actif:', reg.scope))
        .catch((err) => console.warn('[PWA] SW:', err));
    });
  }
}

function initFirestoreLiveSync() {
  try {
    const accountsCol = collection(db, 'accounts');
    onSnapshot(accountsCol, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = [];
        snapshot.forEach((docSnap) => loaded.push({ id: docSnap.id, ...docSnap.data() }));
        state.accounts = loaded;
        renderAccounts();
      }
    });

    const reservationsCol = collection(db, 'reservations');
    onSnapshot(reservationsCol, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = [];
        snapshot.forEach((docSnap) => loaded.push({ id: docSnap.id, ...docSnap.data() }));
        state.reservations = loaded;
        renderReservationsModal();
      }
    });
  } catch (err) {
    console.warn('[Firestore] Sync offline');
  }
}

function initLanguageSwitcher() {
  const btnFr = document.getElementById('btn-lang-fr');
  const btnEn = document.getElementById('btn-lang-en');

  btnFr?.addEventListener('click', () => {
    state.lang = 'fr';
    localStorage.setItem('sharestream_lang', 'fr');
    btnFr.classList.add('active');
    btnEn?.classList.remove('active');
    renderApp();
  });

  btnEn?.addEventListener('click', () => {
    state.lang = 'en';
    localStorage.setItem('sharestream_lang', 'en');
    btnEn.classList.add('active');
    btnFr?.classList.remove('active');
    renderApp();
  });
}

function initSearchAndFilters() {
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderAccounts();
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.getAttribute('data-category') || 'all';
      renderAccounts();
    });
  });
}

function initModalListeners() {
  const modal = document.getElementById('reservations-modal');
  document.getElementById('btn-open-reservations')?.addEventListener('click', () => {
    modal?.classList.add('active');
    renderReservationsModal();
  });
  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });
}

function renderApp() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'), state.lang);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'), state.lang);
  });
  renderAccounts();
}

function renderAccounts() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const filtered = state.accounts.filter((acc) => {
    const matchCategory = state.currentCategory === 'all' || 
      acc.platform.toLowerCase() === state.currentCategory.toLowerCase();
    const matchSearch = !state.searchQuery || 
      acc.name.toLowerCase().includes(state.searchQuery) || 
      acc.platform.toLowerCase().includes(state.searchQuery);
    return matchCategory && matchSearch;
  });

  grid.innerHTML = filtered.map((acc) => {
    const isAvailable = acc.status !== 'reserved';
    const statusText = isAvailable ? t('available', state.lang) : t('reserved', state.lang);
    const statusClass = isAvailable ? 'status-available' : 'status-reserved';
    const rawMsg = t('whatsappOrderMessage', state.lang, {
      name: acc.name,
      platform: acc.platform,
      price: (acc.price || 0).toLocaleString()
    });
    const waUrl = 'https://wa.me/221777059102?text=' + encodeURIComponent(rawMsg);
    const displayImg = acc.imageUrl || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800';
    const displayPrice = (acc.price || 0).toLocaleString();
    const displayQuality = acc.quality || '4K UHD';
    const disabledAttr = !isAvailable ? 'disabled style="opacity: 0.5;"' : '';

    return '<div class="card">' +
      '<div class="card-media">' +
        '<img src="' + displayImg + '" alt="' + acc.name + '" />' +
        '<span class="card-platform-badge">' + acc.platform + '</span>' +
        '<span class="card-status-badge ' + statusClass + '">' + statusText + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-title">' + acc.name + '</h3>' +
        '<p class="card-desc">' + (acc.description || '') + '</p>' +
        '<div class="card-meta">' +
          '<div>' +
            '<span class="price-tag">' + displayPrice + '</span>' +
            '<span class="price-suffix"> FCFA / mois</span>' +
          '</div>' +
          '<span style="font-size: 0.75rem; color: var(--text-muted);">' + displayQuality + '</span>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="btn-primary" onclick="window.handleReserve(\'' + acc.id + '\')" ' + disabledAttr + '>' +
            t('reserveBtn', state.lang) +
          '</button>' +
          '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-whatsapp">WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

window.handleReserve = async function(accountId) {
  const account = state.accounts.find(a => a.id === accountId);
  if (!account) return;

  const newRes = {
    id: 'res-' + Date.now(),
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    userEmail: state.currentUser.email,
    accountId: account.id,
    accountName: account.name,
    platform: account.platform,
    price: account.price,
    reservedAt: Date.now(),
    status: 'active'
  };

  try {
    await setDoc(doc(db, 'reservations', newRes.id), newRes);
    await updateDoc(doc(db, 'accounts', account.id), { status: 'reserved' });
  } catch (e) {
    console.warn('Backup local');
  }

  state.reservations.unshift(newRes);
  account.status = 'reserved';
  renderAccounts();
  alert('Réservation effectuée avec succès !');
};

function renderReservationsModal() {
  const listEl = document.getElementById('reservations-list');
  if (!listEl) return;
  listEl.innerHTML = state.reservations.map(r => 
    '<div style="background: #1C1C24; padding: 1rem; border-radius: 12px; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">' +
      '<div>' +
        '<strong>' + r.accountName + '</strong> (' + r.platform + ')' +
        '<div style="font-size: 0.8rem; color: #9CA3AF;">' + new Date(r.reservedAt).toLocaleDateString() + '</div>' +
      '</div>' +
      '<div style="font-weight: 800; color: #3B82F6;">' + (r.price || 0).toLocaleString() + ' FCFA</div>' +
    '</div>'
  ).join('') || '<p style="text-align: center; color: #6B7280;">Aucune réservation</p>';
}`
  },

  'style.css': {
    name: 'style.css',
    lang: 'css',
    path: 'style.css',
    description: "Design system CSS moderne avec variables, thème sombre et composants interactifs",
    code: `:root {
  --bg-main: #0F0F12;
  --bg-card: #16161D;
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-success: #10B981;
  --color-whatsapp: #25D366;
  --text-main: #FFFFFF;
  --text-muted: #9CA3AF;
  --text-dim: #6B7280;
  --border-color: rgba(255, 255, 255, 0.08);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: var(--bg-main); color: var(--text-main); font-family: system-ui, sans-serif; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.25rem; }
header { position: sticky; top: 0; z-index: 50; background: rgba(15, 15, 18, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); }
.header-content { display: flex; align-items: center; justify-content: space-between; height: 4.25rem; }
.brand { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.brand-icon { width: 2.5rem; height: 2.5rem; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--color-primary); }
.brand-title { font-size: 1.25rem; font-weight: 800; color: var(--color-primary); }
.badge-tag { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 6px; background: rgba(59, 130, 246, 0.15); color: var(--color-primary); margin-left: 0.5rem; }
.badge-cloud { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.badge-cloud-dot { width: 6px; height: 6px; border-radius: 50%; background-color: var(--color-success); }
.nav-actions { display: flex; align-items: center; gap: 0.75rem; }
.lang-switch { display: flex; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); border-radius: 9999px; padding: 3px; }
.lang-btn { background: none; border: none; color: var(--text-muted); font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 9999px; cursor: pointer; }
.lang-btn.active { background: #374151; color: #FFF; }
.btn-icon { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-main); padding: 0.5rem 0.85rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.hero { padding: 3rem 0 2rem 0; text-align: center; }
.hero h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.75rem; }
.hero p { color: var(--text-muted); font-size: 1rem; max-width: 600px; margin: 0 auto 1.75rem auto; }
.search-box { position: relative; max-width: 540px; margin: 0 auto 1.5rem auto; }
.search-box input { width: 100%; background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem 0.85rem 3rem; border-radius: 12px; color: #FFF; font-size: 0.95rem; outline: none; }
.search-box .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
.filter-tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }
.tab-btn { background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.85rem; font-weight: 600; padding: 0.5rem 1.2rem; border-radius: 9999px; cursor: pointer; }
.tab-btn.active { background: var(--color-primary); color: #FFF; border-color: var(--color-primary); }
.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
.card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s ease; }
.card:hover { transform: translateY(-4px); }
.card-media { position: relative; height: 160px; background: #000; }
.card-media img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
.card-platform-badge { position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(0, 0, 0, 0.75); color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 6px; }
.card-status-badge { position: absolute; top: 0.75rem; right: 0.75rem; font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; }
.status-available { background: rgba(16, 185, 129, 0.9); color: #FFF; }
.status-reserved { background: rgba(239, 68, 68, 0.9); color: #FFF; }
.card-body { padding: 1.25rem; display: flex; flex-direction: column; flex: 1; }
.card-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem; }
.card-desc { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; flex: 1; }
.card-meta { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem; }
.price-tag { font-size: 1.35rem; font-weight: 800; color: var(--color-primary); }
.price-suffix { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
.card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
.btn-primary { background: var(--color-primary); color: #FFF; border: none; font-weight: 700; font-size: 0.85rem; padding: 0.7rem; border-radius: 12px; cursor: pointer; text-align: center; }
.btn-whatsapp { background: var(--color-whatsapp); color: #FFF; border: none; font-weight: 700; font-size: 0.85rem; padding: 0.7rem; border-radius: 12px; cursor: pointer; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px); z-index: 100; align-items: center; justify-content: center; padding: 1rem; }
.modal-overlay.active { display: flex; }
.modal-content { background: #13131A; border: 1px solid var(--border-color); border-radius: 20px; max-width: 520px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 1.5rem; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; }
.modal-title { font-size: 1.2rem; font-weight: 700; }
.modal-close { background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; }
footer { border-top: 1px solid var(--border-color); padding: 2rem 0; text-align: center; color: var(--text-dim); font-size: 0.85rem; }`
  },

  'translations.js': {
    name: 'translations.js',
    lang: 'javascript',
    path: 'translations.js',
    description: "Dictionnaire bilingue Français / Anglais complet avec interpolation de variables",
    code: `export const translations = {
  fr: {
    appName: "ShareStream",
    appSubtitle: "Location & Partage de Comptes Streaming",
    tagline: "Profitez de vos abonnements premium favoris à tarif solidaire et partagé.",
    searchPlaceholder: "Rechercher une plateforme ou une offre...",
    allCategories: "Tous",
    available: "Disponible",
    reserved: "Réservé / Loué",
    reserveBtn: "Réserver",
    whatsappBtn: "WhatsApp",
    myReservations: "Mes Réservations",
    noReservations: "Aucune réservation pour l'instant.",
    currency: "FCFA",
    whatsappOrderMessage: "Bonjour, je souhaite louer le compte {name} ({platform}) à {price} FCFA/mois. Merci !"
  },
  en: {
    appName: "ShareStream",
    appSubtitle: "Streaming Accounts Sharing & Rental",
    tagline: "Enjoy your favorite premium streaming subscriptions at shared, affordable rates.",
    searchPlaceholder: "Search by platform or account...",
    allCategories: "All",
    available: "Available",
    reserved: "Reserved / Rented",
    reserveBtn: "Rent now",
    whatsappBtn: "WhatsApp",
    myReservations: "My Reservations",
    noReservations: "No reservations yet.",
    currency: "FCFA",
    whatsappOrderMessage: "Hello, I would like to rent the {name} ({platform}) account for {price} FCFA/month. Thank you!"
  }
};

export function t(key, lang = 'fr', params = {}) {
  const dict = translations[lang] || translations.fr;
  let text = dict[key] || translations.fr[key] || key;
  Object.keys(params).forEach(p => {
    text = text.replace(new RegExp('\\\\{' + p + '\\\\}', 'g'), params[p]);
  });
  return text;
}`
  },

  'README.md': {
    name: 'README.md',
    lang: 'markdown',
    path: 'README.md',
    description: "Guide étape par étape de déploiement sur Firebase Hosting, GitHub Pages et serveurs Web",
    code: [
      "# 🚀 ShareStream - PWA Standalone Deployment Guide",
      "",
      "## Déploiement sur Firebase Hosting (Gratuit & SSL Automatique)",
      "",
      "1. Installez les outils Firebase CLI :",
      "```bash",
      "npm install -g firebase-tools",
      "```",
      "",
      "2. Connectez-vous à votre compte Google :",
      "```bash",
      "firebase login",
      "```",
      "",
      "3. Initialisez le projet dans ce dossier :",
      "```bash",
      "firebase init hosting",
      "```",
      "- Sélectionnez votre projet existant : velvety-artifact-hpthm",
      "- Répertoire public : . (le dossier courant)",
      "- Single-page app : N",
      "- Overwrite index.html : N",
      "",
      "4. Déployez en production :",
      "```bash",
      "firebase deploy --only hosting",
      "```",
      "",
      "Votre application est immédiatement disponible en ligne avec Firestore connecté en temps réel !"
    ].join('\n')
  }
};