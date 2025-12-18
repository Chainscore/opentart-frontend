'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Footer() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-black">
      {/* Marquee strip */}
      <div className="border-y border-[var(--border)] py-4 overflow-hidden">
        <div className="marquee-track-fast">
          <span className="marquee-content text-sm font-mono text-[var(--text-muted)] whitespace-nowrap">
            OPEN SOURCE • MIT LICENSE • NO TRACKING • SELF-HOSTED • JAM PROTOCOL • TESSERA • POLKADOT • CHAINSCORE LABS • 
          </span>
          <span className="marquee-content text-sm font-mono text-[var(--text-muted)] whitespace-nowrap" aria-hidden="true">
            OPEN SOURCE • MIT LICENSE • NO TRACKING • SELF-HOSTED • JAM PROTOCOL • TESSERA • POLKADOT • CHAINSCORE LABS • 
          </span>
        </div>
      </div>

      {/* Main footer - ultra minimal, scattered */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="py-20 lg:py-32 grid grid-cols-2 lg:grid-cols-4 gap-y-16">
          {/* Column 1 - Logo stacked vertically */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex flex-col">
              <span 
                className="text-[8vw] lg:text-[4vw] font-display font-black leading-[0.8] tracking-tighter"
                style={{
                  WebkitTextStroke: '1px var(--accent)',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                OPEN
              </span>
              <span className="text-[8vw] lg:text-[4vw] font-display font-black leading-[0.8] tracking-tighter text-[var(--accent)]">
                TART
              </span>
            </div>
          </div>

          {/* Column 2 - Quick links, minimal */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.3em]">
              Navigate
            </span>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-fit">
                Dashboard
              </Link>
              <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-fit">
                Features
              </a>
            </div>
          </div>

          {/* Column 3 - External links */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.3em]">
              External
            </span>
            <div className="flex flex-col gap-3">
              <a 
                href="https://github.com/chainscore/opentart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-fit"
              >
                GitHub ↗
              </a>
              <a 
                href="https://docs.chainscore.finance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-fit"
              >
                Docs ↗
              </a>
              <a 
                href="https://twitter.com/chainscore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors w-fit"
              >
                Twitter ↗
              </a>
            </div>
          </div>

          {/* Column 4 - Live clock + status */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.3em]">
              Status
            </span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--success)] animate-pulse" />
                <span className="text-sm text-[var(--text-secondary)]">Online</span>
              </div>
              <span className="text-sm font-mono text-[var(--accent)] tabular-nums">
                {time || '00:00:00'}
              </span>
              <span className="text-sm text-[var(--text-muted)]">v0.1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - single line */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
            <span>© 2024 Chainscore Labs</span>
            <span className="hidden sm:block">Built for JAM validators</span>
            <span>MIT</span>
          </div>
        </div>
      </div>

      {/* Accent line */}
      <div className="h-px bg-[var(--accent)]" />
    </footer>
  );
}
