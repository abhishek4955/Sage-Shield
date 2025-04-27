import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SystemLog {
  id: string;
  type: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  source: string;
  timestamp: string;
}

export default function SystemLogs() {
  const [logs] = useState<SystemLog[]>([
    {
      id: '1',
      type: 'ERROR',
      message: 'Failed login attempt from IP 192.168.1.100',
      source: 'auth-service',
      timestamp: '4/11/2025, 4:12:47 PM'
    },
    {
      id: '2',
      type: 'WARNING',
      message: 'High CPU usage detected',
      source: 'system-monitor',
      timestamp: '4/11/2025, 4:12:47 PM'
    },
    {
      id: '3',
      type: 'INFO',
      message: 'Security rule updated: DDoS Protection',
      source: 'security-rules',
      timestamp: '4/11/2025, 4:12:47 PM'
    }
  ]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-9 pr-4 py-2 w-[200px] text-sm rounded-md border bg-background"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border bg-background">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`p-4 rounded-lg ${
              log.type === 'ERROR'
                ? 'bg-red-50'
                : log.type === 'WARNING'
                ? 'bg-yellow-50'
                : 'bg-blue-50'
            }`}
          >
            <div className="flex gap-3">
              <div className="flex-none">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    log.type === 'ERROR'
                      ? 'bg-red-100 text-red-800'
                      : log.type === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {log.type}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.message}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{log.source}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm">System Status: Connected</span>
          <span className="text-xs text-muted-foreground">(Last checked: 4:12:47 PM)</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <a href="#" className="text-primary hover:underline">GitHub</a>
          <a href="#" className="text-primary hover:underline">Documentation</a>
        </div>
      </div>
    </div>
  );
} 