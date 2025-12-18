'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Dramatic gradient orbs */}
      {/* <div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          left: `calc(30% + ${mousePos.x * 50}px)`,
          top: `calc(20% + ${mousePos.y * 50}px)`,
          transition: 'left 0.3s ease-out, top 0.3s ease-out',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)',
          right: `calc(20% + ${mousePos.x * -30}px)`,
          bottom: `calc(30% + ${mousePos.y * -30}px)`,
          transition: 'right 0.3s ease-out, bottom 0.3s ease-out',
        }}
      /> */}

      {/* Infinite marquee - top */}
      <div className="absolute top-20 left-0 right-0 overflow-hidden opacity-10">
        <div className="marquee-track">
          <span className="marquee-content text-[200px] font-display font-black tracking-tighter whitespace-nowrap">
            TELEMETRY • ANALYTICS • REAL-TIME • VALIDATORS • NODES • BLOCKS • 
          </span>
          <span className="marquee-content text-[200px] font-display font-black tracking-tighter whitespace-nowrap" aria-hidden="true">
            TELEMETRY • ANALYTICS • REAL-TIME • VALIDATORS • NODES • BLOCKS • 
          </span>
        </div>
      </div>

      {/* Main content - asymmetric layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-20">
        {/* Oversized typography - breaks the grid */}
        <div 
          className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg)`,
          }}
        >
          {/* "YOUR" - massive, outlined */}
          <div className="relative">
            <h1 
              className="text-[20vw] lg:text-[15vw] font-display font-black leading-[0.8] tracking-tighter"
              style={{
                WebkitTextStroke: '2px var(--accent)',
                WebkitTextFillColor: 'transparent',
              }}
            >
              YOUR
            </h1>
          </div>
          {/* "NODES" - solid, offset */}
          <div className="relative -mt-4 lg:-mt-8 ml-[10vw]">
            <h1 className="text-[22vw] lg:text-[18vw] font-display font-black leading-[0.8] tracking-tighter text-[var(--accent)]">
              NODES
            </h1>
            
            {/* Decorative line */}
            <div className="absolute left-0 top-1/2 w-[15vw] h-[3px] bg-[var(--accent)] -translate-x-full" />
          </div>

          {/* "DON'T LIE" - italic, different weight */}
          <div className="relative -mt-2 lg:-mt-6 flex items-end gap-4">
            <h1 
              className="text-[15vw] lg:text-[12vw] font-display font-light italic leading-[0.8] tracking-tight text-[var(--text-muted)]"
            >
              DON&apos;T
            </h1>
            <h1 
              className="text-[18vw] lg:text-[14vw] font-display font-black leading-[0.8] tracking-tighter text-white"
            >
              LIE
            </h1>
            
            {/* Terminal cursor */}
            <span className="text-[var(--accent)] text-6xl lg:text-8xl animate-pulse ml-2">_</span>
          </div>
        </div>

        {/* Split content - asymmetric grid */}
        <div 
          className={`mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          {/* Left - description (spans 5 cols, offset) */}
          <div className="lg:col-span-5 lg:col-start-2">
            <p className="text-xl lg:text-2xl text-[var(--text-secondary)] leading-relaxed font-light">
              Open-source telemetry for 
              <span className="text-white font-medium"> JAM Protocol</span>. 
              We don&apos;t watch your validators. 
              <span className="text-[var(--accent)]"> You do.</span>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                href="/"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-black font-bold text-lg overflow-hidden hover:bg-[var(--accent)] transition-colors"
              >
                <Zap size={20} />
                <span>Enter Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <a 
                href="https://github.com/chainscore/opentart"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/20 text-white font-medium text-lg hover:border-white transition-colors"
              >
                <span>View Source</span>
              </a>
            </div>
          </div>

          {/* Right - stats/visual element (spans 4 cols, at end) */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
            {/* Live indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-[var(--success)] animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-[var(--success)] animate-ping" />
              </div>
              <span className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-widest">
                Live Telemetry Active
              </span>
            </div>

            {/* Abstract stats */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl lg:text-7xl font-display font-black text-white">∞</span>
                <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Nodes<br/>Supported</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl lg:text-7xl font-display font-black text-[var(--accent)]">0</span>
                <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Data Sent<br/>To Us</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee - reverse direction */}
      <div className="absolute bottom-10 left-0 right-0 overflow-hidden opacity-5">
        <div className="marquee-track-reverse">
          <span className="marquee-content text-[150px] font-display font-black tracking-tighter whitespace-nowrap">
            JAM • CHAINSCORE • TESSERA • POLKADOT • WEB3 • DECENTRALIZED • 
          </span>
          <span className="marquee-content text-[150px] font-display font-black tracking-tighter whitespace-nowrap" aria-hidden="true">
            JAM • CHAINSCORE • TESSERA • POLKADOT • WEB3 • DECENTRALIZED • 
          </span>
        </div>
      </div>

      {/* Vertical text - side accent */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <span 
          className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-[0.5em] writing-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Scroll to explore
        </span>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-4">
        <span className="text-xs font-mono text-[var(--text-muted)]">v0.1.0</span>
        <div className="w-12 h-px bg-[var(--border)]" />
        <span className="text-xs font-mono text-[var(--accent)]">BETA</span>
      </div>
    </section>
  );
}
