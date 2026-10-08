// Configuration Firebase pour ShareStream Standalone
const firebaseConfig = {
  apiKey: "AIzaSyAMseI4KUxanP8C_u91t3dNJg4D5DDj19M",
  authDomain: "sharestream-2f374.firebaseapp.com",
  projectId: "sharestream-2f374",
  storageBucket: "sharestream-2f374.firebasestorage.app",
  messagingSenderId: "33094694566",
  appId: "1:33094694566:web:47bb1b90db244fc6d3a667",
  measurementId: "G-Y516R9GBC3"
};

// Initialisation Firebase SDK v8 (Compatibilité CDN Web Standard)
let db = null;
let auth = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('[Firebase] Initialisé avec succès pour ShareStream');
  } else {
    console.warn('[Firebase] SDK Firebase non chargé, passage en mode stockage local');
  }
} catch (e) {
  console.error('[Firebase] Erreur d\'initialisation:', e);
}

// Numéro WhatsApp par défaut
const DEFAULT_WHATSAPP = "+221 77 705 91 02";

// Comptes initiaux si Firestore est vide
const INITIAL_ACCOUNTS_FALLBACK = [
  {
    id: "acc-1",
    name: "Netflix Premium 4K UHD",
    platform: "Netflix",
    price: 2500,
    description: "Compte Netflix Ultra HD 4K, 5 profils privés avec code PIN. Accès immédiat garanti 30 jours.",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80",
    quality: "4K Ultra HD + Dolby Atmos",
    slotsAvailable: 3,
    slotsTotal: 5,
    features: ["5 Profils indépendants", "Qualité 4K Ultra HD", "Support WhatsApp 24/7"]
  },
  {
    id: "acc-2",
    name: "Spotify Premium Famille",
    platform: "Spotify",
    price: 1500,
    description: "Musique illimitée, sans publicité avec son HiFi et téléchargement hors-ligne.",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80",
    quality: "Audio Haute Qualité 320 kbps",
    slotsAvailable: 4,
    slotsTotal: 6,
    features: ["Sans publicité", "Son HiFi 320 kbps", "Téléchargement hors-ligne"]
  },
  {
    id: "acc-3",
    name: "Disney+ Standard & 4K",
    platform: "Disney+",
    price: 2000,
    description: "Accédez à Marvel, Star Wars, Pixar et Disney en qualité 4K UHD avec IMAX Enhanced.",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    quality: "4K UHD + IMAX",
    slotsAvailable: 2,
    slotsTotal: 4,
    features: ["4 Écrans simultanés", "Catalogue complet Disney", "Téléchargements illimités"]
  }
];