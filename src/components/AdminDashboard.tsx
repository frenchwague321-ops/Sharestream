import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Account, AccountStatus } from '../types';
import { PLATFORM_PRESETS } from '../data/initialData';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Users, 
  Layers, 
  DollarSign, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  Phone, 
  AlertTriangle,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    t, 
    currentUser, 
    accounts, 
    users, 
    reservations,
    addAccount, 
    updateAccount, 
    deleteAccount, 
    toggleAccountStatus,
    whatsappNumber,
    setWhatsappNumber,
    showToast,
    setIsAuthModalOpen,
    setAuthModalMode,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'accounts' | 'reservations' | 'users' | 'settings'>('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  
  // Delete confirmation modal
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  // Form fields
  const [formPlatform, setFormPlatform] = useState('Netflix');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>(2500);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<AccountStatus>('available');
  const [formQuality, setFormQuality] = useState('4K Ultra HD');
  const [formProfiles, setFormProfiles] = useState<number>(5);

  // WhatsApp settings field
  const [phoneInput, setPhoneInput] = useState(whatsappNumber);

  // Strict Authorization Check: Only moussawague062@gmail.com with role === 'admin'
  if (!currentUser || currentUser.role !== 'admin' || currentUser.email.toLowerCase() !== 'moussawague062@gmail.com') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#0F0F12] border border-rose-900/40 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Outfit']">
          Accès Administrateur Restreint
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Cette zone de gestion est strictement réservée à l'administrateur officiel (<strong className="text-gray-200">moussawague062@gmail.com</strong>).
          Veuillez vous authentifier avec vos identifiants Firebase sécurisés.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            Se connecter en tant qu'Admin
          </button>
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="w-full py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold border border-gray-800 transition-colors"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  // KPI Calculations
  const totalAccounts = accounts.length;
  const availableAccounts = accounts.filter((a) => a.status === 'available').length;
  const reservedAccounts = accounts.filter((a) => a.status === 'reserved').length;
  const totalUsersCount = users.length;
  const totalMonthlyValue = accounts.reduce((acc, curr) => acc + (curr.price || 0), 0);

  // Filtered Accounts
  const filteredAccounts = accounts.filter((a) => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingAccountId(null);
    setFormPlatform('Netflix');
    setFormName('Netflix Premium 4K UHD');
    setFormPrice(2500);
    setFormDescription('Compte Netflix 4K UHD officiel, 5 profils avec code PIN.');
    setFormImageUrl(PLATFORM_PRESETS[0].logo);
    setFormStatus('available');
    setFormQuality('4K Ultra HD');
    setFormProfiles(5);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: Account) => {
    setEditingAccountId(acc.id);
    setFormPlatform(acc.platform);
    setFormName(acc.name);
    setFormPrice(acc.price);
    setFormDescription(acc.description);
    setFormImageUrl(acc.imageUrl);
    setFormStatus(acc.status);
    setFormQuality(acc.quality || '4K Ultra HD');
    setFormProfiles(acc.profilesCount || 5);
    setIsModalOpen(true);
  };

  const handleSelectPreset = (preset: typeof PLATFORM_PRESETS[0]) => {
    setFormPlatform(preset.name);
    setFormName(`${preset.name} Premium`);
    setFormPrice(preset.defaultPrice);
    setFormImageUrl(preset.logo);
    setFormQuality(preset.quality);
    setFormProfiles(preset.profiles);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
        showToast('Image chargée avec succès !', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPlatform.trim() || formPrice === '' || Number(formPrice) <= 0) {
      showToast('Veuillez remplir correctement tous les champs obligatoires.', 'error');
      return;
    }

    const payload = {
      name: formName.trim(),
      platform: formPlatform.trim(),
      price: Number(formPrice),
      description: formDescription.trim() || `${formPlatform} Abonnement officiel`,
      imageUrl: formImageUrl.trim() || PLATFORM_PRESETS[0].logo,
      status: formStatus,
      quality: formQuality.trim(),
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
    setWhatsappNumber(phoneInput.trim());
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {t('adminTitle')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 border border-blue-500/20">
                {currentUser?.email || 'moussawague062@gmail.com'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {t('adminSubtitle')}
            </p>
          </div>
        </div>

        {/* Add Account CTA */}
        <button
          id="admin-add-account-btn"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btnAddAccount')}</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Accounts */}
        <div className="p-5 rounded-2xl bg-[#16161D] border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t('statTotalAccounts')}
            </p>
            <p className="text-2xl font-bold text-white mt-1 font-['Outfit']">
              {totalAccounts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Available Accounts */}
        <div className="p-5 rounded-2xl bg-[#16161D] border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t('statAvailableAccounts')}
            </p>
            <p className="text-2xl font-bold text-green-400 mt-1 font-['Outfit']">
              {availableAccounts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Reserved Accounts */}
        <div className="p-5 rounded-2xl bg-[#16161D] border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t('statReservedAccounts')}
            </p>
            <p className="text-2xl font-bold text-gray-400 mt-1 font-['Outfit']">
              {reservedAccounts}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-500/10 border border-gray-500/20 flex items-center justify-center text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-[#16161D] border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {t('statTotalUsers')}
            </p>
            <p className="text-2xl font-bold text-blue-400 mt-1 font-['Outfit']">
              {totalUsersCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          id="admin-tab-accounts-btn"
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'accounts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {t('tabAccounts')} ({accounts.length})
        </button>

        <button
          id="admin-tab-reservations-btn"
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'reservations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {t('tabReservations')} ({reservations.length})
        </button>

        <button
          id="admin-tab-users-btn"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {t('tabUsers')} ({users.length})
        </button>

        <button
          id="admin-tab-settings-btn"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Configuration WhatsApp
        </button>
      </div>

      {/* TAB 1: ACCOUNTS MANAGEMENT */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer par nom ou plateforme..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Accounts Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => {
              const isRes = account.status === 'reserved';
              return (
                <div
                  key={account.id}
                  id={`admin-account-item-${account.id}`}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isRes 
                      ? 'bg-[#16161D]/60 border-gray-800 opacity-75' 
                      : 'bg-[#16161D] border-gray-800 hover:border-blue-500/40'
                  }`}
                >
                  <div>
                    {/* Top Row: Thumbnail + Info */}
                    <div className="flex items-start gap-3">
                      <img
                        src={account.imageUrl || PLATFORM_PRESETS[0].logo}
                        alt={account.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-800 bg-[#0A0A0C] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-blue-400">
                            {account.platform}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isRes 
                              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {isRes ? t('statusReserved') : t('statusAvailable')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-100 truncate mt-0.5">
                          {account.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                          {account.description}
                        </p>
                      </div>
                    </div>

                    {/* Price and Details */}
                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <div className="text-sm font-bold text-white">
                        {account.price.toLocaleString()} <span className="text-xs text-blue-400">FCFA</span> <span className="text-[11px] text-gray-500 font-normal">/ mois</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {account.profilesCount || 5} profils
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                    
                    {/* Toggle Status Button */}
                    <button
                      id={`admin-toggle-status-${account.id}`}
                      onClick={() => toggleAccountStatus(account.id, isRes ? 'available' : 'reserved')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isRes
                          ? 'bg-green-950/60 hover:bg-green-900/80 text-green-300 border border-green-800/40'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                      }`}
                    >
                      {isRes ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isRes ? t('btnMarkAvailable') : t('btnMarkReserved')}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        id={`admin-edit-btn-${account.id}`}
                        onClick={() => handleOpenEditModal(account)}
                        title={t('btnEditAccount')}
                        className="p-1.5 rounded-lg bg-gray-900 hover:bg-blue-900/40 text-gray-300 hover:text-blue-300 border border-gray-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        id={`admin-delete-btn-${account.id}`}
                        onClick={() => setDeletingAccountId(account.id)}
                        title={t('btnDeleteAccount')}
                        className="p-1.5 rounded-lg bg-gray-900 hover:bg-rose-900/40 text-gray-300 hover:text-rose-400 border border-gray-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12 p-6 rounded-2xl bg-[#16161D] border border-gray-800 text-gray-400">
              {t('noAccountsFound')}
            </div>
          )}
        </div>
      )}

      {/* TAB: RESERVATIONS LIST */}
      {activeTab === 'reservations' && (
        <div className="rounded-2xl bg-[#16161D] border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0F0F12] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Offre / Compte</th>
                  <th className="px-6 py-4">Plateforme</th>
                  <th className="px-6 py-4">Tarif</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                          {(res.userName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{res.userName || 'Utilisateur'}</div>
                          <div className="text-xs text-gray-400 font-mono">{res.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {res.accountName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700">
                        {res.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-400 font-mono">
                      {res.price.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(res.reservedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {res.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Actif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                          Terminé
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reservations.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Aucune réservation enregistrée pour le moment.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS LIST */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-[#16161D] border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0F0F12] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">{t('userColName')}</th>
                  <th className="px-6 py-4">{t('userColEmail')}</th>
                  <th className="px-6 py-4">{t('userColRole')}</th>
                  <th className="px-6 py-4">{t('userColJoined')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        u.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{t('userRoleAdmin')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                          {t('userRoleUser')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl p-6 rounded-2xl bg-[#16161D] border border-gray-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" />
              <span>Numéro WhatsApp de contact</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Ce numéro sera automatiquement utilisé pour tous les boutons "Contacter sur WhatsApp" avec les messages pré-remplis en FCFA.
            </p>
          </div>

          <form onSubmit={handleSavePhone} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                Numéro de téléphone (avec indicatif pays)
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+221 77 705 91 02"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              Enregistrer le numéro
            </button>
          </form>
        </div>
      )}

      {/* ADD / EDIT ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-[#0F0F12] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white font-['Outfit']">
                {editingAccountId ? t('modalEditTitle') : t('modalAddTitle')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Presets Quick Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                  {t('formImagePresets')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORM_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                        formPlatform === preset.name
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formPlatform')} *
                </label>
                <input
                  type="text"
                  required
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value)}
                  placeholder={t('formPlatformPlaceholder')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Offer Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formAccountName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('formAccountNamePlaceholder')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price & Profiles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                    {t('formPrice')} *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={t('formPricePlaceholder')}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                    Nombre de profils
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formProfiles}
                    onChange={(e) => setFormProfiles(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formQuality')}
                </label>
                <input
                  type="text"
                  value={formQuality}
                  onChange={(e) => setFormQuality(e.target.value)}
                  placeholder={t('formQualityPlaceholder')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formDescription')}
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t('formDescriptionPlaceholder')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Image URL & Gallery Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formImageUrl')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  
                  {/* Upload button */}
                  <label className="px-3.5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-gray-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Status initial */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  {t('formStatus')}
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                    <input
                      type="radio"
                      name="status"
                      value="available"
                      checked={formStatus === 'available'}
                      onChange={() => setFormStatus('available')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t('statusAvailable')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                    <input
                      type="radio"
                      name="status"
                      value="reserved"
                      checked={formStatus === 'reserved'}
                      onChange={() => setFormStatus('reserved')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t('statusReserved')}</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {t('btnSave')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingAccountId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0F12] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white font-['Outfit']">
                {t('confirmDeleteTitle')}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {t('confirmDeleteText')}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingAccountId(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={() => {
                  deleteAccount(deletingAccountId);
                  setDeletingAccountId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                {t('btnDeleteAccount')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};