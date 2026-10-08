import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AccountCard } from './AccountCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  X, 
  TrendingUp, 
  Tv, 
  Music, 
  Film,
  RotateCcw
} from 'lucide-react';
import { FilterCategory, SortOption } from '../types';

export const HomeCatalog: React.FC = () => {
  const { accounts, t, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Tous');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(false);

  const categories: { label: FilterCategory; icon?: React.ReactNode }[] = [
    { label: 'Tous' },
    { label: 'Netflix' },
    { label: 'Spotify' },
    { label: 'Disney+' },
    { label: 'Autres' },
  ];

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          acc.name.toLowerCase().includes(query) ||
          acc.platform.toLowerCase().includes(query) ||
          acc.description.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'Tous' ||
          (selectedCategory === 'Autres'
            ? !['Netflix', 'Spotify', 'Disney+'].includes(acc.platform)
            : acc.platform.toLowerCase() === selectedCategory.toLowerCase());

        const matchesPrice = acc.price <= maxPrice;

        const matchesAvailability = filterOnlyAvailable ? acc.status === 'available' : true;

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [accounts, searchQuery, selectedCategory, sortBy, maxPrice, filterOnlyAvailable]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tous');
    setSortBy('newest');
    setMaxPrice(5000);
    setFilterOnlyAvailable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Bannière Hero Principale */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#0F0F14] to-[#0A0A0C] border border-gray-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Offres streaming vérifiées & garanties</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            Vos abonnements favoris à tarif solidaire & partagé
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Profitez de Netflix 4K, Spotify Famille, Disney+, Prime Video et plus encore à prix réduit avec profils privés sécurisés et activation instantanée via WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 text-green-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantie 30 jours sans interruption</span>
            </div>
            <span>•</span>
            <div>Paiement Orange Money, Wave & Free Money</div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search-accounts-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16161D] border border-gray-800 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                id="sort-accounts-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-[#16161D] border border-gray-800 text-xs text-gray-200 py-2.5 pl-3.5 pr-8 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
              </select>
              <SlidersHorizontal className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => setFilterOnlyAvailable(!filterOnlyAvailable)}
              className={`px-3 py-2.5 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterOnlyAvailable
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-[#16161D] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span>Disponibles uniquement</span>
            </button>
          </div>

        </div>

        {/* Boutons de Catégories et Slider de Prix */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-gray-800/80">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.label}
                id={`cat-btn-${cat.label}`}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.label
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-[#16161D] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {cat.label === 'Tous' ? t('filterAll') : cat.label}
              </button>
            ))}
          </div>

          {/* Slider de budget maximal */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs text-gray-400">
            <span className="whitespace-nowrap font-medium text-[11px]">
              {t('maxPriceSlider', { price: maxPrice.toLocaleString() })}
            </span>
            <input
              type="range"
              min="1000"
              max="5000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 sm:w-36 accent-blue-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none"
            />
            {(searchQuery || selectedCategory !== 'Tous' || maxPrice < 5000 || filterOnlyAvailable) && (
              <button
                onClick={resetFilters}
                className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                title={t('resetFilters')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Grille des Offres Disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400 font-medium">
            {t('accountsCount', { count: filteredAccounts.length })}
          </p>
        </div>

        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#16161D] border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              {t('noAccountsFound')}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {t('tryChangingFilters')}
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
            >
              {t('resetFilters')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};