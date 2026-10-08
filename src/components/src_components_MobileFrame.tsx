import React from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, RotateCcw, Sparkles } from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setMobileFrameMode } = useApp();

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[85vh] animate-fadeIn px-2">
      <div className="mb-4 flex items-center gap-3 bg-gray-900/80 px-4 py-1.5 rounded-full border border-gray-800 text-xs text-gray-300">
        <Smartphone className="w-4 h-4 text-blue-400" />
        <span>Aperçu Simulateur Smartphone Android (1080x2400)</span>
        <button
          onClick={() => setMobileFrameMode(false)}
          className="text-xs text-blue-400 hover:text-blue-300 underline ml-2"
        >
          Plein écran
        </button>
      </div>

      <div className="relative w-full max-w-[400px] h-[780px] bg-[#000000] rounded-[48px] p-3.5 shadow-2xl shadow-blue-950/30 border-4 border-gray-800 flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Encoche Smartphone & Caméra Frontale */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-gray-900 rounded-b-2xl z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-black border border-gray-700" />
          <div className="w-10 h-1 rounded-full bg-gray-800" />
        </div>

        {/* Écran du Smartphone */}
        <div className="relative flex-1 bg-[#0A0A0C] rounded-[36px] overflow-y-auto overflow-x-hidden pt-4 pb-14 scrollbar-none flex flex-col">
          {children}
        </div>

        {/* Barre d'accueil inférieure type Android gesture */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full z-30" />
      </div>
    </div>
  );
};