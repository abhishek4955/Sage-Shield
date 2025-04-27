import { createEndpoint } from '../utils/api';
import { ENV } from './env';

export type APIEndpoints = {
  TRAFFIC: string;
  BLOCKED_IPS: string;
  ACTIVE_CONNECTIONS: string;
  BLOCK_IP: string;
  UNBLOCK_IP: (ip: string) => string;
  NETWORK_NODES: string;
  NETWORK_STATS: string;
  ANALYTICS: string;
};

export const API_ENDPOINTS: APIEndpoints = {
  TRAFFIC: createEndpoint('traffic'),
  BLOCKED_IPS: createEndpoint('blocked-ips'),
  ACTIVE_CONNECTIONS: createEndpoint('active-connections'),
  BLOCK_IP: createEndpoint('block-ip'),
  UNBLOCK_IP: (ip: string) => createEndpoint(`unblock-ip/${ip}`),
  NETWORK_NODES: createEndpoint('network/nodes'),
  NETWORK_STATS: createEndpoint('network/stats'),
  ANALYTICS: createEndpoint('analytics')
};

// UI Configuration
export const UI_CONFIG = {
  TABLE: {
    MAX_HEIGHT: 600,
    MAX_ENTRIES: 1000,
    REFRESH_INTERVAL: 1000, // milliseconds
  }
};

export { ENV };

// ... rest of the file ... 