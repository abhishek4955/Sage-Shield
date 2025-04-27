import { ENV } from '../config/env';
import { API_ENDPOINTS } from '../config';

// API configuration
const API_PREFIX = '/api';

export const createEndpoint = (path: string): string => {
  if (!path) {
    console.error('Path is required for createEndpoint');
    return API_PREFIX;
  }
  
  // Clean up the path by removing leading/trailing slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  
  return `${API_PREFIX}/${cleanPath}`;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      }
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API Error:', error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

export const api = {
  async getAnalytics() {
    return await fetchWithTimeout(API_ENDPOINTS.ANALYTICS);
  },

  async getTraffic() {
    return await fetchWithTimeout(API_ENDPOINTS.TRAFFIC);
  },

  async getBlockedIPs() {
    return await fetchWithTimeout(API_ENDPOINTS.BLOCKED_IPS);
  },

  async getActiveConnections() {
    return await fetchWithTimeout(API_ENDPOINTS.ACTIVE_CONNECTIONS);
  },

  async getNetworkNodes() {
    return await fetchWithTimeout(API_ENDPOINTS.NETWORK_NODES);
  },

  async getNetworkStats() {
    return await fetchWithTimeout(API_ENDPOINTS.NETWORK_STATS);
  },

  async getSettings() {
    return await fetchWithTimeout(API_ENDPOINTS.SETTINGS);
  },

  async updateSettings(settings: any) {
    return await fetchWithTimeout(API_ENDPOINTS.SETTINGS, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async blockIP(ip: string, reason: string) {
    return await fetchWithTimeout(API_ENDPOINTS.BLOCK_IP, {
      method: 'POST',
      body: JSON.stringify({ ip, reason }),
    });
  },

  async unblockIP(ip: string) {
    return await fetchWithTimeout(API_ENDPOINTS.UNBLOCK_IP(ip), {
      method: 'DELETE',
    });
  },
}; 