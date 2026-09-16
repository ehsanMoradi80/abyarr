import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600/95 text-white px-4 py-2 text-xs font-bold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
        <Wifi className="w-3.5 h-3.5" />
        <span>اتصال اینترنت برقرار شد — در حال همگام‌سازی...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-600/95 text-white px-4 py-2 text-xs font-bold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      <WifiOff className="w-3.5 h-3.5" />
      <span>حالت آفلاین — اطلاعات شما در حافظه دستگاه ذخیره می‌شود.</span>
    </div>
  );
};
