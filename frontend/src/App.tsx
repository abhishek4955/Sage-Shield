import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { NetworkTable } from './components/NetworkTable';
import { BlockedIPs } from './components/BlockedIPs';
import { LiveStats } from './components/LiveStats';
import { Analytics } from './pages/Analytics';
import NetworkMaps from './pages/NetworkMaps';
import SystemLogs from './pages/SystemLogs';
import SecurityRules from './pages/SecurityRules';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import type { NetworkTraffic, BlockedIP } from './types';
import { API_ENDPOINTS, UI_CONFIG } from './config';

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageTransition, setPageTransition] = useState(false);
  const location = useLocation();

  // Add transition effect on route change
  useEffect(() => {
    setPageTransition(true);
    setTimeout(() => setPageTransition(false), 100);
  }, [location]);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const [traffic, setTraffic] = useState<NetworkTraffic[]>([
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.100",
      requests_per_second: 150,
      bandwidth: 2.5,
      status: "normal"
    },
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.101",
      requests_per_second: 500,
      bandwidth: 8.7,
      status: "suspicious"
    },
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.102",
      requests_per_second: 200,
      bandwidth: 3.2,
      status: "normal"
    },
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.103",
      requests_per_second: 180,
      bandwidth: 2.8,
      status: "normal"
    },
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.104",
      requests_per_second: 450,
      bandwidth: 7.5,
      status: "suspicious"
    },
    {
      timestamp: Date.now(),
      source_ip: "192.168.1.105",
      requests_per_second: 220,
      bandwidth: 3.5,
      status: "normal"
    }
  ]);
  
  const [bandwidth, setBandwidth] = useState<number>(14.4); // Total bandwidth
  const [suspiciousActivities, setSuspiciousActivities] = useState<string[]>(["192.168.1.101"]);
  const [activeConnections, setActiveConnections] = useState<number>(5);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus] = useState<{
    status: 'connected' | 'disconnected' | 'error';
    lastChecked: Date;
  }>({
    status: 'connected',
    lastChecked: new Date()
  });

  // Simulate periodic data updates
  useEffect(() => {
    const updateData = () => {
      try {
        setTraffic(prevTraffic => {
          const updatedTraffic = prevTraffic.map(item => ({
            ...item,
            timestamp: Date.now(),
            requests_per_second: item.requests_per_second + (Math.random() * 20 - 10),
            bandwidth: Math.max(0.1, item.bandwidth + (Math.random() * 0.4 - 0.2))
          }));

          const suspicious = updatedTraffic
            .filter(item => item.requests_per_second > 400)
            .map(item => {
              item.status = 'suspicious';
              return item.source_ip;
            });
          setSuspiciousActivities(suspicious);

          return updatedTraffic;
        });

        // Update total bandwidth
        setBandwidth(prev => Math.max(0.1, prev + (Math.random() * 2 - 1))); // Fluctuate by ±1

        // Randomly update active connections between 3 and 7
        setActiveConnections(Math.floor(Math.random() * 5) + 3);

        setError(null);
      } catch (err) {
        console.error('Error updating data:', err);
        setError('Failed to update monitoring data');
      }
    };

    // Update immediately and then every 5 seconds
    updateData();
    const interval = setInterval(updateData, UI_CONFIG.TABLE.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleRemoveIP = async (ip: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.UNBLOCK_IP(ip), {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to unblock IP');
      }

      // Refresh blocked IPs list
      const blockedIPsResponse = await fetch(API_ENDPOINTS.BLOCKED_IPS);
      const data = await blockedIPsResponse.json();
      setBlockedIPs(data);
    } catch (error) {
      console.error('Error removing IP:', error);
    }
  };

  const handleAddIP = async (ip: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOCK_IP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });

      if (!response.ok) {
        throw new Error('Failed to block IP');
      }

      // Refresh blocked IPs list
      const blockedIPsResponse = await fetch(API_ENDPOINTS.BLOCKED_IPS);
      const data = await blockedIPsResponse.json();
      setBlockedIPs(data);
    } catch (error) {
      console.error('Error adding IP:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      <Header theme={theme} onThemeToggle={toggleTheme} />
      
      <main className={`
        container 
        mx-auto 
        px-4 sm:px-6 lg:px-8 2xl:px-12
        py-4 sm:py-6 lg:py-8 2xl:py-12 
        max-w-[2560px] 
        transition-opacity duration-200 
        ${pageTransition ? 'opacity-50' : 'opacity-100'}
      `}>
        {error && (
          <div className="mb-8 text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
            {error}
          </div>
        )}
        
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-8 animate-fadeIn">
                <LiveStats 
                  traffic={traffic} 
                  bandwidth={bandwidth} 
                  suspiciousActivities={suspiciousActivities}
                  activeConnections={activeConnections}
                />
                <section id="monitoring">
                  <h2 className="mb-4 text-2xl font-bold">Live Network Monitoring</h2>
                  <NetworkTable traffic={traffic} />
                </section>
                <section id="blocked">
                  <h2 className="mb-4 text-2xl font-bold">Blocked IPs</h2>
                  <BlockedIPs
                    blockedIPs={blockedIPs}
                    onRemoveIP={handleRemoveIP}
                    onAddIP={handleAddIP}
                  />
                </section>
              </div>
            }
          />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/network-maps" element={<NetworkMaps />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="/security-rules" element={<SecurityRules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className={`h-2 w-2 rounded-full ${
                systemStatus.status === 'connected' 
                  ? 'bg-green-500' 
                  : systemStatus.status === 'error'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`} 
            />
            <p className="text-sm text-muted-foreground">
              System Status: {systemStatus.status.charAt(0).toUpperCase() + systemStatus.status.slice(1)}
              <span className="ml-2 text-xs">
                (Last checked: {systemStatus.lastChecked.toLocaleTimeString()})
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/abhishek-khadse/Sage-Shield.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;