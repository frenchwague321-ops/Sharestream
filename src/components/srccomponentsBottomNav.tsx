import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, ShieldCheck, User, Code2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, t } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F12]/95 backdrop-blur-lg border-t border-gray-800 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-blue-400 font-semibold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110 text-blue-400' : ''}`} />
          <span className="text-[10px] mt-1">{t('navHome')}</span>
        </button>

        {/* Admin (Only if role === 'admin') */}
        {currentUser?.role === 'admin' && (
          <button
            id="mobile-nav-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              activeTab === 'admin'
                ? 'text-purple-400 font-semibold'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'scale-110 text-purple-400' : ''}`} />
            <span className="text-[10px] mt-1">{t('navAdmin')}</span>
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>
        )}

        {/* Profile */}
        <button
          id="mobile-nav-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-blue-400 font-semibold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'scale-110 text-blue-400' : ''}`} />
          <span className="text-[10px] mt-1">{t('navProfile')}</span>
        </button>

        {/* Android Code */}
        <button
          id="mobile-nav-code"
          onClick={() => setActiveTab('code')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'code'
              ? 'text-green-400 font-semibold'
              : 'text-gray-400 hover:text-green-300'
          }`}
        >
          <Code2 className={`w-5 h-5 ${activeTab === 'code' ? 'scale-110 text-green-400' : ''}`} />
          <span className="text-[10px] mt-1">Kotlin</span>
        </button>

      </div>
    </nav>
  );
};