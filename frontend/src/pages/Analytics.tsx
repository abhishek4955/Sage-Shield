import React, { useState, useEffect } from 'react';
import { Activity, BarChart, Users } from 'lucide-react';
import axios from 'axios';
import { PAGES } from '../config/pages';
import { API_ENDPOINTS } from '../config';
import { ENV } from '../config/env';

const { stats, sections } = PAGES.ANALYTICS;

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | undefined;
  subtitle: string;
  isLoading?: boolean;
}

interface AnalyticsData {
  traffic: {
    total: number;
    blocked: number;
    suspicious: number;
  };
  attacks: {
    total: number;
    ddos: number;
    bruteforce: number;
    other: number;
  };
  topAttackers: Array<{
    ip: string;
    attempts: number;
  }>;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, isLoading }) => (
  <div className="rounded-lg border bg-card p-6">
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <p className="mt-2 text-2xl font-bold">
      {isLoading ? (
        <span className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-24 inline-block"></span>
      ) : value || 'N/A'}
    </p>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.ANALYTICS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.status}`);
      }

      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received');
      }

      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      
      // Use mock data in development environment
      if (import.meta.env.DEV) {
        console.log('Using mock data in development');
        setAnalyticsData({
          traffic: {
            total: 15234,
            blocked: 523,
            suspicious: 89
          },
          attacks: {
            total: 523,
            ddos: 245,
            bruteforce: 178,
            other: 100
          },
          topAttackers: [
            { ip: '192.168.1.100', attempts: 156 },
            { ip: '192.168.1.101', attempts: 89 },
            { ip: '192.168.1.102', attempts: 67 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
          {error}
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{PAGES.ANALYTICS.title}</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={Activity}
          title={stats.TRAFFIC_OVERVIEW.title}
          value={analyticsData?.traffic.total.toString()}
          subtitle={stats.TRAFFIC_OVERVIEW.subtitle}
          isLoading={loading}
        />
        <StatCard
          icon={BarChart}
          title={stats.ATTACK_ATTEMPTS.title}
          value={analyticsData?.attacks.total.toString()}
          subtitle={stats.ATTACK_ATTEMPTS.subtitle}
          isLoading={loading}
        />
        <StatCard
          icon={Users}
          title={stats.ACTIVE_USERS.title}
          value={analyticsData?.topAttackers.length.toString()}
          subtitle={stats.ACTIVE_USERS.subtitle}
          isLoading={loading}
        />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-medium">{sections.TOP_ATTACK_SOURCES.title}</h3>
        <div className="space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="space-y-1">
                  <span className="bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded inline-block"></span>
                  <p className="bg-gray-200 dark:bg-gray-700 h-4 w-48 rounded"></p>
                </div>
                <span className="bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></span>
              </div>
            ))
          ) : analyticsData?.topAttackers && analyticsData.topAttackers.length > 0 ? (
            analyticsData.topAttackers.map((source) => (
              <div key={source.ip} className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-mono">{source.ip}</span>
                  <p className="text-sm text-muted-foreground">
                    {source.attempts} attempts
                  </p>
                </div>
                <span className={source.attempts > 20 ? "text-red-500" : "text-yellow-500"}>
                  {source.attempts > 20 ? "High Risk" : "Medium Risk"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No attack sources detected</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-medium">{sections.PROTOCOL_DISTRIBUTION.title}</h3>
        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <span className="bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded"></span>
                <span className="bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></span>
              </div>
            ))
          ) : analyticsData ? (
            <>
              <div className="flex items-center justify-between">
                <span>DDoS Attacks</span>
                <span className="font-medium">{analyticsData.attacks.ddos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Brute Force</span>
                <span className="font-medium">{analyticsData.attacks.bruteforce}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Other Attacks</span>
                <span className="font-medium">{analyticsData.attacks.other}</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No protocol data available</p>
          )}
        </div>
      </div>
    </div>
  );
} 