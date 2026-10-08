import React from 'react';
import { Account } from '../types';
import { useApp } from '../context/AppContext';
import { PLATFORM_PRESETS } from '../data/initialData';
import { MessageCircle, CheckCircle2, Lock, ArrowRight, ShieldAlert, Sparkles, Users } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onSelect: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onSelect }) => {
  const { t, generateWhatsAppLink } = useApp();

  const isReserved = account.status === 'reserved';
  const platformPreset = PLATFORM_PRESETS.find(
    (p) => p.name.toLowerCase() === account.platform.toLowerCase()
  );

  const badgeColor = platformPreset?.badgeColor || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  const displayImage = account.imageUrl || platformPreset?.logo || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppLink(account);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`account-card-${account.id}`}
      onClick={() => onSelect(account)}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
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
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isReserved ? 'filter brightness-75' : ''
          }`}
          loading="lazy"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161D] via-[#16161D]/40 to-transparent" />

        {/* Platform Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${badgeColor}`}>
            {account.platform}
          </span>
          {account.quality && (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-gray-300 border border-white/10 backdrop-blur-md">
              {account.quality}
            </span>
          )}
        </div>

        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          {isReserved ? (
            <span 
              id={`status-badge-reserved-${account.id}`}
              className="inline-flex items-center gap-1 bg-gray-500/20 text-gray-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md border border-gray-500/30"
            >
              <Lock className="w-3 h-3 text-gray-400" />
              <span>{t('statusReserved')}</span>
            </span>
          ) : (
            <span 
              id={`status-badge-available-${account.id}`}
              className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md border border-green-500/30"
            >
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span>{t('statusAvailable')}</span>
            </span>
          )}
        </div>

        {/* Slots & Profile Count Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {account.slotsAvailable !== undefined 
                ? `${account.slotsAvailable}/${account.slotsTotal || account.profilesCount || 5} ${t('slotAvailable')}`
                : `${account.profilesCount || 5} ${t('profiles')}`}
            </span>
          </div>
          <span className="text-[10px] text-blue-300 font-medium flex items-center gap-1 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            100% Garanti
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Account Title */}
          <h3 className="font-bold text-base sm:text-lg text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">
            {account.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {account.description}
          </p>
        </div>

        {/* Price & Action Bar */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="text-[9px] uppercase tracking-wider font-semibold text-gray-500">
              {t('priceLabel')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-['Outfit']">
                {account.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 uppercase ml-0.5">
                {t('currency')} / mois
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Direct WhatsApp trigger */}
            <button
              id={`whatsapp-btn-${account.id}`}
              onClick={handleWhatsAppClick}
              title="Contacter sur WhatsApp"
              className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* View Details */}
            <button
              id={`view-detail-btn-${account.id}`}
              onClick={() => onSelect(account)}
              className="px-3 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1 border border-blue-500/20 hover:border-blue-500 transition-all duration-200"
            >
              <span>{t('viewDetails')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};