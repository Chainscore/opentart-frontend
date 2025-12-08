// WebSocket client for real-time TART telemetry

import { TelemetryEvent } from './types';
import { getWsUrl, onSettingsChange } from './settings';

type SubscriptionFilter =
  | { type: 'All' }
  | { type: 'Node'; node_id: string }
  | { type: 'EventType'; event_type: number }
  | { type: 'EventTypeRange'; start: number; end: number };

type MessageHandler = (event: TelemetryEvent) => void;
type StatsHandler = (stats: unknown) => void;
type ConnectionHandler = (connected: boolean) => void;

class TelemetryWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private eventHandlers: Set<MessageHandler> = new Set();
  private statsHandlers: Set<StatsHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url?: string) {
    this.url = url || getWsUrl();
  }

  updateUrl(newUrl: string): void {
    if (this.url !== newUrl) {
      this.url = newUrl;
      this.reconnectAttempts = 0;
      if (this.ws) {
        this.disconnect();
        this.connect();
      }
    }
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[WS] Connected to TART telemetry');
        this.reconnectAttempts = 0;
        this.connectionHandlers.forEach(h => h(true));
        
        // Auto-subscribe to all events on connection
        this.subscribe({ type: 'All' });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          // Handle different message types from backend
          if (msg.type === 'event' && msg.data) {
            // Transform WebSocket event format to TelemetryEvent format
            // WS sends: { id, node_id, event_type, latency_ms, event: {...} }
            // We need: { id, node_id, event_id, event_type, timestamp, data: {...} }
            const wsEvent = msg.data;
            const telemetryEvent: TelemetryEvent = {
              id: wsEvent.id || 0,
              node_id: wsEvent.node_id || '',
              event_id: wsEvent.id || 0,
              event_type: wsEvent.event_type || 0,
              timestamp: msg.timestamp || new Date().toISOString(),
              data: wsEvent.event || {}, // The actual event data is nested under 'event'
              node_name: wsEvent.node_name,
              node_version: wsEvent.node_version,
            };
            this.eventHandlers.forEach(h => h(telemetryEvent));
          } else if (msg.type === 'stats' && msg.data) {
            this.statsHandlers.forEach(h => h(msg.data));
          } else if (msg.type === 'connected') {
            console.log('[WS] Server confirmed connection:', msg.data?.message);
          } else if (msg.type === 'subscribed') {
            console.log('[WS] Subscription confirmed:', msg.data?.filter);
          }
        } catch (e) {
          console.error('[WS] Failed to parse message:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        this.connectionHandlers.forEach(h => h(false));
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error);
      };
    } catch (e) {
      console.error('[WS] Failed to connect:', e);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => this.connect(), delay);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(filter: SubscriptionFilter): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'Subscribe', filter }));
    }
  }

  onEvent(handler: MessageHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  onStats(handler: StatsHandler): () => void {
    this.statsHandlers.add(handler);
    return () => this.statsHandlers.delete(handler);
  }

  onConnection(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let instance: TelemetryWebSocket | null = null;

export function getWebSocket(): TelemetryWebSocket {
  if (!instance) {
    instance = new TelemetryWebSocket(getWsUrl());
    
    // Listen for settings changes and update WebSocket URL
    onSettingsChange((settings) => {
      if (instance) {
        const wsBase = settings.apiUrl.replace(/^http/, 'ws');
        const newWsUrl = `${wsBase}/api/ws`;
        instance.updateUrl(newWsUrl);
      }
    });
  }
  return instance;
}

export { TelemetryWebSocket };

