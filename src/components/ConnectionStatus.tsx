import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { testSupabaseConnection } from '../lib/supabase';

const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const checkConnections = async () => {
      const supabaseOk = await testSupabaseConnection();
      setSupabaseStatus(supabaseOk ? 'connected' : 'disconnected');
    };

    checkConnections();

    const handleOnline = () => {
      setIsOnline(true);
      checkConnections();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status if there are connection issues
    if (!isOnline || supabaseStatus === 'disconnected') {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, supabaseStatus]);

  // Auto-hide status after 5 seconds if everything is working
  useEffect(() => {
    if (isOnline && supabaseStatus === 'connected') {
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, supabaseStatus]);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'No internet connection',
        color: 'bg-red-500',
        textColor: 'text-red-100'
      };
    }

    if (supabaseStatus === 'disconnected') {
      return {
        icon: AlertTriangle,
        text: 'Service temporarily unavailable',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-100'
      };
    }

    if (supabaseStatus === 'connected') {
      return {
        icon: CheckCircle,
        text: 'All services connected',
        color: 'bg-green-500',
        textColor: 'text-green-100'
      };
    }

    return {
      icon: Wifi,
      text: 'Checking connections...',
      color: 'bg-blue-500',
      textColor: 'text-blue-100'
    };
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className={`${statusInfo.color} ${statusInfo.textColor} px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2`}>
            <Icon size={16} />
            <span className="text-sm font-medium">{statusInfo.text}</span>
            <button
              onClick={() => setShowStatus(false)}
              className="ml-2 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionStatus;