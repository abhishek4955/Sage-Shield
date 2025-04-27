import { Activity, BarChart, Network, FileText, Shield, Settings, Info } from 'lucide-react';

export const PAGES = {
  MONITORING: {
    path: '/',
    title: 'Live Monitoring',
    icon: Activity,
  },
  ANALYTICS: {
    path: '/analytics',
    title: 'Analytics',
    icon: BarChart,
    stats: {
      TRAFFIC_OVERVIEW: {
        title: 'Traffic Overview',
        subtitle: 'Packets processed today',
      },
      ATTACK_ATTEMPTS: {
        title: 'Attack Attempts',
        subtitle: 'Blocked in last 24h',
      },
      ACTIVE_USERS: {
        title: 'Active Users',
        subtitle: 'Unique IPs today',
      },
    },
    sections: {
      TOP_ATTACK_SOURCES: {
        title: 'Top Attack Sources',
        riskLevel: 'High Risk',
      },
      PROTOCOL_DISTRIBUTION: {
        title: 'Protocol Distribution',
      },
    },
  },
  NETWORK_MAPS: {
    path: '/network-maps',
    title: 'Network Maps',
    icon: Network,
    nodeTypes: {
      ROUTER: 'router',
      SWITCH: 'switch',
      ENDPOINT: 'endpoint',
    },
    nodeStatus: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      WARNING: 'warning',
    },
  },
  SYSTEM_LOGS: {
    path: '/system-logs',
    title: 'System Logs',
    icon: FileText,
    logLevels: {
      INFO: 'info',
      WARNING: 'warning',
      ERROR: 'error',
    },
    searchPlaceholder: 'Search logs...',
  },
  SECURITY_RULES: {
    path: '/security-rules',
    title: 'Security Rules',
    icon: Shield,
  },
  SETTINGS: {
    path: '/settings',
    title: 'Settings',
    icon: Settings,
  },
  ABOUT: {
    path: '/about',
    title: 'About',
    icon: Info,
  },
}; 