// Dictionnaire bilingue Français / Anglais
const translations = {
  fr: {
    appName: "ShareStream",
    appTagline: "Location & Partage de Comptes Streaming",
    all: "Tous",
    netflix: "Netflix",
    spotify: "Spotify",
    disney: "Disney+",
    others: "Autres",
    availableOnly: "Disponibles uniquement",
    searchPlaceholder: "Rechercher un abonnement...",
    rent: "Louer",
    details: "Détails",
    available: "Disponible",
    reserved: "Réservé",
    month: "/ mois",
    currency: "FCFA",
    contactWA: "Contacter sur WhatsApp",
    reserve: "Réserver ce compte",
    admin: "Admin",
    addAccount: "Ajouter un compte",
    accountsCount: "{count} compte(s) disponible(s)",
    guarantee: "Garantie 30 jours sans coupure avec support technique direct WhatsApp.",
    login: "Connexion",
    logout: "Déconnexion",
    myReservations: "Mes Réservations",
    noReservations: "Aucune réservation pour le moment."
  },
  en: {
    appName: "ShareStream",
    appTagline: "Streaming Account Rental & Sharing",
    all: "All",
    netflix: "Netflix",
    spotify: "Spotify",
    disney: "Disney+",
    others: "Others",
    availableOnly: "Available only",
    searchPlaceholder: "Search a subscription...",
    rent: "Rent",
    details: "Details",
    available: "Available",
    reserved: "Reserved",
    month: "/ mo",
    currency: "FCFA",
    contactWA: "Contact on WhatsApp",
    reserve: "Reserve this account",
    admin: "Admin",
    addAccount: "Add account",
    accountsCount: "{count} account(s) available",
    guarantee: "30-day guarantee with instant direct WhatsApp technical assistance.",
    login: "Sign In",
    logout: "Sign Out",
    myReservations: "My Reservations",
    noReservations: "No reservations yet."
  }
};

let currentLang = localStorage.getItem('sharestream_lang') || 'fr';

function t(key, params = {}) {
  const dict = translations[currentLang] || translations.fr;
  let str = dict[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sharestream_lang', lang);
  updatePageTranslations();
}