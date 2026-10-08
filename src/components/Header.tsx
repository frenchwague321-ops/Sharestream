import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Tv, 
  Globe, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Smartphone, 
  Monitor, 
  Code2,
  LogIn
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    t, 
    currentUser, 
    logout, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    activeTab, 
    setActiveTab,
    mobileFrameMode,
    setMobileFrameMode
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F12]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md shadow-blue-600/10">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tighter text-blue-500 font-['Outfit']">
                  SHARESTREAM
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  MARKETPLACE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Connecté à Firebase Firestore en temps réel">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore
                </span>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">
                Streaming Account Marketplace
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0A0A0C] p-1.5 rounded-xl border border-gray-800">
            <button
              id="nav-home-btn"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-blue-600/15 text-blue-400 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {t('navHome')}
            </button>

            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('navAdmin')}</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              </button>
            )}

            {currentUser && (
              <button
                id="nav-profile-btn"
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                {t('navProfile')}
              </button>
            )}

            <button
              id="nav-code-btn"
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-green-500/20 text-green-400 font-semibold'
                  : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{t('androidCodeView')}</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* PWA Install Button */}
            <PWAInstallButton compact />

            {/* Mobile Simulator Frame Toggle */}
            <button
              id="toggle-mobile-frame-btn"
              onClick={() => setMobileFrameMode(!mobileFrameMode)}
              title={mobileFrameMode ? 'Passer en vue Web large' : 'Activer le simulateur Android Mobile'}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                mobileFrameMode 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' 
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200 border-gray-800'
              }`}
            >
              {mobileFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="hidden lg:inline">
                {mobileFrameMode ? 'Mode Web' : 'Android App'}
              </span>
            </button>

            {/* Language Toggle (FR / EN) */}
            <div className="bg-gray-800 p-1 rounded-full flex items-center border border-gray-700/50">
              <button
                id="language-btn-fr"
                onClick={() => language !== 'fr' && toggleLanguage()}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'fr' 
                    ? 'bg-gray-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                FR
              </button>
              <button
                id="language-btn-en"
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-gray-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Auth User Info or Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  id="user-badge-header"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 cursor-pointer transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-gray-200 truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {currentUser.role === 'admin' ? '👑 Admin' : 'Client'}
                    </div>
                  </div>
                </div>

                <button
                  id="logout-btn"
                  onClick={logout}
                  title={t('navLogout')}
                  className="p-2 rounded-xl bg-gray-900 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 text-xs sm:text-sm font-semibold border border-gray-800 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('navLogin')}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};