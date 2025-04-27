import React, { useEffect, useState } from 'react';
import { NetworkTraffic } from '../types';


interface NetworkTableProps {
  traffic: NetworkTraffic[];
}

export function NetworkTable({ traffic }: NetworkTableProps) {
  const [allTraffic, setAllTraffic] = useState<NetworkTraffic[]>([]);

  
  // Keep accumulating traffic data
  useEffect(() => {
    if (traffic && traffic.length > 0) {
      setAllTraffic(prev => {
        const newTraffic = [...prev];
        
        traffic.forEach(item => {
          // Add only if it's a new entry
          if (!newTraffic.some(t => 
            t.source_ip === item.source_ip && 
            t.timestamp === item.timestamp
          )) {
            newTraffic.unshift(item); // Add to the beginning
          }
        });
        
        // Keep only the last 1000 entries to prevent memory issues
        return newTraffic.slice(0, 1000);
      });
    }
  }, [traffic]);
  
  if (!allTraffic || allTraffic.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No traffic data available.
      </div>
    );
  }


  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
          <thead className="bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/75 sticky top-0 z-10">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Source IP</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Requests/s</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Bandwidth</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {allTraffic.map((item, index) => (
              <tr 
                key={`${item.source_ip}-${item.timestamp}-${index}`}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">{new Date(item.timestamp).toLocaleTimeString()}</td>
                <td className="p-4 align-middle font-mono text-sm">{item.source_ip}</td>
                <td className="p-4 align-middle tabular-nums">{item.requests_per_second.toFixed(2)}</td>
                <td className="p-4 align-middle tabular-nums">{item.bandwidth.toFixed(2)} MB/s</td>
                <td className="p-4 align-middle text-center">
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${item.status === 'suspicious' 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-success/10 text-success'}`
                  }>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}