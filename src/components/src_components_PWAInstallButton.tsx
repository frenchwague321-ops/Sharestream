import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, CheckCircle2, Share, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Installé</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 ${className}`}
        title="Installer l'application sur votre appareil"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer App</span>
      </button>

      {/* Guide iOS Safari */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#16161D] border border-gray-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-xs text-gray-300">
            <h4 className="text-base font-bold text-white font-['Outfit']">
              Installer ShareStream sur iOS (iPhone / iPad)
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Share className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>1. Appuyez sur le bouton <strong>Partager</strong> en bas de Safari.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <PlusSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>2. Faites défiler et choisissez <strong>Sur l'écran d'accueil</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>3. Validez en cliquant sur <strong>Ajouter</strong> en haut à droite.</span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};