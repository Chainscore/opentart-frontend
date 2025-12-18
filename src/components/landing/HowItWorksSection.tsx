'use client';

import { useEffect, useRef, useState } from 'react';
import { Server, ArrowRight, Radio, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Server,
    title: 'YOUR VALIDATORS',
    subtitle: 'Run your nodes',
    description: 'Deploy validators on JAM Protocol. Tessera, PolkaJam, or your own implementation.',
  },
  {
    number: '02',
    icon: Radio,
    title: 'EMIT TELEMETRY',
    subtitle: 'Zero configuration',
    description: 'Point your nodes at OpenTART. We receive events — blocks, finality, network state.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'VISUALIZE',
    subtitle: 'Real-time insights',
    description: 'Watch your network live. Analytics, topology, events. Everything in one dashboard.',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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

  // Auto-cycle through steps
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 lg:py-48 bg-black overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />

      {/* Section header - centered but offset */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-20 lg:mb-32">
        <div className="lg:ml-[16%]">
          <span className="text-xs font-mono text-[var(--accent)] tracking-[0.5em] uppercase mb-4 block">
            [ WORKFLOW ]
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9] tracking-tight">
            <span className="text-[var(--text-muted)]">THREE</span>
            <br />
            <span className="text-white">STEPS</span>
            <span className="text-[var(--accent)]">.</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-md">
            No complex setup. No vendor lock-in. Just plug in and go.
          </p>
        </div>
      </div>

      {/* Steps - horizontal scroll on mobile, stacked on desktop */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {steps.map((step, idx) => (
            <div 
              key={step.number}
              className={`group relative cursor-pointer transition-all duration-500 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
              onMouseEnter={() => setActiveStep(idx)}
            >
              {/* Connection line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 translate-x-1/2 z-10">
                  <ArrowRight 
                    size={24} 
                    className={`transition-colors duration-300 ${
                      activeStep >= idx ? 'text-[var(--accent)]' : 'text-[var(--border)]'
                    }`}
                  />
                </div>
              )}

              {/* Card */}
              <div 
                className={`relative h-full p-8 lg:p-12 border transition-all duration-500 ${
                  activeStep === idx 
                    ? 'bg-[var(--bg-card)] border-[var(--accent)]' 
                    : 'bg-transparent border-[var(--border)] hover:border-[var(--text-muted)]'
                }`}
              >
                {/* Step number - massive */}
                <span 
                  className={`absolute top-4 right-4 text-8xl lg:text-9xl font-display font-black transition-opacity duration-300 ${
                    activeStep === idx ? 'opacity-20' : 'opacity-5'
                  }`}
                  style={{ color: 'var(--accent)' }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div 
                  className={`w-16 h-16 flex items-center justify-center mb-8 border transition-all duration-300 ${
                    activeStep === idx 
                      ? 'border-[var(--accent)] bg-[var(--accent)]' 
                      : 'border-[var(--border)]'
                  }`}
                >
                  <step.icon 
                    size={28} 
                    className={`transition-colors duration-300 ${
                      activeStep === idx ? 'text-black' : 'text-[var(--accent)]'
                    }`}
                  />
                </div>

                {/* Subtitle */}
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2 block">
                  {step.subtitle}
                </span>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>

                {/* Progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]">
                  <div 
                    className={`h-full bg-[var(--accent)] transition-all duration-300 ${
                      activeStep === idx ? 'w-full' : 'w-0'
                    }`}
                    style={{
                      transitionDuration: activeStep === idx ? '3000ms' : '0ms',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual connector to next section */}
      <div className="mt-20 lg:mt-32 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            Ready?
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-[var(--accent)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
