'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchNodes, fetchEvents } from '@/lib/api';
import { Node, TelemetryEvent, getStatus } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { StatusBadge as StatusBadgeComponent, Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 5) return 'now';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

function truncateHash(hash: string, chars = 8): string {
  if (!hash || hash.length < chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-4)}`;
}

interface NodeMetrics {
  node: Node;
  eventsPerMinute: number;
  blocksAuthored: number;
  guaranteesBuilt: number;
  peersConnected: number;
  lastActivity: string | null;
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'status' | 'events' | 'blocks'>('status');

  useEffect(() => {
    async function loadData() {
      try {
        const [nodesData, eventsData] = await Promise.all([
          fetchNodes(),
          fetchEvents(500),
        ]);
        setNodes(nodesData);
        setEvents(eventsData);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const nodeMetrics: NodeMetrics[] = useMemo(() => {
    const oneMinuteAgo = Date.now() - 60000;
    
    return nodes.map(node => {
      const nodeEvents = events.filter(e => e.node_id === node.node_id);
      const recentEvents = nodeEvents.filter(e => new Date(e.timestamp).getTime() > oneMinuteAgo);
      
      const blocksAuthored = nodeEvents.filter(e => e.event_type === 42).length;
      const guaranteesBuilt = nodeEvents.filter(e => e.event_type === 105).length;
      
      const statusEvent = nodeEvents.find(e => e.event_type === 10);
      const status = statusEvent ? getStatus(statusEvent) : null;
      
      return {
        node,
        eventsPerMinute: recentEvents.length,
        blocksAuthored,
        guaranteesBuilt,
        peersConnected: status?.num_peers || 0,
        lastActivity: nodeEvents[0]?.timestamp || null,
      };
    });
  }, [nodes, events]);

  const sortedMetrics = useMemo(() => {
    return [...nodeMetrics].sort((a, b) => {
      switch (sortBy) {
        case 'events':
          return b.eventsPerMinute - a.eventsPerMinute;
        case 'blocks':
          return b.blocksAuthored - a.blocksAuthored;
        default:
          return (b.node.is_connected ? 1 : 0) - (a.node.is_connected ? 1 : 0);
      }
    });
  }, [nodeMetrics, sortBy]);

  const connectedCount = nodes.filter(n => n.is_connected).length;

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
          <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Nodes</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {connectedCount} of {nodes.length} connected
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)]">
          {(['status', 'events', 'blocks'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs transition-colors ${
                sortBy === s
                  ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider">Node</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider text-right">Peers</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider text-right">Events/m</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider text-right">Blocks</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider text-right">Last</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sortedMetrics.map(({ node, eventsPerMinute, blocksAuthored, peersConnected, lastActivity }) => (
              <tr key={node.node_id} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="p-4">
                  <div>
                    <span className="text-sm text-[var(--text-primary)]">{node.implementation_name}</span>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{truncateHash(node.node_id)}</p>
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadgeComponent connected={node.is_connected} />
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm text-[var(--text-secondary)] font-mono">{peersConnected}</span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-mono ${eventsPerMinute > 0 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                    {eventsPerMinute}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-mono ${blocksAuthored > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {blocksAuthored}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-xs text-[var(--text-muted)]">
                    {lastActivity ? formatTimeAgo(lastActivity) : '—'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/nodes/${node.node_id}`}
                    className="text-[var(--text-muted)] hover:text-[var(--accent)]"
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
