'use client';

import { useRef, useEffect, useState } from 'react';
import { Network, Radio, Box, Shield, Zap, Server } from 'lucide-react';

const features = [
  {
    icon: Network,
    number: '01',
    title: 'NETWORK TOPOLOGY',
    tagline: 'See everything.',
    description: 'Real-time visualization of your entire validator network. Connections, peer relationships, and health status at a glance.',
    accent: '#00d4ff',
  },
  {
    icon: Radio,
    number: '02',
    title: 'LIVE EVENTS',
    tagline: 'Miss nothing.',
    description: 'WebSocket-powered event streams. Block announcements, finality updates, and validator activity — as it happens.',
    accent: '#ff00ff',
  },
  {
    icon: Box,
    number: '03',
    title: 'BLOCK ANALYTICS',
    tagline: 'Know everything.',
    description: 'Track block production patterns, authoring distribution, and chain progression with deep analytics.',
    accent: '#00ff88',
  },
  {
    icon: Shield,
    number: '04',
    title: 'ZERO TRUST',
    tagline: 'Own everything.',
    description: 'Your data never leaves your infrastructure. No tracking, no analytics, no backdoors. Run it yourself or don\'t run it at all.',
    accent: '#ffcc00',
  },
  {
    icon: Zap,
    number: '05',
    title: 'BLAZING FAST',
    tagline: 'Wait for nothing.',
    description: 'Rust backend, React frontend. Sub-millisecond event processing. Your dashboard updates before you blink.',
    accent: '#ff3344',
  },
  {
    icon: Server,
    number: '06',
    title: 'MULTI-NODE',
    tagline: 'Scale everything.',
    description: 'Monitor dozens of validators simultaneously. Compare performance, identify issues, dominate your epoch.',
    accent: '#00d4ff',
  },
];

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features" 
      ref={containerRef}
      className="relative py-32 lg:py-48 bg-[var(--bg-secondary)] overflow-hidden"
    >
      {/* Massive background number */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.03] pointer-events-none">
        <span className="text-[50vw] font-display font-black leading-none">
          {features[activeIndex].number}
        </span>
      </div>

      {/* Section header - asymmetric */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-20 lg:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono text-[var(--accent)] tracking-[0.5em] uppercase mb-4 block">
              [ CAPABILITIES ]
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tight">
              <span className="text-white">BUILT</span>
              <br />
              <span className="text-[var(--text-muted)]">DIFFERENT</span>
              <span className="text-[var(--accent)]">.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              No compromises. No fluff. Just the tools you need to monitor your validators like a professional.
            </p>
          </div>
        </div>
      </div>

      {/* Feature cards - staggered grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {features.map((feature, idx) => (
            <div 
              key={feature.number}
              className={`group relative bg-black border border-[var(--border)] overflow-hidden transition-all duration-500 hover:border-[${feature.accent}] ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${idx * 100}ms`,
              }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              {/* Gradient glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 100%, ${feature.accent}, transparent 70%)` }}
              />

              {/* Content */}
              <div className="relative p-8 lg:p-10">
                {/* Number - massive, faded */}
                <span 
                  className="absolute top-4 right-4 text-7xl lg:text-8xl font-display font-black opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ color: feature.accent }}
                >
                  {feature.number}
                </span>

                {/* Icon */}
                <div 
                  className="w-14 h-14 flex items-center justify-center mb-8 border transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--border)',
                    background: 'transparent',
                  }}
                >
                  <feature.icon 
                    size={28} 
                    className="transition-colors duration-300"
                    style={{ color: feature.accent }}
                  />
                </div>

                {/* Tagline */}
                <span 
                  className="text-sm font-mono uppercase tracking-widest mb-3 block transition-colors"
                  style={{ color: feature.accent }}
                >
                  {feature.tagline}
                </span>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div 
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: feature.accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mt-20 lg:mt-32">
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--text-muted)]">TOTAL FEATURES</span>
            <span className="text-4xl font-display font-black text-white">06</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">BUILD STATUS</span>
            <span className="text-sm font-mono text-[var(--success)]">● ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
