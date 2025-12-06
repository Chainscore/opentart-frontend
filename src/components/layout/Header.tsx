'use client';

import { useEffect, useState } from 'react';
import { getWebSocket } from '@/lib/websocket';

export function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const ws = getWebSocket();
    const unsubscribe = ws.onConnection((connected) => {
      setIsConnected(connected);
    });
    ws.connect();

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <header className="h-16 bg-[var(--bg-primary)] border-b border-[var(--border)] flex items-center justify-between px-6">
      <div />
      
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 ${isConnected ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`} />
          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>

        {/* Time */}
        <span className="text-sm text-[var(--text-muted)] font-mono">{currentTime}</span>
      </div>
    </header>
  );
}
