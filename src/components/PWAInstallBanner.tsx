import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallButton } from './PWAInstallButton';
import { Tv, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-blue-500/20 flex items-center justify-between gap-3 shadow-lg">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 flex-shrink-0">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                Installez ShareStream sur votre téléphone
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 hidden sm:inline" />
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Accès rapide comme une application native Android/iOS, avec mode hors-ligne.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};