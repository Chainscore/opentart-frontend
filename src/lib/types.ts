// TART Backend API Types

export interface Node {
  node_id: string;
  peer_id: string;
  implementation_name: string;
  implementation_version: string;
  node_info: NodeInfo;
  is_connected: boolean;
  event_count: number;
  connected_at: string;
  last_seen_at: string;
  disconnected_at: string | null;
}

export interface NodeInfo {
  params: ProtocolParameters;
  genesis: string;
  flags: number;
}

export interface ProtocolParameters {
  // Protocol params from JIP-3
  [key: string]: unknown;
}

export interface TelemetryEvent {
  id: number;
  node_id: string;
  event_id: number;
  event_type: number;
  timestamp: string;
  data: EventData;
  node_name?: string;
  node_version?: string;
}

export type EventData =
  | { Status: StatusData }
  | { BestBlockChanged: BlockChangedData }
  | { FinalizedBlockChanged: BlockChangedData }
  | { SyncStatusChanged: { synced: boolean } }
  | { ConnectedIn: { peer_id: string } }
  | { ConnectedOut: { connecting_id: number } }
  | { Disconnected: { peer: string; reason: string } }
  | { Authored: { slot: number; outline: BlockOutline } }
  | { BlockExecuted: { authoring_or_importing_id: number } }
  | { GuaranteeBuilt: { outline: GuaranteeOutline } }
  | { TicketTransferred: { epoch: number; id: string } }
  | { [key: string]: unknown };

export interface StatusData {
  num_peers: number;
  num_val_peers: number;
  num_sync_peers: number;
  num_shards: number;
  shards_size: number;
  num_preimages: number;
  preimages_size: number;
}

export interface BlockChangedData {
  slot: number;
  hash: string;
}

export interface BlockOutline {
  header_hash: string;
  // Additional block outline fields
}

export interface GuaranteeOutline {
  work_report_hash: string;
  core: number;
}

export interface Stats {
  total_blocks_authored: number;
  best_block: number;
  finalized_block: number;
}

export interface HealthReport {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  components: {
    database: ComponentHealth;
    broadcaster: ComponentHealth;
    memory: ComponentHealth;
  };
  version: string;
  uptime_seconds: number;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency_ms?: number;
  subscribers?: number;
  usage_percent?: number;
  message: string;
}

// Event type categories based on JIP-3
export const EVENT_CATEGORIES = {
  STATUS: { name: 'Status', range: [10, 13], iconName: 'activity' },
  NETWORKING: { name: 'Networking', range: [20, 28], iconName: 'network' },
  BLOCKS: { name: 'Blocks', range: [40, 68], iconName: 'box' },
  TICKETS: { name: 'Tickets', range: [80, 84], iconName: 'ticket' },
  GUARANTEEING: { name: 'Guaranteeing', range: [90, 113], iconName: 'shield-check' },
  AVAILABILITY: { name: 'Availability', range: [120, 131], iconName: 'database' },
  RECOVERY: { name: 'Recovery', range: [140, 178], iconName: 'refresh-cw' },
  PREIMAGES: { name: 'Preimages', range: [190, 199], iconName: 'eye' },
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORIES;

export function getEventCategory(eventType: number): EventCategory | null {
  for (const [key, cat] of Object.entries(EVENT_CATEGORIES)) {
    if (eventType >= cat.range[0] && eventType <= cat.range[1]) {
      return key as EventCategory;
    }
  }
  return null;
}

export const EVENT_TYPE_NAMES: Record<number, string> = {
  // Meta events
  0: 'Dropped',
  
  // Status events (10-13)
  10: 'Status',
  11: 'Best Block Changed',
  12: 'Finalized Block Changed',
  13: 'Sync Status Changed',
  
  // Networking events (20-28)
  20: 'Connection Refused',
  21: 'Connecting In',
  22: 'Connect In Failed',
  23: 'Connected In',
  24: 'Connecting Out',
  25: 'Connect Out Failed',
  26: 'Connected Out',
  27: 'Disconnected',
  28: 'Peer Misbehaved',
  
  // Block authoring/importing events (40-47)
  40: 'Authoring',
  41: 'Authoring Failed',
  42: 'Authored',
  43: 'Importing',
  44: 'Block Verification Failed',
  45: 'Block Verified',
  46: 'Block Execution Failed',
  47: 'Block Executed',
  
  // Block distribution events (60-68)
  60: 'Block Announcement Stream Opened',
  61: 'Block Announcement Stream Closed',
  62: 'Block Announced',
  63: 'Sending Block Request',
  64: 'Receiving Block Request',
  65: 'Block Request Failed',
  66: 'Block Request Sent',
  67: 'Block Request Received',
  68: 'Block Transferred',
  
  // Safrole ticket events (80-84)
  80: 'Generating Tickets',
  81: 'Ticket Generation Failed',
  82: 'Tickets Generated',
  83: 'Ticket Transfer Failed',
  84: 'Ticket Transferred',
  
  // Guaranteeing events (90-113)
  90: 'Work-Package Submission',
  91: 'Work-Package Being Shared',
  92: 'Work-Package Failed',
  93: 'Duplicate Work-Package',
  94: 'Work-Package Received',
  95: 'Authorized',
  96: 'Extrinsic Data Received',
  97: 'Imports Received',
  98: 'Sharing Work-Package',
  99: 'Work-Package Sharing Failed',
  100: 'Bundle Sent',
  101: 'Refined',
  102: 'Work-Report Built',
  103: 'Work-Report Signature Sent',
  104: 'Work-Report Signature Received',
  105: 'Guarantee Built',
  106: 'Sending Guarantee',
  107: 'Guarantee Send Failed',
  108: 'Guarantee Sent',
  109: 'Guarantees Distributed',
  110: 'Receiving Guarantee',
  111: 'Guarantee Receive Failed',
  112: 'Guarantee Received',
  113: 'Guarantee Discarded',
  
  // Availability distribution events (120-131)
  120: 'Sending Shard Request',
  121: 'Receiving Shard Request',
  122: 'Shard Request Failed',
  123: 'Shard Request Sent',
  124: 'Shard Request Received',
  125: 'Shards Transferred',
  126: 'Distributing Assurance',
  127: 'Assurance Send Failed',
  128: 'Assurance Sent',
  129: 'Assurance Distributed',
  130: 'Assurance Receive Failed',
  131: 'Assurance Received',
  
  // Bundle recovery events (140-153)
  140: 'Sending Bundle Shard Request',
  141: 'Receiving Bundle Shard Request',
  142: 'Bundle Shard Request Failed',
  143: 'Bundle Shard Request Sent',
  144: 'Bundle Shard Request Received',
  145: 'Bundle Shard Transferred',
  146: 'Reconstructing Bundle',
  147: 'Bundle Reconstructed',
  148: 'Sending Bundle Request',
  149: 'Receiving Bundle Request',
  150: 'Bundle Request Failed',
  151: 'Bundle Request Sent',
  152: 'Bundle Request Received',
  153: 'Bundle Transferred',
  
  // Segment recovery events (160-178)
  160: 'Work-Package Hash Mapped',
  161: 'Segments-Root Mapped',
  162: 'Sending Segment Shard Request',
  163: 'Receiving Segment Shard Request',
  164: 'Segment Shard Request Failed',
  165: 'Segment Shard Request Sent',
  166: 'Segment Shard Request Received',
  167: 'Segment Shards Transferred',
  168: 'Reconstructing Segments',
  169: 'Segment Reconstruction Failed',
  170: 'Segments Reconstructed',
  171: 'Segment Verification Failed',
  172: 'Segments Verified',
  173: 'Sending Segment Request',
  174: 'Receiving Segment Request',
  175: 'Segment Request Failed',
  176: 'Segment Request Sent',
  177: 'Segment Request Received',
  178: 'Segments Transferred',
  
  // Preimage distribution events (190-199)
  190: 'Preimage Announcement Failed',
  191: 'Preimage Announced',
  192: 'Announced Preimage Forgotten',
  193: 'Sending Preimage Request',
  194: 'Receiving Preimage Request',
  195: 'Preimage Request Failed',
  196: 'Preimage Request Sent',
  197: 'Preimage Request Received',
  198: 'Preimage Transferred',
  199: 'Preimage Discarded',
};

// Helper functions for safely accessing event data
export function getEventData(event: TelemetryEvent): Record<string, unknown> {
  return (event?.data || {}) as Record<string, unknown>;
}

export function getBestBlockChanged(event: TelemetryEvent): BlockChangedData | null {
  if (event.event_type !== 11) return null;
  const data = getEventData(event);
  const blockData = data.BestBlockChanged as BlockChangedData | undefined;
  return blockData || null;
}

export function getFinalizedBlockChanged(event: TelemetryEvent): BlockChangedData | null {
  if (event.event_type !== 12) return null;
  const data = getEventData(event);
  const blockData = data.FinalizedBlockChanged as BlockChangedData | undefined;
  return blockData || null;
}

export interface AuthoredData {
  event_id?: number;
  slot?: number;
  block?: {
    slot?: number;
    header_hash?: string | number[];
    size?: number;
  };
  outline?: {
    header_hash?: string | number[];
  };
}

export function getAuthored(event: TelemetryEvent): { slot: number; outline?: { header_hash?: string } } | null {
  if (event.event_type !== 42) return null;
  const data = getEventData(event);
  
  // Try different possible structures
  // 1. Direct Authored wrapper: { Authored: { event_id, block: { ... } } }
  // 2. Direct block data: { event_id, block: { slot, header_hash, ... } }
  // 3. Legacy format: { slot, outline: { header_hash } }
  
  let authored = data.Authored as AuthoredData | undefined;
  if (!authored) {
    // Maybe the data itself is the authored event
    authored = data as AuthoredData;
  }
  
  // Extract slot - could be in block.slot or directly on authored
  let slot = 0;
  if (authored?.block?.slot !== undefined) {
    slot = authored.block.slot;
  } else if (authored?.slot !== undefined) {
    slot = authored.slot;
  }
  
  if (slot <= 0) return null;
  
  // Extract header_hash
  let headerHash: string | undefined;
  const rawHash = authored?.block?.header_hash || authored?.outline?.header_hash;
  if (rawHash) {
    if (typeof rawHash === 'string') {
      headerHash = rawHash;
    } else if (Array.isArray(rawHash)) {
      headerHash = Array.from(rawHash).map(b => (b as number).toString(16).padStart(2, '0')).join('');
    }
  }
  
  return {
    slot,
    outline: headerHash ? { header_hash: headerHash } : undefined,
  };
}

export function getBlockAnnounced(event: TelemetryEvent): { slot: number; hash: string } | null {
  if (event.event_type !== 62) return null;
  const data = getEventData(event);
  const announced = data.BlockAnnounced as { slot?: number; hash?: number[] } | undefined;
  if (!announced || typeof announced.slot !== 'number') return null;
  const hashStr = announced.hash ? Array.from(announced.hash).map(b => b.toString(16).padStart(2, '0')).join('') : '';
  return { slot: announced.slot, hash: hashStr };
}

export function getStatus(event: TelemetryEvent): StatusData | null {
  if (event.event_type !== 10) return null;
  const data = getEventData(event);
  const status = data.Status as StatusData | undefined;
  return status || null;
}

