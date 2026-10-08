import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  Tv, 
  Sparkles, 
  ArrowRight, 
  LogOut, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { 
    currentUser, 
    reservations, 
    accounts,
    setSelectedAccount, 
    setActiveTab, 
    t, 
    logout, 
    setIsAuthModalOpen,
    setAuthModalMode,
    generateWhatsAppLink,
    whatsappNumber
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#0F0F12] border border-gray-800 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Outfit']">
          {t('navProfile')}
        </h2>
        <p className="text-sm text-gray-400">
          Veuillez vous connecter pour consulter vos réservations et votre profil.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-all border border-gray-700"
          >
            Créer un compte
          </button>
        </div>
      </div>
    );
  }

  // Filter reservations for current user safely
  const userReservations = reservations.filter(
    (r) => r.userId === currentUser.id || (r.userEmail && r.userEmail.toLowerCase() === currentUser.email?.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F0F12] border border-gray-800 shadow-xl relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl ${
              currentUser.role === 'admin' 
                ? 'bg-purple-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  {currentUser.name}
                </h1>
                {currentUser.role === 'admin' ? (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    Membre
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span className="font-mono text-gray-300">{currentUser.email}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Inscrit le {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-rose-400 border border-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('navLogout')}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reservation History Section */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
              {t('myReservationsTitle')}
            </h2>
            <p className="text-xs text-gray-400">
              Historique complet de vos abonnements et locations actives
            </p>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <span>Louer un service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reservations List */}
        {userReservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {userReservations.map((res) => {
              const matchedAccount = accounts.find((a) => a.id === res.accountId);
              const isActive = res.status === 'active';

              return (
                <div
                  key={res.id}
                  id={`reservation-item-${res.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-[#16161D] border border-gray-800 hover:border-gray-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#0A0A0C] border border-gray-800 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Tv className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-blue-400">
                          {res.platform || matchedAccount?.platform || 'Streaming'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {isActive ? t('resStatusActive') : t('resStatusEnded')}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-white mt-0.5">
                        {res.accountName}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {new Date(res.reservedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-white">
                          {(res.price || matchedAccount?.price || 0).toLocaleString()} FCFA <span className="text-[10px] text-gray-500 font-normal">/ mois</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions on this reservation */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {matchedAccount && (
                      <button
                        onClick={() => setSelectedAccount(matchedAccount)}
                        className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold border border-gray-800 transition-colors"
                      >
                        Voir fiche
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, j'ai une question concernant ma réservation #${res.id} pour ${res.accountName}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-green-950/40 hover:bg-[#25D366] text-green-400 hover:text-white border border-green-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('btnWhatsAppDirect')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 p-6 rounded-2xl bg-[#16161D] border border-gray-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0A0A0C] border border-gray-800 flex items-center justify-center text-gray-400">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-200">
              {t('noReservationsYet')}
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {t('browseAccountsToReserve')}
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Découvrir le catalogue
            </button>
          </div>
        )}

      </div>

      {/* Safety Info */}
      <div className="p-4 rounded-2xl bg-[#16161D] border border-gray-800 flex items-center gap-3 text-xs text-gray-400">
        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <span>
          Besoin d'aide pour vos identifiants ou le renouvellement de votre profil ? Contactez l'assistance WhatsApp disponible 24/7 au <strong>{whatsappNumber}</strong>.
        </span>
      </div>

    </div>
  );
};