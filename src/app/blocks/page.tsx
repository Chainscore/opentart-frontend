'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchEvents } from '@/lib/api';
import { getWebSocket } from '@/lib/websocket';
import { TelemetryEvent, getBestBlockChanged, getFinalizedBlockChanged, getAuthored } from '@/lib/types';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Block {
  slot: number;
  hash: string;
  type: 'best' | 'finalized' | 'authored';
  timestamp: string;
}

export default function BlocksPage() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents(500);
        setEvents(data);
      } catch (e) {
        console.error('Failed to fetch events:', e);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();

    const ws = getWebSocket();
    ws.connect();
    const unsubscribe = ws.onEvent((event) => {
      if ([11, 12, 42].includes(event.event_type)) {
        setEvents((prev) => [event, ...prev.slice(0, 499)]);
      }
    });
    return () => unsubscribe();
  }, []);

  const { blocks, bestBlock, finalizedBlock, forkCount } = useMemo(() => {
    const blockMap = new Map<number, Block>();
    let best = 0;
    let finalized = 0;
    let forks = 0;
    
    events.forEach((event) => {
      const bestData = getBestBlockChanged(event);
      if (bestData) {
        if (bestData.slot > best) best = bestData.slot;
        blockMap.set(bestData.slot, {
          slot: bestData.slot,
          hash: bestData.hash || '',
          type: 'best',
          timestamp: event.timestamp,
        });
        return;
      }

      const finalizedData = getFinalizedBlockChanged(event);
      if (finalizedData) {
        if (finalizedData.slot > finalized) finalized = finalizedData.slot;
        const existing = blockMap.get(finalizedData.slot);
        if (!existing || existing.type !== 'best') {
          blockMap.set(finalizedData.slot, {
            slot: finalizedData.slot,
            hash: finalizedData.hash || '',
            type: 'finalized',
            timestamp: event.timestamp,
          });
        }
        return;
      }

      const authoredData = getAuthored(event);
      if (authoredData) {
        const existing = blockMap.get(authoredData.slot);
        if (existing && existing.hash !== authoredData.outline?.header_hash) {
          forks++;
        }
        if (!existing) {
          blockMap.set(authoredData.slot, {
            slot: authoredData.slot,
            hash: authoredData.outline?.header_hash || '',
            type: 'authored',
            timestamp: event.timestamp,
          });
        }
      }
    });

    return {
      blocks: Array.from(blockMap.values()).sort((a, b) => b.slot - a.slot),
      bestBlock: best,
      finalizedBlock: finalized,
      forkCount: forks,
    };
  }, [events]);

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
      <div>
        <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Blocks</h1>
        <p className="text-sm text-[var(--text-muted)]">Chain visualization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Best Block" value={bestBlock} accent />
        <StatCard label="Finalized" value={finalizedBlock} />
        <StatCard label="Finality Lag" value={bestBlock - finalizedBlock} />
        <StatCard label="Forks" value={forkCount} />
      </div>

      {/* Timeline */}
      <Card>
        <span className="text-sm font-medium text-[var(--text-primary)] block mb-4">Timeline</span>
        <div className="flex items-center gap-px overflow-x-auto pb-2">
          {blocks.slice(0, 40).reverse().map((block, idx) => (
            <div
              key={`${block.slot}-${idx}`}
              className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-[8px] font-mono cursor-pointer transition-colors ${
                block.type === 'finalized' 
                  ? 'bg-[var(--success)] text-black' 
                  : block.type === 'best'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
              }`}
              title={`Slot ${block.slot}`}
            >
              {block.slot % 100}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--success)]" />
            Finalized
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--accent)]" />
            Best
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[var(--bg-hover)]" />
            Authored
          </div>
        </div>
      </Card>

      {/* Block Table */}
      <Card className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider">Slot</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider">Hash</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider">Type</th>
              <th className="p-4 text-xs font-normal text-[var(--text-muted)] uppercase tracking-wider text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {blocks.slice(0, 30).map((block, idx) => (
              <tr key={`${block.slot}-${idx}`} className="hover:bg-[var(--bg-hover)]">
                <td className="p-4">
                  <span className="text-sm text-[var(--accent)] font-mono">{block.slot}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-[var(--text-secondary)] font-mono">
                    {block.hash ? `${Buffer.from(block.hash).toString('hex').slice(0, 16)}...${Buffer.from(block.hash).toString('hex').slice(-16)}` : '—'}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={block.type === 'finalized' ? 'success' : block.type === 'best' ? 'accent' : 'default'}>
                    {block.type}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(block.timestamp).toLocaleTimeString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blocks.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">No blocks yet</div>
        )}
      </Card>
    </div>
  );
}
