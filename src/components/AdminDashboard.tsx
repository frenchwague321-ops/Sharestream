import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Account, AccountFormData, AccountStatus } from '../types';
import { PLATFORM_PRESETS } from '../data/initialData';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  Save, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp,
  Sliders,
  Sparkles,
  ExternalLink,
  UserX,
  Lock,
  Mail
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    accounts, 
    reservations, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    deleteReservation,
    whatsappNumber, 
    setWhatsappNumber,
    showToast,
    users,
    deleteUser,
    t
  } = useApp();

  // WhatsApp phone state
  const [phoneInput, setPhoneInput] = useState(whatsappNumber);

  // Active admin tab: 'accounts' | 'reservations' | 'users' | 'settings'
  const [adminTab, setAdminTab] = useState<'accounts' | 'reservations' | 'users' | 'settings'>('accounts');

  // Account Modal Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formPlatform, setFormPlatform] = useState('Netflix');
  const [formPrice, setFormPrice] = useState<number | ''>(2500);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<AccountStatus>('available');
  const [formQuality, setFormQuality] = useState('4K Ultra HD');
  const [formProfiles, setFormProfiles] = useState<number | ''>(5);

  // Reset or populate modal form
  const openCreateModal = () => {
    setEditingAccountId(null);
    setFormName('');
    setFormPlatform('Netflix');
    setFormPrice(2500);
    setFormDescription('Compte officiel 4K Ultra HD avec profil privé et code PIN');
    setFormImageUrl(PLATFORM_PRESETS[0].logo);
    setFormStatus('available');
    setFormQuality('4K Ultra HD');
    setFormProfiles(5);
    setIsModalOpen(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccountId(account.id);
    setFormName(account.name);
    setFormPlatform(account.platform);
    setFormPrice(account.price);
    setFormDescription(account.description);
    setFormImageUrl(account.imageUrl || '');
    setFormStatus(account.status);
    setFormQuality(account.quality || '4K Ultra HD');
    setFormProfiles(account.slotsTotal || 5);
    setIsModalOpen(true);
  };

  const handleSelectPlatformPreset = (platformName: string) => {
    setFormPlatform(platformName);
    const preset = PLATFORM_PRESETS.find(p => p.name.toLowerCase() === platformName.toLowerCase());
    if (preset) {
      setFormImageUrl(preset.logo);
      if (!formName || formName.includes('Compte')) {
        setFormName(`${preset.name} Premium`);
      }
      if (!formDescription) {
        setFormDescription(`Abonnement ${preset.name} officiel avec accès garanti 30 jours.`);
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formName || '').trim() || !(formPlatform || '').trim() || formPrice === '' || Number(formPrice) <= 0) {
      showToast('Veuillez remplir correctement tous les champs obligatoires.', 'error');
      return;
    }

    const payload = {
      name: (formName || '').trim(),
      platform: (formPlatform || '').trim(),
      price: Number(formPrice),
      description: (formDescription || '').trim() || `${formPlatform || ''} Abonnement officiel`,
      imageUrl: (formImageUrl || '').trim() || PLATFORM_PRESETS[0].logo,
      status: formStatus,
      quality: (formQuality || '').trim(),
      profilesCount: Number(formProfiles) || 5,
      slotsAvailable: formStatus === 'available' ? Number(formProfiles) || 5 : 0,
      slotsTotal: Number(formProfiles) || 5,
      features: [
        `${formProfiles} profils indépendants`,
        formQuality,
        'Support WhatsApp 24/7',
        'Garantie sans interruption'
      ]
    };

    if (editingAccountId) {
      updateAccount(editingAccountId, payload);
    } else {
      addAccount(payload);
    }

    setIsModalOpen(false);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappNumber((phoneInput || '').trim());
    showToast('Numéro WhatsApp mis à jour avec succès !', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F0F12] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Tableau de bord Administrateur
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                Super Admin
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Gérez les comptes en direct, les réservations WhatsApp et les paramètres de contact.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une offre</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F0F12] border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Offres actives</div>
          <div className="text-2xl font-extrabold text-white">{accounts.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F0F12] border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Disponibles</div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {accounts.filter(a => a.status === 'available').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F0F12] border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Réservations</div>
          <div className="text-2xl font-extrabold text-blue-400">{reservations.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F0F12] border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Utilisateurs inscrits</div>
          <div className="text-2xl font-extrabold text-indigo-400">{users.length}</div>
        </div>
      </div>

      {/* Admin Tab Selector */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setAdminTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            adminTab === 'accounts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Gestion des Offres ({accounts.length})
        </button>
        <button
          onClick={() => setAdminTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            adminTab === 'reservations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Réservations & Demandes ({reservations.length})
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            adminTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Utilisateurs ({users.length})
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            adminTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Paramètres & WhatsApp
        </button>
      </div>

      {/* Tab 1: Accounts Management */}
      {adminTab === 'accounts' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0F0F12]">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#16161D] text-xs font-semibold uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3.5">Plateforme</th>
                  <th className="px-4 py-3.5">Nom de l'offre</th>
                  <th className="px-4 py-3.5">Prix / mois</th>
                  <th className="px-4 py-3.5">Statut</th>
                  <th className="px-4 py-3.5">Places</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {accounts.map((account) => {
                  const isAvailable = account.status === 'available';
                  return (
                    <tr key={account.id} className="hover:bg-gray-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-800 text-gray-200 border border-gray-700">
                          {account.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{account.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{account.description}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {account.price.toLocaleString()} <span className="text-xs text-blue-400">FCFA</span>
                      </td>
                      <td className="px-4 py-3">
                        {isAvailable ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Disponible
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Réservé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {account.slotsAvailable ?? 5} / {account.slotsTotal ?? 5}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(account)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer l'offre "${account.name}" ?`)) {
                                deleteAccount(account.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Reservations */}
      {adminTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0F0F12]">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#16161D] text-xs font-semibold uppercase text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3.5">Client</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Compte demandé</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Statut</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-900/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{res.userName || 'Visiteur'}</td>
                      <td className="px-4 py-3 text-gray-400">{res.userEmail}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-blue-400">{res.accountName}</span> ({res.platform})
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(res.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          {res.status || 'En attente WhatsApp'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteReservation(res.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Supprimer la réservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-[#0F0F12] border border-gray-800 text-gray-400 text-sm">
              Aucune réservation pour le moment. Les demandes WhatsApp apparaîtront ici.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Users */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0F0F12]">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#16161D] text-xs font-semibold uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3.5">Nom</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Rôle</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer l'utilisateur ${u.email} ?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Supprimer l'utilisateur"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Settings & Phone */}
      {adminTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F0F12] border border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Numéro WhatsApp de réception</h3>
                <p className="text-xs text-gray-400">
                  Tous les boutons de commande du site ouvriront une discussion avec ce numéro.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePhone} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Numéro avec indicatif pays (ex: +221777059102)
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+221777059102"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer le numéro</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0F0F12] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">
                {editingAccountId ? "Modifier l'offre" : 'Nouvelle offre streaming'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Presets quick selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400">Pré-remplir avec un service officiel :</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPlatformPreset(p.name)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      formPlatform.toLowerCase() === p.name.toLowerCase()
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Nom de l'offre *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Netflix Premium 4K - Profil Privé"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Plateforme *</label>
                  <input
                    type="text"
                    required
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    placeholder="Netflix"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Prix par mois (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="2500"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Détails de l'offre et garanties..."
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Statut *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AccountStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="reserved">Réservé / Épuisé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre de places/profils</label>
                  <input
                    type="number"
                    value={formProfiles}
                    onChange={(e) => setFormProfiles(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="5"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Qualité vidéo / Badge</label>
                <input
                  type="text"
                  value={formQuality}
                  onChange={(e) => setFormQuality(e.target.value)}
                  placeholder="4K Ultra HD"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">URL de l'image / bannière</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
                >
                  {editingAccountId ? 'Enregistrer les modifications' : 'Créer l’offre'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};