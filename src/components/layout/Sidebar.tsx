'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Server, 
  Radio, 
  Box, 
  Network, 
  Settings 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/nodes', label: 'Nodes', icon: Server },
  { href: '/events', label: 'Events', icon: Radio },
  { href: '/blocks', label: 'Blocks', icon: Box },
  { href: '/network', label: 'Network', icon: Network },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-40 bg-[var(--bg-primary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[var(--text-primary)] font-display tracking-tight">
            OPEN<span className="text-[var(--accent)]">TART</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'text-[var(--text-primary)] bg-[var(--bg-hover)] border-l-2 border-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--border)] space-y-2">
        <span className="text-xs text-[var(--text-muted)] font-mono block">v0.1.0</span>
        <a 
          href="https://chainscore.finance" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors block"
        >
          by <span className="text-[var(--text-secondary)]">Chainscore Labs</span>
        </a>
      </div>
    </aside>
  );
}
