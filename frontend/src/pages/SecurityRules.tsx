import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  type: 'BLOCK' | 'ALERT';
  condition: string;
  enabled: boolean;
}

export default function SecurityRules() {
  const [rules] = useState<SecurityRule[]>([
    {
      id: '1',
      name: 'DDoS Protection',
      description: 'Block IPs with excessive request rates',
      type: 'BLOCK',
      condition: 'requests_per_minute > 1000',
      enabled: true
    },
    {
      id: '2',
      name: 'Port Scanning Detection',
      description: 'Alert on potential port scanning activity',
      type: 'ALERT',
      condition: 'distinct_ports_accessed > 10',
      enabled: true
    },
    {
      id: '3',
      name: 'Known Malicious IPs',
      description: 'Block traffic from known malicious IP addresses',
      type: 'BLOCK',
      condition: '',
      enabled: true
    }
  ]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Security Rules</h1>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          Add Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="mt-1.5">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600"></div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-base leading-none mb-2">{rule.name}</h3>
                    <p className="text-sm text-gray-500">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        rule.type === 'BLOCK'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {rule.type}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        className="sr-only peer"
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Condition */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-normal">
                    Condition: <span className="font-mono ml-1">{rule.condition}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 