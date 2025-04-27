import React, { useState } from 'react';
import { BlockedIP } from '../types';
import { Ban, Trash2 } from 'lucide-react';

interface BlockedIPsProps {
  blockedIPs: BlockedIP[];
  onRemoveIP: (ip: string) => void;
  onAddIP: (ip: string, reason: string) => void;
}

export function BlockedIPs({ blockedIPs, onRemoveIP, onAddIP }: BlockedIPsProps) {
  const [newIP, setNewIP] = useState('');
  const [reason, setReason] = useState('');

  // Sort IPs by timestamp in descending order (newest first)
  const sortedIPs = [...blockedIPs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Handle form submission to block a new IP
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIP && reason) {
      onAddIP(newIP, reason); // Call the parent function to add the IP
      setNewIP(''); // Reset the form
      setReason('');
    }
  };

  return (
    <div className="space-y-6 2xl:space-y-8">
      <div className="rounded-lg border bg-card p-6 2xl:p-8">
        <h3 className="text-lg 2xl:text-2xl font-semibold mb-4 2xl:mb-6">Add IP to Blacklist</h3>
        <div className="space-y-4 2xl:space-y-6">
          <div>
            <label className="text-sm 2xl:text-base font-medium text-muted-foreground">IP Address</label>
            <input
              type="text"
              className="mt-1 2xl:mt-2 w-full rounded-md border px-3 py-2 2xl:py-3 text-sm 2xl:text-base"
              placeholder="192.168.1.1"
            />
          </div>
          <div>
            <label className="text-sm 2xl:text-base font-medium text-muted-foreground">Reason</label>
            <input
              type="text"
              className="mt-1 2xl:mt-2 w-full rounded-md border px-3 py-2 2xl:py-3 text-sm 2xl:text-base"
              placeholder="Manual block"
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 2xl:px-6 2xl:py-3 text-sm 2xl:text-base font-medium text-primary-foreground">
            Block IP
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-left text-sm 2xl:text-base font-medium">IP Address</th>
                <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-left text-sm 2xl:text-base font-medium">Reason</th>
                <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-left text-sm 2xl:text-base font-medium">Time</th>
                <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-right text-sm 2xl:text-base font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedIPs.map((item) => (
                <tr key={`${item.ip}-${item.timestamp}`} className="border-t hover:bg-muted/50">
                  <td className="p-4 font-mono">{item.ip}</td>
                  <td className="p-4">{item.reason}</td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onRemoveIP(item.ip)}
                      className="inline-flex items-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {sortedIPs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No blocked IPs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}