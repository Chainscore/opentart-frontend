'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Routes that should NOT show the dashboard layout (sidebar + header)
const STANDALONE_ROUTES = ['/landing'];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route should be standalone (no sidebar/header)
  const isStandalone = STANDALONE_ROUTES.some(route => pathname.startsWith(route));

  if (isStandalone) {
    // Standalone layout for landing page etc.
    return <>{children}</>;
  }

  // Dashboard layout with sidebar and header
  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
