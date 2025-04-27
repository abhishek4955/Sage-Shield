export interface NetworkTraffic {
  id: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  length: number;
  timestamp: string;
  status: 'normal' | 'suspicious' | 'blocked';
  bandwidth: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'cloud' | 'switch' | 'pc';
  status: NodeStatus;
  connections: number;
}

export type NodeStatus = 'active' | 'inactive' | 'warning';
export type ConnectionStatus = 'active' | 'error' | 'warning' | 'idle';

export interface NetworkConnection {
  source: string;
  target: string;
  status: ConnectionStatus;
  bandwidth: number;
}

export interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: string;
  duration: string;
}

export interface LogEntry extends NetworkTraffic {
  type: 'info' | 'warning' | 'error';
  message: string;
}

export type Theme = 'light' | 'dark';