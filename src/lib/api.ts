// TART Backend API Client

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health/detailed`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchNodes() {
  const res = await fetch(`${API_BASE}/api/nodes`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  const data = await res.json();
  return data.nodes;
}

export async function fetchNode(nodeId: string) {
  const res = await fetch(`${API_BASE}/api/nodes/${nodeId}`);
  if (!res.ok) throw new Error('Failed to fetch node');
  return res.json();
}

export async function fetchNodeEvents(nodeId: string, limit = 50) {
  const res = await fetch(`${API_BASE}/api/nodes/${nodeId}/events?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch node events');
  const data = await res.json();
  return data.events;
}

export async function fetchEvents(limit = 50) {
  const res = await fetch(`${API_BASE}/api/events?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  return data.events;
}
