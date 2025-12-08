'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { fetchNodes, fetchEvents } from '@/lib/api';
import { getWebSocket } from '@/lib/websocket';
import { Node, TelemetryEvent, EVENT_TYPE_NAMES, getBestBlockChanged, getFinalizedBlockChanged, getAuthored } from '@/lib/types';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { getSettings, saveSettings } from '@/lib/settings';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const EPOCH_LENGTH = 600;

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

export default function DashboardPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [backendUrl, setBackendUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Load initial backend URL on client
  useEffect(() => {
    setBackendUrl(getSettings().apiUrl);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [nodesData, eventsData] = await Promise.all([
          fetchNodes(),
          fetchEvents(200),
        ]);
        setNodes(nodesData);
        setEvents(eventsData);
        setError(null);
      } catch (e) {
        setError('Backend unavailable');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const ws = getWebSocket();
    ws.connect();
    const unsubscribe = ws.onEvent((event) => {
      setEvents((prev) => [event, ...prev.slice(0, 199)]);
    });

    const interval = setInterval(async () => {
      try {
        const nodesData = await fetchNodes();
        setNodes(nodesData);
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleRetry = async () => {
    setSaving(true);
    const trimmedUrl = backendUrl.trim() || 'http://localhost:8080';
    saveSettings({ apiUrl: trimmedUrl });
    setBackendUrl(trimmedUrl);
    
    // Give settings time to propagate, then reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const metrics = useMemo(() => {
    const connectedNodes = nodes.filter(n => n.is_connected);
    
    // Find best and finalized blocks using helper functions
    let bestBlock = 0;
    let finalizedBlock = 0;
    
    for (const e of events) {
      const bestData = getBestBlockChanged(e);
      if (bestData && bestData.slot > bestBlock) {
        bestBlock = bestData.slot;
      }
      const finalizedData = getFinalizedBlockChanged(e);
      if (finalizedData && finalizedData.slot > finalizedBlock) {
        finalizedBlock = finalizedData.slot;
      }
    }
    
    const finalityLag = bestBlock - finalizedBlock;
    const currentEpoch = Math.floor(bestBlock / EPOCH_LENGTH);
    const slotInEpoch = bestBlock % EPOCH_LENGTH;

    const oneMinuteAgo = Date.now() - 60000;
    const recentEvents = events.filter(e => new Date(e.timestamp).getTime() > oneMinuteAgo);

    return {
      connectedNodes: connectedNodes.length,
      totalNodes: nodes.length,
      bestBlock,
      finalizedBlock,
      finalityLag,
      currentEpoch,
      slotInEpoch,
      eventsPerMinute: recentEvents.length,
    };
  }, [nodes, events]);

  const latestBlocks = useMemo(() => {
    // Use Authored (42) events - the actual block author
    // Match header_hash with BestBlockChanged (11) to get slot
    const seenSlots = new Set<number>();
    
    // Build hash -> slot map from BestBlockChanged (11) and Importing (43)
    const hashToSlot = new Map<string, number>();
    
    // From BestBlockChanged
    events.filter(e => e.event_type === 11).forEach(e => {
      const data = (e.data || {}) as Record<string, unknown>;
      const bc = (data.BestBlockChanged || data) as { slot?: number; hash?: string | number[] };
      if (bc?.slot && bc?.hash) {
        const h = typeof bc.hash === 'string' ? bc.hash : 
          Array.isArray(bc.hash) ? Array.from(bc.hash).map(b => (b as number).toString(16).padStart(2, '0')).join('') : '';
        if (h) hashToSlot.set(h, bc.slot);
      }
    });
    
    // From Importing (has slot directly with outline.hash)
    events.filter(e => e.event_type === 43).forEach(e => {
      const data = (e.data || {}) as Record<string, unknown>;
      const imp = (data.Importing || data) as { slot?: number; outline?: { hash?: string | number[] } };
      if (imp?.slot && imp?.outline?.hash) {
        const h = typeof imp.outline.hash === 'string' ? imp.outline.hash : 
          Array.isArray(imp.outline.hash) ? Array.from(imp.outline.hash).map(b => (b as number).toString(16).padStart(2, '0')).join('') : '';
        if (h) hashToSlot.set(h, imp.slot);
      }
    });
    
    return events
      .filter(e => e.event_type === 42) // Authored
      .map((e, idx) => {
        const node = nodes.find(n => n.node_id === e.node_id);
        const data = (e.data || {}) as Record<string, unknown>;
        // Backend returns: { Authored: { authoring_id, outline: { hash, ... }, timestamp } }
        const authored = (data.Authored || data) as { 
          outline?: { hash?: string | number[] } 
        };
        
        let hashStr = '';
        const rawHash = authored?.outline?.hash;
        if (rawHash) {
          hashStr = typeof rawHash === 'string' ? rawHash : 
            Array.isArray(rawHash) ? Array.from(rawHash).map(b => (b as number).toString(16).padStart(2, '0')).join('') : '';
        }
        
        const slot = hashToSlot.get(hashStr) || 0;
        
        return {
          id: `block-${e.node_id?.slice(0, 8)}-${slot}-${idx}`,
          slot,
          hash: hashStr,
          author: node?.implementation_name || 'Unknown',
          authorId: e.node_id,
          timestamp: e.timestamp,
        };
      })
      .filter(b => {
        if (b.slot <= 0 || seenSlots.has(b.slot)) return false;
        seenSlots.add(b.slot);
        return true;
      })
      .slice(0, 8);
  }, [events, nodes]);

  const latestEvents = useMemo(() => {
    return events
      .filter(e => ![10, 13].includes(e.event_type))
      .slice(0, 8)
      .map((e, idx) => {
        const node = nodes.find(n => n.node_id === e.node_id);
        return {
          id: `event-${e.event_type}-${e.node_id?.slice(0, 8)}-${e.timestamp}-${idx}`,
          type: e.event_type,
          typeName: EVENT_TYPE_NAMES[e.event_type] || `Event ${e.event_type}`,
          node: node?.implementation_name || 'Unknown',
          nodeId: e.node_id,
          timestamp: e.timestamp,
        };
      });
  }, [events, nodes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <p className="text-[var(--error)] mb-2">{error}</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Could not connect to TART backend. Enter the correct URL below:
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRetry()}
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--accent)]"
              placeholder="http://localhost:8080"
            />
            <button
              onClick={handleRetry}
              disabled={saving}
              className="w-full px-4 py-2 bg-[var(--accent)] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Best Block" 
          value={metrics.bestBlock} 
          accent
        />
        <StatCard 
          label="Finalized" 
          value={metrics.finalizedBlock}
          subtext={`-${metrics.finalityLag} blocks`}
        />
        <StatCard 
          label="Epoch" 
          value={metrics.currentEpoch}
          subtext={`${metrics.slotInEpoch}/${EPOCH_LENGTH} slots`}
        />
        <StatCard 
          label="Nodes" 
          value={`${metrics.connectedNodes}/${metrics.totalNodes}`}
          subtext={`${metrics.eventsPerMinute} events/min`}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest Blocks */}
        <Card className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Latest Blocks</span>
            <Link href="/blocks" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {latestBlocks.length > 0 ? latestBlocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-[var(--accent)] font-mono text-sm">{block.slot}</span>
                  <div>
                    <Link 
                      href={`/nodes/${block.authorId}`}
                      className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)]"
                    >
                      {block.author}
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{truncateHash(block.hash)}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{formatTimeAgo(block.timestamp)}</span>
              </div>
            )) : (
              <div className="p-8 text-center text-[var(--text-muted)]">No blocks yet</div>
            )}
          </div>
        </Card>

        {/* Latest Events */}
        <Card className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Latest Events</span>
            <Link href="/events" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {latestEvents.length > 0 ? latestEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-center gap-4">
                  <Badge variant="accent">{event.type}</Badge>
                  <div>
                    <span className="text-sm text-[var(--text-primary)]">{event.typeName}</span>
                    <p className="text-xs text-[var(--text-muted)]">from {event.node}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{formatTimeAgo(event.timestamp)}</span>
              </div>
            )) : (
              <div className="p-8 text-center text-[var(--text-muted)]">No events yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Nodes */}
      <Card className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Connected Nodes</span>
          <Link href="/nodes" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {nodes.slice(0, 6).map((node) => {
            const nodeEvents = events.filter(e => e.node_id === node.node_id);
            const eventRate = nodeEvents.filter(e => 
              new Date(e.timestamp).getTime() > Date.now() - 60000
            ).length;
            
            return (
              <Link
                key={node.node_id}
                href={`/nodes/${node.node_id}`}
                className="p-4 border-b border-r border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors last:border-r-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{node.implementation_name}</span>
                  <StatusBadge connected={node.is_connected} />
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span>{eventRate} evt/m</span>
                  <span className="font-mono">{truncateHash(node.node_id, 6)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
