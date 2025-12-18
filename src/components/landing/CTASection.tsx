'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Diagonal split background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, black 0%, black 50%, var(--accent) 50%, var(--accent) 100%)`,
        }}
      />

      {/* Mouse-following spotlight */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          left: `calc(${mousePos.x * 100}% - 300px)`,
          top: `calc(${mousePos.y * 100}% - 300px)`,
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - dark */}
        <div className="w-1/2 flex flex-col justify-center px-8 lg:px-20 py-32">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <span className="text-xs font-mono text-[var(--accent)] tracking-[0.5em] uppercase mb-8 block">
              [ READY? ]
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black leading-[0.85] tracking-tight text-white mb-8">
              STOP
              <br />
              <span className="text-[var(--text-muted)]">GUESSING</span>
              <span className="text-[var(--accent)]">.</span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] max-w-md leading-relaxed mb-12">
              Your validators are already running. Your nodes are already producing blocks. You just can&apos;t see them.
            </p>

            {/* Stats */}
            <div className="flex gap-12">
              <div>
                <span className="text-4xl lg:text-5xl font-display font-black text-white">100%</span>
                <span className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">Open Source</span>
              </div>
              <div>
                <span className="text-4xl lg:text-5xl font-display font-black text-white">&lt;1ms</span>
                <span className="block text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">Latency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - accent colored */}
        <div className="w-1/2 flex flex-col justify-center items-center px-8 lg:px-20 py-32">
          <div 
            className={`text-center transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black leading-[0.85] tracking-tight text-black mb-12">
              START
              <br />
              KNOWING<span className="text-white">.</span>
            </h2>

            {/* CTA Button - inverted */}
            <Link 
              href="/"
              className="group relative inline-block"
            >
              <div className="relative px-12 py-6 bg-black text-white font-bold text-xl overflow-hidden transition-transform group-hover:scale-105">
                <span className="relative z-10 flex items-center gap-4">
                  <span>Enter Dashboard</span>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </span>
                
                {/* Hover fill */}
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="absolute inset-0 flex items-center justify-center gap-4 text-black font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span>Enter Dashboard</span>
                  <span className="text-2xl">→</span>
                </span>
              </div>
            </Link>

            <p className="mt-8 text-sm text-black/60 font-mono">
              No signup required. Your data stays yours.
            </p>
          </div>
        </div>
      </div>

      {/* Diagonal text overlay */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap"
        style={{
          transform: 'translate(-50%, -50%) rotate(-45deg)',
        }}
      >
        <span className="text-[15vw] font-display font-black text-white/5 tracking-tighter">
          OPENTART
        </span>
      </div>

      {/* Mobile responsive overlay - show stacked on small screens */}
      <div className="absolute inset-0 bg-black lg:hidden flex flex-col justify-center items-center px-8 py-20 text-center">
        <span className="text-xs font-mono text-[var(--accent)] tracking-[0.5em] uppercase mb-6">
          [ READY? ]
        </span>
        
        <h2 className="text-5xl font-display font-black leading-[0.85] tracking-tight mb-8">
          <span className="text-white">STOP</span>
          <br />
          <span className="text-[var(--text-muted)]">GUESSING</span>
          <span className="text-[var(--accent)]">.</span>
          <br />
          <span className="text-[var(--accent)]">START</span>
          <br />
          <span className="text-white">KNOWING</span>
          <span className="text-[var(--accent)]">.</span>
        </h2>

        <Link 
          href="/"
          className="px-10 py-5 bg-[var(--accent)] text-black font-bold text-lg"
        >
          Enter Dashboard →
        </Link>
      </div>
    </section>
  );
}
