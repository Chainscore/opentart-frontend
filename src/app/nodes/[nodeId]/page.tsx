'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { fetchNode, fetchNodeEvents } from '@/lib/api';
import { Node, TelemetryEvent, EVENT_TYPE_NAMES, getEventCategory, EVENT_CATEGORIES, getStatus } from '@/lib/types';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 5) return 'now';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}

export default function NodeDetailPage() {
  const params = useParams();
  const nodeId = params.nodeId as string;
  
  const [node, setNode] = useState<Node | null>(null);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [nodeData, eventsData] = await Promise.all([
          fetchNode(nodeId),
          fetchNodeEvents(nodeId, 200),
        ]);
        setNode(nodeData);
        setEvents(eventsData);
      } catch (e) {
        console.error('Failed to fetch node:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [nodeId]);

  const metrics = useMemo(() => {
    if (!node) return null;
    
    const oneMinuteAgo = Date.now() - 60000;
    const recentEvents = events.filter(e => new Date(e.timestamp).getTime() > oneMinuteAgo);
    
    const statusEvent = events.find(e => e.event_type === 10);
    const statusData = statusEvent ? getStatus(statusEvent) : null;
    
    const blocksAuthored = events.filter(e => e.event_type === 42).length;
    const guaranteesBuilt = events.filter(e => e.event_type === 105).length;
    
    const connectedAt = new Date(node.connected_at);
    const uptimeMs = Date.now() - connectedAt.getTime();
    
    const eventsByCategory: Record<string, number> = {};
    events.forEach(e => {
      const cat = getEventCategory(e.event_type);
      if (cat) {
        eventsByCategory[cat] = (eventsByCategory[cat] || 0) + 1;
      }
    });

    return {
      totalPeers: statusData?.num_peers || 0,
      validatorPeers: statusData?.num_val_peers || 0,
      numShards: statusData?.num_shards || 0,
      numPreimages: statusData?.num_preimages || 0,
      eventsPerMinute: recentEvents.length,
      blocksAuthored,
      guaranteesBuilt,
      uptimeMs,
      eventsByCategory,
    };
  }, [node, events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  if (!node || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <p className="text-[var(--error)]">Node not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <Link 
          href="/nodes" 
          className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4"
        >
          <ArrowLeft size={12} />
          Back
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
                {node.implementation_name}
              </h1>
              <Badge>{node.implementation_version}</Badge>
              <StatusBadge connected={node.is_connected} />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">{node.node_id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Uptime</p>
            <p className="text-lg font-display text-[var(--text-primary)]">{formatDuration(metrics.uptimeMs)}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Peers" value={metrics.totalPeers} subtext={`${metrics.validatorPeers} validators`} />
        <StatCard label="Blocks" value={metrics.blocksAuthored} accent={metrics.blocksAuthored > 0} />
        <StatCard label="Guarantees" value={metrics.guaranteesBuilt} />
        <StatCard label="Shards" value={metrics.numShards} />
      </div>

      {/* Activity by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <span className="text-sm font-medium text-[var(--text-primary)] block mb-4">Activity</span>
          <div className="space-y-3">
            {Object.entries(EVENT_CATEGORIES).map(([key, info]) => {
              const count = metrics.eventsByCategory[key] || 0;
              const maxCount = Math.max(...Object.values(metrics.eventsByCategory), 1);
              const width = (count / maxCount) * 100;
              
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)]">{info.name}</span>
                    <span className="text-[var(--text-primary)] font-mono">{count}</span>
                  </div>
                  <div className="h-1 bg-[var(--border)]">
                    <div 
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Events */}
        <Card className="p-0 max-h-80 overflow-auto">
          <div className="p-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Recent Events</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {events.slice(0, 20).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Badge variant="accent">{event.event_type}</Badge>
                  <span className="text-sm text-[var(--text-primary)]">
                    {EVENT_TYPE_NAMES[event.event_type] || `Event ${event.event_type}`}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatTimeAgo(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
