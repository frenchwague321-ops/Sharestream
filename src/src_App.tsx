import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeCatalog } from './components/HomeCatalog';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { AccountDetailModal } from './components/AccountDetailModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileFrame } from './components/MobileFrame';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ShieldCheck, MessageCircle, Tv, Heart, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    selectedAccount, 
    setSelectedAccount, 
    mobileFrameMode,
    t,
    whatsappNumber,
    toggleLanguage,
    language
  } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'code':
        return <AndroidCodeViewer />;
      case 'home':
      default:
        return <HomeCatalog />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1 pb-16 md:pb-8 pt-4">
        <PWAInstallBanner />

        {mobileFrameMode ? (
          <MobileFrame>
            {renderContent()}
          </MobileFrame>
        ) : (
          renderContent()
        )}
      </main>

      <OfflineIndicator />

      {!mobileFrameMode && (
        <footer className="border-t border-gray-800 bg-[#0F0F12] py-10 px-4 sm:px-6 lg:px-8 text-xs text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-200 tracking-tight font-['Outfit'] text-sm">
                  SHARESTREAM • Location Streaming
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                  Streaming Account Marketplace • Firebase & Kotlin MVVM Ready
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-green-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Paiements & Profils Sécurisés</span>
              </span>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-300 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>Support WhatsApp : {whatsappNumber}</span>
              </a>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Langue : {language.toUpperCase()}</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-500 text-center md:text-right">
              Application Android Kotlin & Web MVVM • 2026 ShareStream Inc.
            </div>

          </div>
        </footer>
      )}

      <BottomNav />

      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}