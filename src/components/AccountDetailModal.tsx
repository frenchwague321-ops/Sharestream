import React, { useState } from 'react';
import { Account } from '../types';
import { useApp } from '../context/AppContext';
import { PLATFORM_PRESETS } from '../data/initialData';
import { 
  X, 
  MessageCircle, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Users, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  Phone,
  ArrowUpRight
} from 'lucide-react';

interface AccountDetailModalProps {
  account: Account | null;
  onClose: () => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({ account, onClose }) => {
  const { 
    t, 
    language, 
    generateWhatsAppLink, 
    reserveAccount, 
    whatsappNumber,
    showToast 
  } = useApp();

  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!account) return null;

  const isReserved = account.status === 'reserved';
  const platformPreset = PLATFORM_PRESETS.find(
    (p) => p.name.toLowerCase() === account.platform.toLowerCase()
  );

  const displayImage = account.imageUrl || platformPreset?.banner || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
  const badgeColor = platformPreset?.badgeColor || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  
  const whatsappUrl = generateWhatsAppLink(account);
  
  const prefilledMessage = language === 'en'
    ? `Hello, I would like to rent ${account.name} for ${account.price.toLocaleString()} FCFA/month. Thank you!`
    : `Bonjour, je souhaite louer ${account.name} pour ${account.price.toLocaleString()} FCFA/mois. Merci !`;

  const handleCopyWhatsAppMessage = () => {
    navigator.clipboard.writeText(prefilledMessage);
    setCopiedMessage(true);
    showToast('Message copié dans le presse-papier !', 'info');
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleReserve = () => {
    reserveAccount(account.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div 
        id="account-detail-modal"
        className="relative w-full max-w-2xl bg-[#0F0F12] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0A0A0C]/80 hover:bg-black text-gray-300 hover:text-white border border-gray-700 backdrop-blur-md transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Banner / Big Image */}
          <div className="relative h-64 sm:h-72 w-full bg-[#0A0A0C] overflow-hidden">
            <img
              src={displayImage}
              alt={account.name}
              className={`w-full h-full object-cover ${isReserved ? 'filter brightness-75 grayscale' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${badgeColor}`}>
                {account.platform}
              </span>
              {account.quality && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-black/70 text-gray-200 border border-white/15 backdrop-blur-md">
                  {account.quality}
                </span>
              )}
            </div>

            {/* Status indicator on Image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1 block">
                  {account.platform} Official Subscription
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit']">
                  {account.name}
                </h1>
              </div>

              {/* Status Badge */}
              {isReserved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t('statusReserved')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span>{t('statusAvailable')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Price & Highlight Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {t('priceLabel')}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-bold text-white font-['Outfit']">
                    {account.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-blue-400 uppercase">
                    {t('currency')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {t('perMonth')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A0A0C] border border-gray-800 text-xs text-gray-300">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{account.profilesCount || 5} {t('profiles')}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-950/40 border border-green-800/40 text-xs text-green-400 font-medium">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span>Livraison Instantanée</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                {t('descriptionLabel')}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
                {account.description}
              </p>
            </div>

            {/* Included Features List */}
            {account.features && account.features.length > 0 && (
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2.5">
                  {t('featuresIncluded')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {account.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Pre-filled Message Card */}
            <div className="p-4 rounded-2xl bg-green-950/20 border border-green-700/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message WhatsApp pré-rempli</span>
                </div>
                <button
                  onClick={handleCopyWhatsAppMessage}
                  className="flex items-center gap-1 text-[11px] text-green-300 hover:text-green-200 bg-green-900/40 hover:bg-green-900/60 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMessage ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-green-900/40 text-xs text-gray-300 font-mono italic">
                "{prefilledMessage}"
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Phone className="w-3 h-3 text-green-400" />
                <span>Numéro officiel : <strong className="text-gray-200">{whatsappNumber}</strong></span>
              </div>
            </div>

            {/* ShareStream Guarantee Box */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-950/20 border border-blue-700/30 text-xs text-gray-300">
              <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">{t('guaranteeTitle')}</strong>
                <span className="text-gray-400">{t('guaranteeText')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#0A0A0C] border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            id="back-to-home-modal-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold border border-gray-800 transition-colors order-2 sm:order-1 flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>{t('btnBackToHome')}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            
            {/* Instant Reserve Button */}
            <button
              id="reserve-modal-btn"
              onClick={handleReserve}
              disabled={isReserved}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isReserved
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReserved ? t('btnAlreadyReserved') : t('btnInstantReserve')}</span>
            </button>

            {/* WhatsApp Primary Action Button */}
            <a
              id="whatsapp-modal-direct-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-green-600/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t('btnWhatsApp')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>

        </div>

      </div>
    </div>
  );
};