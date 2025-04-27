import React, { useState } from 'react';
import { Network, Wifi, AlertCircle, Info, Search, Filter } from 'lucide-react';
import { NetworkTopology } from '../components/NetworkTopology';
import { NetworkConnection, NetworkNode } from '../types';

interface SystemLog {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  source: string;
  timestamp: string;
}

export default function NetworkMaps() {
  // Hardcoded nodes data
  const staticNodes: NetworkNode[] = [
    {
      id: '1',
      name: 'AWS Cloud',
      type: 'cloud',
      status: 'active',
      connections: 3,
    },
    {
      id: '2',
      name: 'Core Switch',
      type: 'switch',
      status: 'active',
      connections: 5,
    },
    {
      id: '3',
      name: 'Web Server',
      type: 'server',
      status: 'active',
      connections: 2,
    },
    {
      id: '4',
      name: 'DB Server',
      type: 'server',
      status: 'warning',
      connections: 1,
    },
    {
      id: '5',
      name: 'Dev PC',
      type: 'pc',
      status: 'active',
      connections: 2,
    },
    {
      id: '6',
      name: 'Admin PC',
      type: 'pc',
      status: 'active',
      connections: 2,
    },
  ];

  // Hardcoded connections data
  const staticConnections: NetworkConnection[] = [
    {
      source: '1',
      target: '2',
      status: 'active',
      bandwidth: 1000
    },
    {
      source: '2',
      target: '3',
      status: 'active',
      bandwidth: 1000
    },
    {
      source: '2',
      target: '4',
      status: 'error',
      bandwidth: 0
    },
    {
      source: '2',
      target: '5',
      status: 'active',
      bandwidth: 100
    },
    {
      source: '2',
      target: '6',
      status: 'active',
      bandwidth: 100
    }
  ];

  const [nodes] = useState<NetworkNode[]>(staticNodes);
  const [connections] = useState<NetworkConnection[]>(staticConnections);
  const [systemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      type: 'ERROR',
      message: 'Failed login attempt from IP 192.168.1.100',
      source: 'auth-service',
      timestamp: '4/11/2025, 4:00:17 PM'
    },
    {
      id: '2',
      type: 'WARNING',
      message: 'High CPU usage detected',
      source: 'system-monitor',
      timestamp: '4/11/2025, 4:00:17 PM'
    },
    {
      id: '3',
      type: 'INFO',
      message: 'Security rule updated: DDoS Protection',
      source: 'security-rules',
      timestamp: '4/11/2025, 4:00:17 PM'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleRefreshTopology = () => {
    // Simulate refresh action
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  // Filter logs based on search query
  const filteredLogs = systemLogs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Network Maps</h1>
        <button 
          onClick={handleRefreshTopology}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Network className="mr-2 h-4 w-4" />
          Refresh Topology
        </button>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Network Topology and Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Network Topology */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Network Topology</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {loading ? 'Updating...' : 'Live'}
                </span>
                <div className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
              </div>
            </div>
            <div className="w-full h-[400px] relative">
              <NetworkTopology 
                nodes={staticNodes} 
                connections={staticConnections}
                width={800}
                height={400}
              />
            </div>
          </div>

          {/* Network Overview */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Network Overview</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {staticNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        node.status === 'active'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                          : node.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                      }`}
                    >
                      <Wifi className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Type: {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{node.connections} connections</p>
                    <p
                      className={`text-sm ${
                        node.status === 'active'
                          ? 'text-green-600 dark:text-green-400'
                          : node.status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 sticky top-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold">System Logs</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSearchClick}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-accent rounded-md transition-colors">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Search overlay */}
              {isSearchOpen && (
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-background border rounded-md shadow-sm">
                      <div className="flex items-center px-3 py-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                          placeholder="Search logs..."
                          className="flex-1 ml-2 bg-transparent outline-none text-sm"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onBlur={handleSearchBlur}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Logs */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${
                      log.type === 'ERROR'
                        ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20'
                        : log.type === 'WARNING'
                        ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-950/20'
                        : 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {log.type === 'ERROR' ? (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      ) : log.type === 'WARNING' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.message}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{log.source}</span>
                          <span className="mx-2">•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">System Status: Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last checked: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}