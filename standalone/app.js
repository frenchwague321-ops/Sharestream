// État global de l'application
let accountsData = [];
let selectedAccount = null;
let currentCategory = 'Tous';

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((reg) => console.log('[SW] Enregistré:', reg.scope))
      .catch((err) => console.warn('[SW] Erreur:', err));
  });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  loadAccounts();
  updatePageTranslations();
});

// Chargement des comptes (Firestore en direct ou fallback)
function loadAccounts() {
  if (typeof db !== 'undefined' && db) {
    db.collection('accounts').onSnapshot((snapshot) => {
      if (snapshot.empty) {
        accountsData = INITIAL_ACCOUNTS_FALLBACK;
      } else {
        accountsData = [];
        snapshot.forEach((doc) => {
          accountsData.push({ id: doc.id, ...doc.data() });
        });
      }
      renderAccounts(accountsData);
    }, (err) => {
      console.warn('Firestore err, utilisation cache:', err);
      accountsData = INITIAL_ACCOUNTS_FALLBACK;
      renderAccounts(accountsData);
    });
  } else {
    accountsData = INITIAL_ACCOUNTS_FALLBACK;
    renderAccounts(accountsData);
  }
}

// Rendu des cartes de comptes dans le DOM
function renderAccounts(items) {
  const grid = document.getElementById('accounts-grid');
  const countBadge = document.getElementById('accounts-count');
  if (!grid) return;

  grid.innerHTML = '';
  countBadge.innerText = `${items.length} ${t('currency') === 'FCFA' ? 'comptes' : 'accounts'}`;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #9CA3AF;">Aucun compte trouvé</div>`;
    return;
  }

  items.forEach((acc) => {
    const isAvail = acc.status === 'available';
    const card = document.createElement('div');
    card.className = 'account-card';
    card.onclick = () => openDetailModal(acc);

    card.innerHTML = `
      <div class="card-banner">
        <img src="${acc.imageUrl}" alt="${acc.name}">
        <span class="card-badge">${acc.platform}</span>
        <span class="status-badge ${isAvail ? 'available' : 'reserved'}">
          ${isAvail ? t('available') : t('reserved')}
        </span>
      </div>
      <div class="card-body">
        <div>
          <h3 class="card-title">${acc.name}</h3>
          <p class="card-desc">${acc.description}</p>
        </div>
        <div class="card-footer">
          <div class="card-price">${acc.price.toLocaleString()} ${t('currency')}</div>
          <div class="card-actions">
            <button class="btn-card-wa" onclick="event.stopPropagation(); contactWhatsApp('${acc.id}')">WA</button>
            <button class="btn-card-rent" onclick="event.stopPropagation(); reserve('${acc.id}')">${t('rent')}</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filtrage dynamique
function filterAccounts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const availOnly = document.getElementById('avail-only').checked;

  const filtered = accountsData.filter((acc) => {
    const matchesQuery = !query || 
      acc.name.toLowerCase().includes(query) || 
      acc.platform.toLowerCase().includes(query) || 
      acc.description.toLowerCase().includes(query);

    const matchesCat = currentCategory === 'Tous' ||
      (currentCategory === 'Autres' 
        ? !['Netflix', 'Spotify', 'Disney+'].includes(acc.platform)
        : acc.platform.toLowerCase() === currentCategory.toLowerCase());

    const matchesAvail = availOnly ? acc.status === 'available' : true;

    return matchesQuery && matchesCat && matchesAvail;
  });

  renderAccounts(filtered);
}

function setCategory(cat, btnElement) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  filterAccounts();
}

// Gestion de la boîte modale de détails
function openDetailModal(acc) {
  selectedAccount = acc;
  document.getElementById('modal-img').src = acc.imageUrl;
  document.getElementById('modal-platform').innerText = acc.platform;
  document.getElementById('modal-title').innerText = acc.name;
  document.getElementById('modal-price').innerText = `${acc.price.toLocaleString()} ${t('currency')}`;
  document.getElementById('modal-desc').innerText = acc.description;

  const reserveBtn = document.getElementById('modal-reserve-btn');
  if (acc.status === 'available') {
    reserveBtn.disabled = false;
    reserveBtn.innerText = t('reserve');
  } else {
    reserveBtn.disabled = true;
    reserveBtn.innerText = t('reserved');
  }

  document.getElementById('detail-modal').classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Intégration WhatsApp
function contactWhatsApp(accountId) {
  const acc = accountsData.find((a) => a.id === accountId);
  if (!acc) return;
  const num = DEFAULT_WHATSAPP.replace(/[^0-9]/g, '');
  const msg = `Bonjour, je souhaite louer ${acc.name} (${acc.price} FCFA/mois). Merci !`;
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
}

function contactWhatsAppCurrent() {
  if (selectedAccount) {
    contactWhatsApp(selectedAccount.id);
  }
}

// Réservation
function reserve(accountId) {
  const acc = accountsData.find((a) => a.id === accountId);
  if (!acc) return;

  if (acc.status === 'reserved') {
    alert('Ce compte est déjà réservé !');
    return;
  }

  if (typeof db !== 'undefined' && db) {
    db.collection('accounts').doc(acc.id).update({
      status: 'reserved',
      slotsAvailable: 0
    }).then(() => {
      alert(`Félicitations ! Réservation confirmée pour ${acc.name}.`);
      closeModal('detail-modal');
    }).catch((e) => {
      console.warn('Erreur Firestore:', e);
      acc.status = 'reserved';
      renderAccounts(accountsData);
      closeModal('detail-modal');
    });
  } else {
    acc.status = 'reserved';
    renderAccounts(accountsData);
    alert(`Félicitations ! Réservation enregistrée pour ${acc.name}.`);
    closeModal('detail-modal');
  }
}

function reserveCurrent() {
  if (selectedAccount) {
    reserve(selectedAccount.id);
  }
}

// Bilinguisme FR / EN
function toggleLanguage() {
  setLanguage(currentLang === 'fr' ? 'en' : 'fr');
}

function updatePageTranslations() {
  document.getElementById('tagline-txt').innerText = t('appTagline');
  document.getElementById('lang-btn').innerText = currentLang.toUpperCase();
  document.getElementById('search-input').placeholder = t('searchPlaceholder');
  document.getElementById('avail-txt').innerText = t('availableOnly');
  renderAccounts(accountsData);
}

function openAuthModal() {
  alert('Connexion Google / Email : Utilisez vos accès Firebase ou contactez le support admin.');
}