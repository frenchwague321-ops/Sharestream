import React, { ReactNode, useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  // Détection mobile : écran <= 768px ou appareil mobile (Android / iOS)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return mediaQuery.matches || isMobileUA;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const checkMobile = () => {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mediaQuery.matches || isMobileUA);
    };

    checkMobile();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkMobile);
      return () => mediaQuery.removeEventListener('change', checkMobile);
    } else {
      mediaQuery.addListener(checkMobile);
      return () => mediaQuery.removeListener(checkMobile);
    }
  }, []);

  // Si on est sur un appareil mobile ou petit écran, on affiche l'application directement en plein écran (sans cadre)
  if (isMobile) {
    return <>{children}</>;
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py-6 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#0A0A0C]">
      
      {/* Device wrapper */}
      <div className="relative w-full max-w-[420px] h-[850px] bg-[#0A0A0C] rounded-[48px] border-[10px] border-gray-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5">
        
        {/* Android Punch-hole Camera & Speaker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="h-7 bg-[#0A0A0C] px-6 flex items-center justify-between text-[11px] font-semibold text-gray-300 select-none z-40 border-b border-gray-900">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-gray-300" />
            <Wifi className="w-3.5 h-3.5 text-gray-300" />
            <BatteryMedium className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        {/* Mobile Viewport Screen */}
        <div className="flex-1 overflow-y-auto bg-[#0A0A0C] relative scrollbar-none pb-20">
          {children}
        </div>

        {/* Android Navigation Gesture Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>

      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulateur Android (API 26+) - Basculez vers le mode Web large dans la barre supérieure</span>
        </p>
      </div>

    </div>
  );
};