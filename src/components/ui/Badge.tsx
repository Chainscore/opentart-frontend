interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
    success: 'bg-[var(--success)]/10 text-[var(--success)]',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    error: 'bg-[var(--error)]/10 text-[var(--error)]',
    accent: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  connected: boolean;
}

export function StatusBadge({ connected }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono ${
      connected 
        ? 'bg-[var(--success)]/10 text-[var(--success)]' 
        : 'bg-[var(--error)]/10 text-[var(--error)]'
    }`}>
      <span className={`w-1 h-1 ${connected ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`} />
      {connected ? 'online' : 'offline'}
    </span>
  );
}
