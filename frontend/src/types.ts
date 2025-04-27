export interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: string;
  automatic: boolean;
}

export interface NetworkTraffic {
  timestamp: number;
  source_ip: string;
  requests_per_second: number;
  bandwidth: number;
  status: 'normal' | 'suspicious';
}

export type ConnectionStatus = 'active' | 'idle' | 'error';

export interface NetworkConnection {
  source: string;
  target: string;
  status: ConnectionStatus;
  bandwidth: number; // in Mbps
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'cloud' | 'switch' | 'pc';
  status: 'active' | 'inactive' | 'warning';
  connections: number;
}