import React, { useState, useEffect } from 'react';
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
  Copy, 
  Check, 
  Share2, 
  Users, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AccountDetailModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  isOpen,
  onClose,
}) => {
  const { t, language, generateWhatsAppLink, whatsappNumber, showToast } = useApp();
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, account, onClose]);

  if (!isOpen || !account) return null;

  const isReserved = account.status === 'reserved';
  const platformPreset = PLATFORM_PRESETS.find(
    (p) => (p.name || '').toLowerCase() === (account?.platform || '').toLowerCase()
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ShareStream - ${account.name}`,
        text: `Louez ${account.name} à ${account.price.toLocaleString()} FCFA/mois sur ShareStream !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Lien de la page copié !', 'info');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="account-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0F0F12] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scaleUp"
      >
        
        {/* Banner with Close Button */}
        <div className="relative h-48 sm:h-64 w-full bg-[#0A0A0C] shrink-0">
          <img
            src={displayImage}
            alt={account.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/40 to-transparent" />

          {/* Close Button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            aria-label="Fermer la modale"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on banner */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${badgeColor}`}>
              {account.platform}
            </span>
            {account.quality && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/70 text-gray-200 border border-white/15 backdrop-blur-md">
                {account.quality}
              </span>
            )}
          </div>

          {/* Status & Slots */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div>
              {isReserved ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 backdrop-blur-md">
                  <Lock className="w-3.5 h-3.5" />
                  {t('statusReserved')}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('statusAvailable')}
                </span>
              )}
            </div>

            {account.slotsAvailable !== undefined && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 text-xs text-gray-300 font-medium backdrop-blur-md border border-white/10">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {account.slotsAvailable} / {account.slotsTotal || 5} {t('slotsLeft')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {account.name}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Catégorie : <span className="text-blue-400 font-semibold">{account.platform}</span>
              </p>
            </div>

            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-3 sm:p-4 text-right sm:min-w-[160px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                {t('pricePerMonth')}
              </span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {account.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-blue-400">FCFA</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Description de l'offre
            </h4>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {account.description}
            </p>
          </div>

          {/* Platform Features / Inclusions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Avantages inclus avec cet abonnement
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(account.features && account.features.length > 0 ? account.features : [
                'Profil privé et sécurisé avec code PIN',
                'Qualité vidéo maximale (4K UHD / Dolby Atmos)',
                'Garantie de renouvellement et support réactif',
                'Activation immédiate après validation WhatsApp'
              ]).map((feature, i) => (
                <div 
                  key={`feat-${i}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800/80 text-xs sm:text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Guarantees Note */}
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantie ShareStream Sérénité</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tous nos comptes sont vérifiés avant livraison. En cas de moindre interruption ou difficulté technique, l'administrateur vous réattribue un accès ou vous rembourse sans délai.
            </p>
          </div>

          {/* WhatsApp Direct Order Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-green-950/20 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>Message automatique prêt à envoyer</span>
              </div>
              <button
                onClick={handleCopyWhatsAppMessage}
                className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                title="Copier le texte du message"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <p className="text-xs text-gray-300 font-mono bg-black/40 p-3 rounded-xl border border-white/5 break-words select-all">
              "{prefilledMessage}"
            </p>

            <p className="text-[11px] text-gray-400">
              Support direct au : <span className="text-emerald-400 font-semibold">{whatsappNumber}</span>
            </p>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 bg-[#0A0A0C] border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? 'Lien copié !' : 'Partager cette offre'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Fermer
            </button>

            <a
              id="confirm-whatsapp-order-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                isReserved
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isReserved ? 'Indisponible' : t('whatsappOrderButton')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};