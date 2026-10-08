import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm p-3 rounded-2xl bg-amber-500/95 text-black font-semibold text-xs shadow-xl flex items-center gap-2.5 animate-bounce">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <div>
        <p className="font-bold">Mode Hors Ligne Activé</p>
        <p className="text-[10px] font-normal leading-tight opacity-90">
          Les données locales sont consultables. La synchronisation reprendra dès le retour du réseau.
        </p>
      </div>
    </div>
  );
};