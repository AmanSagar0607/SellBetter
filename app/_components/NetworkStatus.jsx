'use client';

import { WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);

    // Event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-[9999] flex justify-center"
    >
      <div className="bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-500/20 backdrop-blur-lg px-6 py-4 rounded-b-2xl shadow-xl border border-red-500/20 max-w-md w-full mx-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <WifiOff className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-400 font-medium mb-1">No Internet Connection</h3>
            <p className="text-red-400/70 text-sm">Please check your network connection and try again</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
