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
<body class="bg-dark text-light antialiased min-h-screen flex flex-col font-sans">
  
  <!-- Navigation Header -->
  <header class="sticky top-0 z-40 backdrop-blur-md bg-dark/90 border-b border-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl">
        S
      </div>
      <div>
        <span class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">ShareStream</span>
        <span class="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Standalone PWA</span>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="flex items-center gap-3">
      <!-- Language Switcher -->
      <button id="langToggleBtn" class="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition flex items-center gap-1.5">
        <span id="currentLangLabel">FR</span>
      </button>

      <!-- PWA Install Prompt Button -->
      <button id="pwaInstallBtn" class="hidden px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        <span data-i18n="installApp">Installer l'application</span>
      </button>

      <!-- Admin Status / WhatsApp direct -->
      <a href="https://wa.me/221777059102" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/30 transition">
        <span>+221 77 705 91 02</span>
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-center">
    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3" data-i18n="heroTitle">
      Vos abonnements streaming préférés au meilleur tarif
    </h1>
    <p class="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-6" data-i18n="heroSubtitle">
      Accédez aux services premium Netflix, Disney+, Spotify et plus avec activation rapide via WhatsApp et paiement sécurisé en FCFA.
    </p>

    <!-- Platform Filter Tabs -->
    <div class="flex items-center justify-center gap-2 flex-wrap" id="filterTabsContainer">
      <button class="filter-tab active" data-filter="Tous" data-i18n="filterAll">Tous</button>
      <button class="filter-tab" data-filter="Netflix">Netflix</button>
      <button class="filter-tab" data-filter="Spotify">Spotify</button>
      <button class="filter-tab" data-filter="Disney+">Disney+</button>
      <button class="filter-tab" data-filter="Autres" data-i18n="filterOthers">Autres</button>
    </div>
  </section>

  <!-- Accounts Catalog Grid -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
    <!-- Loading Skeleton -->
    <div id="loadingIndicator" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="account-card skeleton h-72"></div>
      <div class="account-card skeleton h-72"></div>
      <div class="account-card skeleton h-72"></div>
    </div>

    <!-- Accounts Render Target -->
    <div id="accountsGrid" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>

    <!-- Empty State -->
    <div id="emptyCatalogState" class="hidden text-center py-16">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface flex items-center justify-center text-gray-500">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-300" data-i18n="noAccountsFound">Aucun compte disponible dans cette catégorie</h3>
      <p class="text-sm text-gray-500 mt-1" data-i18n="checkBackLater">Vérifiez un autre filtre ou contactez le support pour commander.</p>
    </div>
  </main>

  <!-- Footer -->
  <footer class="mt-auto border-t border-border bg-dark/60 py-8 px-4 text-center text-xs text-gray-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p>&copy; <span id="currentYear"></span> ShareStream. Développé pour Moussa Wagué.</p>
      </div>
      <div class="flex items-center gap-4 text-gray-400">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Firestore Synced</span>
        <a href="https://wa.me/221777059102" class="hover:text-white transition">Support WhatsApp (+221 77 705 91 02)</a>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script type="module" src="./translations.js"></script>
  <script type="module" src="./firebase-config.js"></script>
  <script type="module" src="./app.js"></script>
</body>
</html>`
  },

  'style.css': {
    name: 'style.css',
    lang: 'css',
    path: 'style.css',
    description: "Thème CSS autonome avec variables modernes, support responsive, cartes d'abonnement et animations",
    code: `/* ShareStream Standalone Pure CSS Theme */
:root {
  --bg-dark: #0A0A0C;
  --bg-surface: #141418;
  --bg-surface-hover: #1A1A20;
  --border-color: #27272F;
  --primary-blue: #2563EB;
  --primary-blue-hover: #1D4ED8;
  --accent-green: #22C55E;
  --accent-red: #EF4444;
  --text-main: #F3F4F6;
  --text-muted: #9CA3AF;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Header & Glassmorphism */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.bg-dark { background-color: var(--bg-dark); }
.bg-surface { background-color: var(--bg-surface); }
.border-border { border-color: var(--border-color); }

/* Filter Tabs */
.filter-tab {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  color: #fff;
  border-color: #3f3f4e;
}

.filter-tab.active {
  background-color: var(--primary-blue);
  color: #fff;
  border-color: var(--primary-blue);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

/* Account Cards */
.account-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.account-card:hover {
  transform: translateY(-4px);
  border-color: #3f3f4e;
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.6);
}

.account-badge-available {
  background-color: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.account-badge-reserved {
  background-color: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.whatsapp-button {
  background-color: #25D366;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8125rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.1s;
}

.whatsapp-button:hover {
  background-color: #20bd5a;
}

.whatsapp-button:active {
  transform: scale(0.98);
}

/* Skeleton loader */
.skeleton {
  background: linear-gradient(90deg, #141418 25%, #1e1e24 50%, #141418 75%);
  background-size: 200% 100%;
  animation: loadingPulse 1.5s infinite;
}

@keyframes loadingPulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
  },

  'firebase-config.js': {
    name: 'firebase-config.js',
    lang: 'javascript',
    path: 'firebase-config.js',
    description: "Configuration Firebase SDK v10 (ES Modules) connectée à Firestore pour les données temps réel",
    code: `// Initialisation Firebase SDK Client Standalone
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuration Firebase ShareStream
export const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForTemplatePurposes9843",
  authDomain: "velvety-artifact-hpthm.firebaseapp.com",
  projectId: "velvety-artifact-hpthm",
  storageBucket: "velvety-artifact-hpthm.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialisation
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc 
};`
  },

  'translations.js': {
    name: 'translations.js',
    lang: 'javascript',
    path: 'translations.js',
    description: "Gestionnaire bilingue FR/EN complet avec dictionnaire de traduction pour l'interface PWA",
    code: `// Dictionnaire Bilingue ShareStream
export const translations = {
  fr: {
    heroTitle: "Vos abonnements streaming préférés au meilleur tarif",
    heroSubtitle: "Accédez aux services premium Netflix, Disney+, Spotify et plus avec activation rapide via WhatsApp et paiement sécurisé en FCFA.",
    filterAll: "Tous",
    filterOthers: "Autres",
    installApp: "Installer l'application",
    btnWhatsApp: "Commander via WhatsApp",
    available: "Disponible",
    reserved: "Réservé",
    month: "mois",
    perMonth: "FCFA / mois",
    noAccountsFound: "Aucun compte disponible dans cette catégorie",
    checkBackLater: "Vérifiez un autre filtre ou contactez le support pour commander.",
    supportNotice: "Besoin d'un compte sur-mesure ? Écrivez-nous directement."
  },
  en: {
    heroTitle: "Your favorite streaming subscriptions at the best price",
    heroSubtitle: "Get instant access to Netflix, Disney+, Spotify and more with direct WhatsApp delivery and secure FCFA payment.",
    filterAll: "All",
    filterOthers: "Others",
    installApp: "Install App",
    btnWhatsApp: "Order via WhatsApp",
    available: "Available",
    reserved: "Reserved",
    month: "month",
    perMonth: "FCFA / month",
    noAccountsFound: "No account found in this category",
    checkBackLater: "Try selecting another filter or contact support directly.",
    supportNotice: "Need a custom subscription? Text us on WhatsApp."
  }
};

let currentLanguage = localStorage.getItem('sharestream_lang') || 'fr';

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('sharestream_lang', lang);
  applyTranslations();
}

export function toggleLanguage() {
  const next = currentLanguage === 'fr' ? 'en' : 'fr';
  setLanguage(next);
  return next;
}

export function t(key) {
  return translations[currentLanguage][key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      el.textContent = translations[currentLanguage][key];
    }
  });

  const langLabel = document.getElementById('currentLangLabel');
  if (langLabel) {
    langLabel.textContent = currentLanguage.toUpperCase();
  }
}`
  },

  'app.js': {
    name: 'app.js',
    lang: 'javascript',
    path: 'app.js',
    description: "Logique applicative JavaScript, réactivité temps réel Firestore, commandes WhatsApp",
    code: [
      "// Application Logic ShareStream",
      "import { db, collection, onSnapshot, query } from './firebase-config.js';",
      "import { t, getLanguage, toggleLanguage, applyTranslations } from './translations.js';",
      "",
      "// Données par défaut si Firestore est en cours de synchronisation",
      "const DEFAULT_ACCOUNTS = [",
      "  {",
      "    id: 'netflix-1',",
      "    name: 'Netflix Premium 4K UHD',",
      "    platform: 'Netflix',",
      "    price: 3500,",
      "    description: 'Profil privé avec code PIN personnel, streaming 4K Ultra HD.',",
      "    status: 'available',",
      "    imageUrl: 'https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.ico'",
      "  },",
      "  {",
      "    id: 'spotify-1',",
      "    name: 'Spotify Premium Famille',",
      "    platform: 'Spotify',",
      "    price: 1500,",
      "    description: 'Écoute sans publicité, téléchargement hors-ligne illimité.',",
      "    status: 'available',",
      "    imageUrl: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png'",
      "  },",
      "  {",
      "    id: 'disney-1',",
      "    name: 'Disney+ Standard avec Pubs',",
      "    platform: 'Disney+',",
      "    price: 2500,",
      "    description: 'Films Marvel, Star Wars et classiques Disney en HD intégrale.',",
      "    status: 'available',",
      "    imageUrl: 'https://static-assets.bamgrid.com/product/disneyplus/favicons/favicon.ico'",
      "  }",
      "];",
      "",
      "let allAccounts = [];",
      "let activeFilter = 'Tous';",
      "let deferredPrompt = null;",
      "",
      "// Éléments du DOM",
      "const accountsGrid = document.getElementById('accountsGrid');",
      "const loadingIndicator = document.getElementById('loadingIndicator');",
      "const emptyCatalogState = document.getElementById('emptyCatalogState');",
      "const langToggleBtn = document.getElementById('langToggleBtn');",
      "const pwaInstallBtn = document.getElementById('pwaInstallBtn');",
      "const currentYearEl = document.getElementById('currentYear');",
      "",
      "if (currentYearEl) {",
      "  currentYearEl.textContent = new Date().getFullYear();",
      "}",
      "",
      "// Formatage des prix en FCFA",
      "function formatPrice(amount) {",
      "  return new Intl.NumberFormat('fr-FR').format(amount);",
      "}",
      "",
      "// Génération de l'URL WhatsApp avec message pré-rempli officiel",
      "function generateWhatsAppLink(account) {",
      "  const phone = '221777059102';",
      "  const rawMsg = 'Bonjour, je souhaite louer ' + account.name + ' pour ' + formatPrice(account.price) + ' FCFA/mois. Merci !';",
      "  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(rawMsg);",
      "}",
      "",
      "// Rendu des comptes dans le DOM",
      "function renderAccounts() {",
      "  if (!accountsGrid) return;",
      "",
      "  let filtered = allAccounts;",
      "  if (activeFilter === 'Autres') {",
      "    filtered = allAccounts.filter(function(a) {",
      "      return !['Netflix', 'Spotify', 'Disney+'].includes(a.platform);",
      "    });",
      "  } else if (activeFilter !== 'Tous') {",
      "    filtered = allAccounts.filter(function(a) {",
      "      return a.platform === activeFilter;",
      "    });",
      "  }",
      "",
      "  if (filtered.length === 0) {",
      "    accountsGrid.classList.add('hidden');",
      "    if (emptyCatalogState) emptyCatalogState.classList.remove('hidden');",
      "    return;",
      "  }",
      "",
      "  if (emptyCatalogState) emptyCatalogState.classList.add('hidden');",
      "  accountsGrid.classList.remove('hidden');",
      "",
      "  accountsGrid.innerHTML = filtered.map(function(acc) {",
      "    const isAvailable = acc.status === 'available';",
      "    const statusClass = isAvailable ? 'account-badge-available' : 'account-badge-reserved';",
      "    const statusLabel = isAvailable ? t('available') : t('reserved');",
      "    const waUrl = generateWhatsAppLink(acc);",
      "",
      "    return [",
      "      '<div class=\"account-card\">',",
      "      '  <div class=\"flex items-center justify-between mb-4\">',",
      "      '    <span class=\"text-xs font-bold tracking-wider uppercase text-gray-400\">' + acc.platform + '</span>',",
      "      '    <span class=\"' + statusClass + '\">' + statusLabel + '</span>',",
      "      '  </div>',",
      "      '  <h3 class=\"text-lg font-extrabold text-white mb-2 leading-snug\">' + acc.name + '</h3>',",
      "      '  <p class=\"text-xs text-gray-400 mb-6 flex-1\">' + (acc.description || '') + '</p>',",
      "      '  <div class=\"pt-4 border-t border-border flex items-center justify-between mt-auto mb-4\">',",
      "      '    <div>',",
      "      '      <span class=\"text-xs text-gray-500 block\">Tarif mensuel</span>',",
      "      '      <span class=\"text-xl font-black text-white\">' + formatPrice(acc.price) + ' <span class=\"text-xs font-semibold text-gray-400\">FCFA</span></span>',",
      "      '    </div>',",
      "      '  </div>',",
      "      '  <a href=\"' + waUrl + '\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"whatsapp-button\">',",
      "      '    <svg class=\"w-4 h-4 fill-white\" viewBox=\"0 0 24 24\"><path d=\"M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.787-1.676-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.492-.507-.676-.516h-.577c-.2 0-.527.075-.803.376-.276.301-1.054 1.029-1.054 2.509 0 1.48 1.079 2.909 1.23 3.11 0.15 0.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35z\"/></svg>',",
      "      '    <span>' + t('btnWhatsApp') + '</span>',",
      "      '  </a>',",
      "      '</div>'",
      "    ].join('\\n');",
      "  }).join('');",
      "}",
      "",
      "// Chargement et écoute en temps réel Firestore",
      "function initDataListener() {",
      "  try {",
      "    const q = collection(db, 'accounts');",
      "    onSnapshot(q, function(snapshot) {",
      "      if (!snapshot.empty) {",
      "        allAccounts = snapshot.docs.map(function(doc) {",
      "          return Object.assign({ id: doc.id }, doc.data());",
      "        });",
      "      } else {",
      "        allAccounts = DEFAULT_ACCOUNTS;",
      "      }",
      "      if (loadingIndicator) loadingIndicator.classList.add('hidden');",
      "      renderAccounts();",
      "    }, function(err) {",
      "      console.warn('Utilisation des données locales (hors-ligne ou auth):', err);",
      "      allAccounts = DEFAULT_ACCOUNTS;",
      "      if (loadingIndicator) loadingIndicator.classList.add('hidden');",
      "      renderAccounts();",
      "    });",
      "  } catch (e) {",
      "    console.warn('Fallback offline:', e);",
      "    allAccounts = DEFAULT_ACCOUNTS;",
      "    if (loadingIndicator) loadingIndicator.classList.add('hidden');",
      "    renderAccounts();",
      "  }",
      "}",
      "",
      "// Gestion des filtres",
      "document.querySelectorAll('.filter-tab').forEach(function(btn) {",
      "  btn.addEventListener('click', function() {",
      "    document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });",
      "    btn.classList.add('active');",
      "    activeFilter = btn.getAttribute('data-filter') || 'Tous';",
      "    renderAccounts();",
      "  });",
      "});",
      "",
      "// Changement de langue",
      "if (langToggleBtn) {",
      "  langToggleBtn.addEventListener('click', function() {",
      "    toggleLanguage();",
      "    renderAccounts();",
      "  });",
      "}",
      "",
      "// Support PWA Installation",
      "window.addEventListener('beforeinstallprompt', function(e) {",
      "  e.preventDefault();",
      "  deferredPrompt = e;",
      "  if (pwaInstallBtn) pwaInstallBtn.classList.remove('hidden');",
      "});",
      "",
      "if (pwaInstallBtn) {",
      "  pwaInstallBtn.addEventListener('click', function() {",
      "    if (!deferredPrompt) return;",
      "    deferredPrompt.prompt();",
      "    deferredPrompt.userChoice.then(function() {",
      "      pwaInstallBtn.classList.add('hidden');",
      "      deferredPrompt = null;",
      "    });",
      "  });",
      "}",
      "",
      "// Enregistrement du Service Worker",
      "if ('serviceWorker' in navigator) {",
      "  window.addEventListener('load', function() {",
      "    navigator.serviceWorker.register('./sw.js').catch(function(err) {",
      "      console.warn('Service Worker registration skipped:', err);",
      "    });",
      "  });",
      "}",
      "",
      "// Initialisation globale",
      "applyTranslations();",
      "initDataListener();"
    ].join('\n')
  },

  'sw.js': {
    name: 'sw.js',
    lang: 'javascript',
    path: 'sw.js',
    description: "Service Worker PWA avec stratégie Cache-First pour les assets et Network-First pour Firestore",
    code: `const CACHE_NAME = 'sharestream-standalone-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './translations.js',
  './firebase-config.js',
  './manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});`
  },

  'manifest.json': {
    name: 'manifest.json',
    lang: 'json',
    path: 'manifest.json',
    description: "Manifest PWA pour l'installation sur smartphones Android, tablettes et PC",
    code: `{
  "name": "ShareStream - Location Comptes Streaming",
  "short_name": "ShareStream",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0A0A0C",
  "theme_color": "#0F0F12",
  "description": "Location d'abonnements streaming vérifiés Netflix, Spotify, Disney+ au meilleur prix en FCFA.",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}`
  },

  'README.md': {
    name: 'README.md',
    lang: 'markdown',
    path: 'README.md',
    description: "Guide de déploiement en 1 clic sur Firebase Hosting avec index.html et SDK v10",
    code: [
      "# 🚀 Déploiement Standalone ShareStream",
      "",
      "Ce sous-dossier contient la version **100% autonome (Zero-Build-Tool)** de ShareStream.",
      "Elle n'a besoin ni de Node.js, ni de Vite pour fonctionner en production.",
      "",
      "## 📦 Fichiers inclus",
      "- `index.html` : Interface complète responsive",
      "- `style.css` : Thème sombre avec variables CSS",
      "- `firebase-config.js` : SDK Firebase v10 sans bundler",
      "- `translations.js` : Système bilingue FR/EN",
      "- `app.js` : Logique Firestore & commandes WhatsApp",
      "- `sw.js` : Service Worker pour le cache hors-ligne",
      "- `manifest.json` : Installation PWA",
      "",
      "## ⚡ Déploiement Firebase Hosting en 3 minutes",
      "1. Installez les outils Firebase :",
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

// Alias de compatibilité
export const STANDALONE_FILES = STANDALONE_PWA_FILES;