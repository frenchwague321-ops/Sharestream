import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AccountCard } from './AccountCard';
import { AccountDetailModal } from './AccountDetailModal';
import { Account, FilterCategory, SortOption } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  Tv
} from 'lucide-react';

export const HomeCatalog: React.FC = () => {
  const { 
    accounts, 
    selectedAccount,
    setSelectedAccount, 
    t, 
    language,
    whatsappNumber
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('Tous');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0); // 0 = no price filter

  // Filter options array: [Tous] [Netflix] [Spotify] [ChatGPT] [Canva]
  const filterButtons: { key: FilterCategory; labelKey: 'filterAll' | 'filterNetflix' | 'filterSpotify' | 'filterChatGPT' | 'filterCanva' }[] = [
    { key: 'Tous', labelKey: 'filterAll' },
    { key: 'Netflix', labelKey: 'filterNetflix' },
    { key: 'Spotify', labelKey: 'filterSpotify' },
    { key: 'ChatGPT', labelKey: 'filterChatGPT' },
    { key: 'Canva', labelKey: 'filterCanva' },
  ];

  // Price presets
  const pricePresets = [
    { value: 0, labelKey: 'allPrices' as const },
    { value: 2000, label: '≤ 2 000 FCFA' },
    { value: 3000, label: '≤ 3 000 FCFA' },
    { value: 5000, label: '≤ 5 000 FCFA' },
  ];

  // Helper to extract timestamp as a reliable number (handling Firestore Timestamp, Date, or number)
  const getAccountTimestamp = (acc: Account): number => {
    if (!acc || !acc.createdAt) return 0;
    const val = acc.createdAt as any;
    if (typeof val === 'number') return val;
    if (typeof val?.toMillis === 'function') return val.toMillis();
    if (typeof val?.seconds === 'number') return val.seconds * 1000;
    if (val instanceof Date) return val.getTime();
    return 0;
  };

  // Filter and Sort Logic - Assure que TOUS les comptes valides s'affichent sans coupure
  const filteredAndSortedAccounts = useMemo(() => {
    let result = Array.isArray(accounts) ? [...accounts] : [];
    // Filtrer les entrées nulles ou invalides
    result = result.filter((acc): acc is Account => Boolean(acc && (acc.id || acc.name)));

    // 1. Search Query filter
    const safeSearchQuery = (searchQuery || '').trim();
    if (safeSearchQuery) {
      const q = safeSearchQuery.toLowerCase();
      result = result.filter(
        (acc) =>
          (acc?.name || '').toLowerCase().includes(q) ||
          (acc?.platform || '').toLowerCase().includes(q) ||
          (acc?.description || '').toLowerCase().includes(q) ||
          ((acc?.quality || '').toLowerCase().includes(q))
      );
    }

    // 2. Category Filter (Netflix, Spotify, ChatGPT, Canva)
    if (selectedFilter !== 'Tous') {
      const targetCategory = (selectedFilter || '').toLowerCase();
      result = result.filter(
        (acc) => (acc?.platform || '').toLowerCase() === targetCategory
      );
    }

    // 3. Price Filter (range or select)
    if (maxPriceFilter > 0) {
      result = result.filter((acc) => (Number(acc?.price) || 0) <= maxPriceFilter);
    }

    // 4. Sorting robuste (sans retour NaN pour éviter tout comportement instable de tri)
    result.sort((a, b) => {
      if (selectedSort === 'price_asc') {
        return (Number(a?.price) || 0) - (Number(b?.price) || 0);
      }
      if (selectedSort === 'price_desc') {
        return (Number(b?.price) || 0) - (Number(a?.price) || 0);
      }
      // Newest
      const timeA = getAccountTimestamp(a);
      const timeB = getAccountTimestamp(b);
      return (timeB || 0) - (timeA || 0);
    });

    // 5. Déduplication stricte par ID stable pour garantir un rendu unifié sans clés orphelines
    const uniqueMap = new Map<string, Account>();
    result.forEach((acc, idx) => {
      const stableId = acc.id || `account-fallback-${idx}`;
      if (!uniqueMap.has(stableId)) {
        uniqueMap.set(stableId, acc);
      }
    });

    return Array.from(uniqueMap.values());
  }, [accounts, searchQuery, selectedFilter, selectedSort, maxPriceFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F0F12] via-[#16161D] to-[#0A0A0C] border border-gray-800 p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Économisez jusqu'à 75% sur vos abonnements</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight font-['Outfit']">
            {language === 'fr' ? (
              <>Louez vos comptes <span className="text-blue-500">Netflix, Spotify, ChatGPT & Canva</span></>
            ) : (
              <>Rent your favorite <span className="text-blue-500">Subscriptions</span> with confidence</>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {language === 'fr' 
              ? 'Accès immédiat avec profils sécurisés par code PIN et assistance WhatsApp en direct. Payez mensuellement en FCFA sans engagement.'
              : 'Instant access with private PIN-protected profiles and live WhatsApp support. Flexible monthly billing in FCFA.'}
          </p>

          {/* Quick value badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-green-400" />
              <span>Livraison instantanée</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Garantie 100% 30 jours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>Support WhatsApp direct</span>
            </div>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-20 w-80 h-80 rounded-full bg-gray-700/10 blur-3xl pointer-events-none" />
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="space-y-4">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filter Category Tabs [Tous] [Netflix] [Spotify] [ChatGPT] [Canva] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterButtons.map((fb, index) => {
              const isSelected = selectedFilter === fb.key;
              const count = fb.key === 'Tous'
                ? (Array.isArray(accounts) ? accounts.length : 0)
                : (Array.isArray(accounts) ? accounts.filter(a => (a?.platform || '').toLowerCase() === (fb.key || '').toLowerCase()).length : 0);

              return (
                <button
                  key={`filter-category-${fb.key}-${index}`}
                  id={`filter-tab-${fb.key.toLowerCase()}`}
                  onClick={() => setSelectedFilter(fb.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{t(fb.labelKey)}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Field */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="accounts-search-input"
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value || '')}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-1">
                <button
                  id="sort-newest-btn"
                  onClick={() => setSelectedSort('newest')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSort === 'newest'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={t('sortNewest')}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('sortNewest')}</span>
                </button>

                <button
                  id="sort-price-asc-btn"
                  onClick={() => setSelectedSort('price_asc')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSort === 'price_asc'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={t('sortPriceAsc')}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{t('sortPriceAsc')}</span>
                </button>

                <button
                  id="sort-price-desc-btn"
                  onClick={() => setSelectedSort('price_desc')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSort === 'price_desc'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={t('sortPriceDesc')}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t('sortPriceDesc')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Price Filter Bar (Range Slider & Presets) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl bg-[#16161D] border border-gray-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="font-semibold text-gray-300">{t('priceFilterLabel')}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {pricePresets.map((preset, index) => (
                <button
                  key={`price-preset-${preset.value}-${index}`}
                  id={`price-preset-${preset.value}`}
                  onClick={() => setMaxPriceFilter(preset.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    maxPriceFilter === preset.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
                  }`}
                >
                  {'labelKey' in preset ? t(preset.labelKey) : preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Range Slider for custom maximum budget */}
          <div className="flex items-center gap-3 w-full sm:w-64 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800">
            <span className="text-[11px] text-gray-400 whitespace-nowrap min-w-[100px]">
              {maxPriceFilter > 0 
                ? t('maxPriceSlider', { price: maxPriceFilter.toLocaleString() })
                : '10 000 FCFA max'}
            </span>
            <input
              id="price-range-slider"
              type="range"
              min={1000}
              max={6000}
              step={500}
              value={maxPriceFilter || 6000}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none"
              title="Ajuster le budget maximum"
            />
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-widest">
        <span>
          {t('accountsCount', { count: filteredAndSortedAccounts.length })}
        </span>
        {selectedFilter !== 'Tous' && (
          <button
            onClick={() => setSelectedFilter('Tous')}
            className="text-blue-400 hover:underline lowercase tracking-normal"
          >
            Réinitialiser ({selectedFilter})
          </button>
        )}
      </div>

      {/* Accounts Grid - Rendu complet et stable de tous les comptes */}
      {filteredAndSortedAccounts.length > 0 ? (
        <div className="catalog-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {filteredAndSortedAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onSelect={(acc) => setSelectedAccount(acc)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#16161D] border border-gray-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
            <Tv className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-200">
            {t('noAccountsFound')}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {t('tryChangingFilters')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('Tous');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Afficher tous les comptes
          </button>
        </div>
      )}

      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          isOpen={true}
          onClose={() => setSelectedAccount(null)}
        />
      )}

    </div>
  );
};