'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchNodes, fetchEvents } from '@/lib/api';
import { getWebSocket } from '@/lib/websocket';
import { Node, TelemetryEvent } from '@/lib/types';
import { Card, StatCard } from '@/components/ui/Card';

interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: number;
  isConnected: boolean;
}

export default function NetworkPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [nodesData, eventsData] = await Promise.all([
          fetchNodes(),
          fetchEvents(300),
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

    const ws = getWebSocket();
    ws.connect();
    const unsubscribe = ws.onEvent((event) => {
      setEvents((prev) => [event, ...prev.slice(0, 299)]);
    });
    return () => unsubscribe();
  }, []);

  const { networkNodes, connectionCount, blockAnnounces, guarantees } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>();
    let connections = 0;
    let announces = 0;
    let guar = 0;

    nodes.forEach((node, idx) => {
      const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.min(180, 50 + nodes.length * 15);
      const x = 200 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      
      nodeMap.set(node.node_id, {
        id: node.node_id,
        name: node.implementation_name,
        x,
        y,
        connections: 0,
        isConnected: node.is_connected,
      });
    });

    events.forEach((event) => {
      if (event.event_type === 23 || event.event_type === 26) {
        connections++;
        const n = nodeMap.get(event.node_id);
        if (n) n.connections++;
      }
      if (event.event_type === 62) announces++;
      if (event.event_type === 105 || event.event_type === 108) guar++;
    });

    return {
      networkNodes: Array.from(nodeMap.values()),
      connectionCount: connections,
      blockAnnounces: announces,
      guarantees: guar,
    };
  }, [nodes, events]);

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
        <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Network</h1>
        <p className="text-sm text-[var(--text-muted)]">Topology visualization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Nodes" value={networkNodes.length} accent />
        <StatCard label="Connections" value={connectionCount} />
        <StatCard label="Block Announces" value={blockAnnounces} />
        <StatCard label="Guarantees" value={guarantees} />
      </div>

      {/* Network Visualization */}
      <Card>
        <div className="relative h-[400px] bg-[var(--bg-secondary)]">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 40}
                x2="100%"
                y2={i * 40}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="100%"
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {networkNodes.map((node, idx) => 
              networkNodes.slice(idx + 1).map((other, jdx) => (
                <line
                  key={`${idx}-${jdx}`}
                  x1={node.x}
                  y1={node.y}
                  x2={other.x}
                  y2={other.y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              ))
            )}
          </svg>

          {/* Nodes */}
          {networkNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: node.x, top: node.y }}
            >
              <div
                className={`w-3 h-3 ${
                  node.isConnected
                    ? 'bg-[var(--accent)]'
                    : 'bg-[var(--text-muted)]'
                }`}
              />
              
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block z-10">
                <div className="bg-[var(--bg-card)] border border-[var(--border)] p-2 text-xs whitespace-nowrap">
                  <p className="text-[var(--text-primary)]">{node.name}</p>
                  <p className="text-[var(--text-muted)] font-mono">{node.id.slice(0, 12)}...</p>
                  <p className="text-[var(--text-secondary)]">{node.connections} events</p>
                </div>
              </div>
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
              No nodes connected
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
