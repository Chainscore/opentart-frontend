'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080');
  const [refreshRate, setRefreshRate] = useState('5');

  return (
    <div className="space-y-6 fade-in max-w-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Configuration</p>
      </div>

      {/* Backend */}
      <Card>
        <span className="text-sm font-medium text-[var(--text-primary)] block mb-4">Backend</span>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
              API URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--accent)]"
              placeholder="http://localhost:8080"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Refresh Rate
            </label>
            <select
              value={refreshRate}
              onChange={(e) => setRefreshRate(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="1">1 second</option>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
            </select>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <span className="text-sm font-medium text-[var(--text-primary)] block mb-4">About</span>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Version</span>
            <span className="text-[var(--text-primary)] font-mono">0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Protocol</span>
            <span className="text-[var(--text-primary)]">JIP-3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Stack</span>
            <span className="text-[var(--text-primary)]">Next.js + Tailwind</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
