'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Minimal fixed header - only shows after scroll */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-black/90 backdrop-blur-md border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/landing" className="text-lg font-bold font-display tracking-tight">
              OPEN<span className="text-[var(--accent)]">TART</span>
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-[var(--accent)] text-black font-medium text-sm"
            >
              Enter App
            </Link>
          </div>
        </div>
      </header>

      {/* Scattered navigation elements - visible on initial load, blend into hero */}
      <div className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="flex items-start justify-between">
            {/* Logo - top left, minimal */}
            <div className="pointer-events-auto">
              <Link href="/landing" className="text-xl font-bold font-display tracking-tight">
                OPEN<span className="text-[var(--accent)]">TART</span>
              </Link>
            </div>

            {/* Scattered nav items - float in different positions */}
            <div className="flex items-center gap-6 pointer-events-auto">
              <a 
                href="#features" 
                className="text-xs font-mono text-[var(--text-muted)] hover:text-white uppercase tracking-widest transition-colors"
              >
                Features
              </a>
              <a 
                href="https://github.com/chainscore/opentart" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--text-muted)] hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                GitHub
                <ArrowUpRight size={10} />
              </a>
              <a 
                href="https://docs.chainscore.finance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--text-muted)] hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                Docs
                <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
