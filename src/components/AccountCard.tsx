import React from 'react';
import { Account } from '../types';
import { useApp } from '../context/AppContext';
import { PLATFORM_PRESETS } from '../data/initialData';
import { MessageCircle, CheckCircle2, Lock, ArrowRight, Sparkles, Users } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onSelect: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect }) => {
  const { t, generateWhatsAppLink } = useApp();

  const isReserved = account.status === 'reserved';
  const platformPreset = PLATFORM_PRESETS.find(
    (p) => (p.name || '').toLowerCase() === (account?.platform || '').toLowerCase()
  );

  const badgeColor = platformPreset?.badgeColor || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  const displayImage = account.imageUrl || platformPreset?.logo || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';

  const handleCardClick = () => {
    onSelect(account);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(account);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppLink(account);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`account-card-${account.id}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(account);
        }
      }}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col select-none w-full min-w-[260px] ${
        isReserved
          ? 'bg-[#16161D] border-gray-800 opacity-60 grayscale hover:opacity-80'
          : 'bg-[#16161D] border-gray-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5'
      }`}
    >
      {/* Platform Banner / Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0A0A0C]">
        <img
          src={displayImage}
          alt={account.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161D] via-[#16161D]/40 to-transparent" />

        {/* Platform Badge (e.g. Netflix, Spotify) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${badgeColor}`}>
            {account.platform}
          </span>
          {account.quality && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-gray-200 border border-white/10 backdrop-blur-md">
              {account.quality}
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isReserved ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 backdrop-blur-md">
              <Lock className="w-3 h-3" />
              {t('statusReserved')}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              {t('statusAvailable')}
            </span>
          )}
        </div>

        {/* Slots Badge */}
        {account.slotsAvailable !== undefined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-[11px] text-gray-300 font-medium backdrop-blur-sm border border-white/10">
            <Users className="w-3 h-3 text-blue-400" />
            <span>
              {account.slotsAvailable} / {account.slotsTotal || 5} {t('slotsLeft')}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Description */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {account.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {account.description}
          </p>
        </div>

        {/* Key Features Pill List */}
        {account.features && account.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {account.features.slice(0, 2).map((feat, idx) => (
              <span
                key={`feat-${account.id}-${idx}`}
                className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded-md border border-gray-800"
              >
                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                <span className="truncate max-w-[140px]">{feat}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer: Price & Actions */}
        <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
          
          {/* Price */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              {t('pricePerMonth')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {account.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-blue-400">FCFA</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Direct WhatsApp Button */}
            <button
              id={`whatsapp-btn-${account.id}`}
              type="button"
              onClick={handleWhatsAppClick}
              disabled={isReserved}
              title={t('whatsappContact')}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isReserved
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Details Button */}
            <button
              id={`details-btn-${account.id}`}
              type="button"
              onClick={handleDetailsClick}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 border border-gray-700/60 active:scale-95"
            >
              <span className="hidden sm:inline">{t('seeDetails')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};