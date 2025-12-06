'use client';

import { useEffect, useState } from 'react';
import { fetchEvents } from '@/lib/api';
import { getWebSocket } from '@/lib/websocket';
import { TelemetryEvent, EVENT_TYPE_NAMES, getEventCategory, EVENT_CATEGORIES, EventCategory } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, ChevronDown } from 'lucide-react';

function truncateHash(hash: string, chars = 8): string {
  if (!hash || hash.length < chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-4)}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'ALL'>('ALL');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents(200);
        setEvents(data);
      } catch (e) {
        console.error('Failed to fetch events:', e);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();

    if (liveMode) {
      const ws = getWebSocket();
      ws.connect();
      const unsubscribe = ws.onEvent((event) => {
        setEvents((prev) => [event, ...prev.slice(0, 199)]);
      });
      return () => unsubscribe();
    }
  }, [liveMode]);

  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'ALL') return true;
    return getEventCategory(e.event_type) === categoryFilter;
  });

  const categories: (EventCategory | 'ALL')[] = ['ALL', ...Object.keys(EVENT_CATEGORIES) as EventCategory[]];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Events</h1>
          <p className="text-sm text-[var(--text-muted)]">{filteredEvents.length} events</p>
        </div>
        
        <button
          onClick={() => setLiveMode(!liveMode)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-colors ${
            liveMode
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-[var(--border)] text-[var(--text-muted)]'
          }`}
        >
          <span className={`w-1.5 h-1.5 ${liveMode ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]'}`} />
          {liveMode ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] p-1 overflow-x-auto">
        {categories.map((cat) => {
          const info = cat !== 'ALL' ? EVENT_CATEGORIES[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {cat === 'ALL' ? 'All' : info?.name}
            </button>
          );
        })}
      </div>

      {/* Events List */}
      <Card className="p-0 max-h-[calc(100vh-280px)] overflow-auto">
        <div className="divide-y divide-[var(--border)]">
          {filteredEvents.map((event, idx) => {
            // Create a unique key combining multiple fields to avoid React key collisions
            const uniqueKey = `${event.event_type}-${event.node_id?.slice(0, 8) || ''}-${event.timestamp}-${idx}`;
            const isExpanded = expandedEvent === idx;

            return (
              <div key={uniqueKey}>
                <div 
                  className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                  onClick={() => setExpandedEvent(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="accent">{event.event_type}</Badge>
                    <div>
                      <span className="text-sm text-[var(--text-primary)]">
                        {EVENT_TYPE_NAMES[event.event_type] || `Event ${event.event_type}`}
                      </span>
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        {truncateHash(event.node_id)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--text-muted)]" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <pre className="p-4 bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] overflow-x-auto font-mono">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
          {filteredEvents.length === 0 && (
            <div className="p-8 text-center text-[var(--text-muted)]">No events</div>
          )}
        </div>
      </Card>
    </div>
  );
}
