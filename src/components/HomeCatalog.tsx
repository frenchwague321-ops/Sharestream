import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Account, FilterCategory } from '../types';
import { AccountCard } from './AccountCard';
import { AccountDetailModal } from './AccountDetailModal';
import { 
  Search, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap, 
  MessageCircle, 
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

type SortOption = 'newest' | 'price_asc' | 'price_desc';

export const HomeCatalog: React.FC = () => {
  const { 
    accounts, 
    language, 
    t, 
    selectedAccount, 
    setSelectedAccount 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('Tous');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0); // 0 = no price filter

  // Filter options array
  const filterButtons: { key: FilterCategory; labelKey: 'filterAll' | 'filterNetflix' | 'filterSpotify' | 'filterDisney' | 'filterOthers' }[] = [
    { key: 'Tous', labelKey: 'filterAll' },
    { key: 'Netflix', labelKey: 'filterNetflix' },
    { key: 'Spotify', labelKey: 'filterSpotify' },
    { key: 'Disney+', labelKey: 'filterDisney' },
    { key: 'Autres', labelKey: 'filterOthers' },
  ];

  // Price presets
  const pricePresets = [
    { value: 0, labelKey: 'allPrices' as const },
    { value: 2000, label: '≤ 2 000 FCFA' },
    { value: 3000, label: '≤ 3 000 FCFA' },
    { value: 5000, label: '≤ 5 000 FCFA' },
  ];

  // Filter and Sort Logic
  const filteredAndSortedAccounts = useMemo(() => {
    let result = Array.isArray(accounts) ? [...accounts] : [];
    result = result.filter(Boolean);

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

    // 2. Category Filter
    if (selectedFilter !== 'Tous') {
      const targetCategory = (selectedFilter || '').toLowerCase();
      if (selectedFilter === 'Autres') {
        result = result.filter(
          (acc) => !['netflix', 'spotify', 'disney+'].includes((acc?.platform || '').toLowerCase())
        );
      } else {
        result = result.filter(
          (acc) => (acc?.platform || '').toLowerCase() === targetCategory
        );
      }
    }

    // 3. Price Filter (range or select)
    if (maxPriceFilter > 0) {
      result = result.filter((acc) => (acc?.price || 0) <= maxPriceFilter);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (selectedSort === 'price_asc') {
        return (a?.price || 0) - (b?.price || 0);
      }
      if (selectedSort === 'price_desc') {
        return (b?.price || 0) - (a?.price || 0);
      }
      // Newest
      return (b?.createdAt || 0) - (a?.createdAt || 0);
    });

    return result;
  }, [accounts, searchQuery, selectedFilter, selectedSort, maxPriceFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F0F12] via-[#16161D] to-[#0A0A0C] border border-gray-800 p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('heroBadge')}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'en' ? (
              <>Premium accounts at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">unbeatable prices</span></>
            ) : (
              <>Des comptes premium à <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">prix imbattables</span></>
            )}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'Access official subscriptions shared safely. Reserve in one click, get your credentials instantly via WhatsApp.'
              : 'Accédez à vos abonnements favoris en toute sécurité. Réservez en 1 clic et recevez vos identifiants par WhatsApp.'}
          </p>

          {/* Quick trust metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
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
          
          {/* Filter Category Tabs [Tous] [Netflix] [Spotify] [Disney+] [Autres] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterButtons.map((fb, index) => {
              const isSelected = selectedFilter === fb.key;
              const count = fb.key === 'Tous'
                ? (Array.isArray(accounts) ? accounts.length : 0)
                : fb.key === 'Autres'
                ? (Array.isArray(accounts) ? accounts.filter(a => !['netflix', 'spotify', 'disney+'].includes((a?.platform || '').toLowerCase())).length : 0)
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

        {/* Filter sub-bar: Price filter presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-800/60 text-xs">
          <span className="text-gray-400 font-medium flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3 text-blue-400" />
            Prix :
          </span>

          {pricePresets.map((preset) => {
            const isActive = maxPriceFilter === preset.value;
            return (
              <button
                key={`price-preset-${preset.value}`}
                onClick={() => setMaxPriceFilter(preset.value)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'bg-gray-900/60 text-gray-400 hover:text-gray-300 border border-gray-800/80'
                }`}
              >
                {preset.labelKey ? t(preset.labelKey) : preset.label}
              </button>
            );
          })}

          {/* Reset Filters button if active */}
          {(selectedFilter !== 'Tous' || maxPriceFilter > 0 || (searchQuery || '').trim() !== '') && (
            <button
              onClick={() => {
                setSelectedFilter('Tous');
                setMaxPriceFilter(0);
                setSearchQuery('');
              }}
              className="ml-auto flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors py-1 px-2 rounded hover:bg-gray-800/50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'en' ? 'Reset' : 'Réinitialiser'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Catalog Results Summary */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <div>
          Affichage de <span className="text-gray-200 font-semibold">{filteredAndSortedAccounts.length}</span> offre{filteredAndSortedAccounts.length > 1 ? 's' : ''} disponible{filteredAndSortedAccounts.length > 1 ? 's' : ''}
          {selectedFilter !== 'Tous' && <span className="ml-1 text-blue-400">pour {selectedFilter}</span>}
          {maxPriceFilter > 0 && <span className="ml-1 text-blue-400">({`≤ ${maxPriceFilter.toLocaleString()} FCFA`})</span>}
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredAndSortedAccounts.length > 0 ? (
        <div className="catalog-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {filteredAndSortedAccounts.map((account, index) => {
            const cardKey = account.id ? `account-item-${account.id}` : `account-index-${index}`;
            return (
              <AccountCard
                key={cardKey}
                account={account}
                onSelect={(acc) => setSelectedAccount(acc)}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0F0F12] border border-gray-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/80 flex items-center justify-center text-gray-500">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-200">
              {t('emptyAccountsTitle')}
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              {t('emptyAccountsDesc')}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedFilter('Tous');
              setMaxPriceFilter(0);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      )}

      {/* Account Detail Modal */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={Boolean(selectedAccount)}
        onClose={() => setSelectedAccount(null)}
      />

    </div>
  );
};