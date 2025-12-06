import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--bg-card)] 
        border border-[var(--border)]
        p-4
        ${hover ? 'hover:border-[var(--border-hover)] transition-colors cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: boolean;
}

export function StatCard({ label, value, subtext, accent = false }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-display font-semibold ${accent ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtext && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtext}</p>}
    </div>
  );
}
