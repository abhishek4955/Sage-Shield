import * as React from 'react';
import { NetworkTraffic } from '../types';
import { Activity, AlertTriangle, Gauge, Signal } from 'lucide-react';

interface LiveStatsProps {
  traffic: NetworkTraffic[];
  bandwidth: number;
  suspiciousActivities: string[];
  activeConnections: number;
}

export function LiveStats({ traffic, bandwidth, suspiciousActivities, activeConnections }: LiveStatsProps) {
  // Calculate current stats
  const currentStats = React.useMemo(() => {
    if (!traffic || traffic.length === 0) {
      console.debug('LiveStats: No traffic data available');
      return {
        requestsPerSecond: 0,
        suspiciousActivities: 0,
      };
    }

    const lastMinute = Date.now() - 60000;
    const recentTraffic = traffic.filter(t => new Date(t.timestamp).getTime() > lastMinute);
    
    const totalRequests = recentTraffic.reduce((sum, t) => {
      const requests = Number(t.requests_per_second);
      if (isNaN(requests)) {
        console.warn('LiveStats: Invalid requests_per_second value:', t.requests_per_second);
        return sum;
      }
      return sum + requests;
    }, 0);

    const suspiciousCount = recentTraffic.filter(t => t.status === 'suspicious').length;
    
    return {
      requestsPerSecond: totalRequests,
      suspiciousActivities: suspiciousCount
    };
  }, [traffic, bandwidth, activeConnections]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6">
      {/* Total Requests Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Total Requests</h3>
          <Activity className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.requestsPerSecond.toLocaleString()}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">req/s</span>
        </p>
      </div>

      {/* Bandwidth Usage Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Bandwidth Usage</h3>
          <Gauge className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {bandwidth.toFixed(2)}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">MB/s</span>
        </p>
      </div>

      {/* Active Connections Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Active Connections</h3>
          <Signal className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {activeConnections}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">active</span>
        </p>
      </div>

      {/* Suspicious Activities Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Suspicious Activities</h3>
          <AlertTriangle className={`h-4 w-4 ${
            currentStats.suspiciousActivities > 0 ? 'text-red-500' : 'text-primary'
          }`} />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.suspiciousActivities}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">detected</span>
        </p>
      </div>
    </div>
  );
} 