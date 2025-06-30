import React, { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../lib/supabase';

interface DebugInfo {
  environment: string;
  supabaseUrl: string;
  supabaseKeyExists: boolean;
  supabaseConnection: boolean | null;
  currentUser: any;
  localStorage: any;
  networkStatus: boolean;
}

const Debug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    environment: import.meta.env.MODE,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not set',
    supabaseKeyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseConnection: null,
    currentUser: null,
    localStorage: {},
    networkStatus: navigator.onLine
  });

  useEffect(() => {
    const checkConnections = async () => {
      // Test Supabase connection
      const supabaseOk = await testSupabaseConnection();
      
      // Get current user
      const userStr = localStorage.getItem('customUser');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      // Get all localStorage data
      const localStorageData: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }

      setDebugInfo(prev => ({
        ...prev,
        supabaseConnection: supabaseOk,
        currentUser,
        localStorage: localStorageData
      }));
    };

    checkConnections();

    // Listen for network changes
    const handleOnline = () => setDebugInfo(prev => ({ ...prev, networkStatus: true }));
    const handleOffline = () => setDebugInfo(prev => ({ ...prev, networkStatus: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 opacity-80">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Environment: {debugInfo.environment}</div>
        <div>Network: {debugInfo.networkStatus ? '✅ Online' : '❌ Offline'}</div>
        <div>Supabase URL: {debugInfo.supabaseUrl.includes('example') ? '❌ Not configured' : '✅ Configured'}</div>
        <div>Supabase Key: {debugInfo.supabaseKeyExists ? '✅ Present' : '❌ Missing'}</div>
        <div>Supabase Connection: {
          debugInfo.supabaseConnection === null ? '⏳ Testing...' :
          debugInfo.supabaseConnection ? '✅ Connected' : '❌ Failed'
        }</div>
        <div>Current User: {debugInfo.currentUser ? `✅ ${debugInfo.currentUser.username}` : '❌ None'}</div>
        <div>LocalStorage Keys: {Object.keys(debugInfo.localStorage).length}</div>
      </div>
    </div>
  );
};

export default Debug;