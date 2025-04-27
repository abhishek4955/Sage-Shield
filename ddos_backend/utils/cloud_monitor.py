import psutil
from datetime import datetime
import socket
import random
import threading
import time
from collections import defaultdict
from .ip_analyzer import ip_analyzer
from .constants import (
    THRESHOLD_REQUESTS_PER_SEC,
    THRESHOLD_BANDWIDTH_MBPS,
    MONITORING_WINDOW
)

# Global statistics
traffic_stats = defaultdict(lambda: {
    'packets': 0,
    'bytes': 0,
    'last_seen': datetime.now(),
    'requests_per_second': 0,
    'start_time': datetime.now(),
    'headers': {},
    'user_agent': '',
    'resource_usage': {},
    'behavioral_flags': [],
    'attack_type': None
})

def get_network_usage():
    """Get current network usage statistics"""
    net_io = psutil.net_io_counters()
    return {
        'bytes_sent': net_io.bytes_sent,
        'bytes_recv': net_io.bytes_recv,
        'packets_sent': net_io.packets_sent,
        'packets_recv': net_io.packets_recv
    }

def get_connections():
    """Get current network connections with enhanced monitoring"""
    connections = []
    try:
        for conn in psutil.net_connections(kind='inet'):
            if conn.status == 'ESTABLISHED':
                try:
                    ip = conn.raddr.ip if conn.raddr else conn.laddr.ip
                    # Get IP category and analysis
                    category = ip_analyzer.categorize_ip(ip)
                    connections.append({
                        'ip': ip,
                        'category': category,
                        'local_port': conn.laddr.port,
                        'remote_port': conn.raddr.port if conn.raddr else None,
                        'status': conn.status,
                        'type': category['type']
                    })
                except:
                    continue
    except:
        # Fallback to local IP if we can't get connections
        local_ip = socket.gethostbyname(socket.gethostname())
        connections.append({
            'ip': local_ip,
            'category': ip_analyzer.categorize_ip(local_ip),
            'local_port': None,
            'remote_port': None,
            'status': 'UNKNOWN',
            'type': 'destination'
        })
    return connections

def monitor_network():
    """Monitor network traffic continuously"""
    last_usage = get_network_usage()
    last_time = time.time()
    
    while True:
        try:
            time.sleep(1)  # Update every second
            current_time = time.time()
            current_usage = get_network_usage()
            
            # Calculate rates
            time_diff = current_time - last_time
            bytes_sent = (current_usage['bytes_sent'] - last_usage['bytes_sent']) / time_diff
            bytes_recv = (current_usage['bytes_recv'] - last_usage['bytes_recv']) / time_diff
            packets_sent = (current_usage['packets_sent'] - last_usage['packets_sent']) / time_diff
            packets_recv = (current_usage['packets_recv'] - last_usage['packets_recv']) / time_diff
            
            # Get active connections
            connections = get_connections()
            
            # Update traffic stats for each connection
            for conn in connections:
                ip = conn['ip']
                stats = traffic_stats[ip]
                stats['last_seen'] = datetime.now()
                stats['packets'] += packets_recv
                stats['bytes'] += bytes_recv
                stats['requests_per_second'] = packets_recv
                
                # Update behavioral flags
                update_behavioral_flags(ip, stats)
            
            last_usage = current_usage
            last_time = current_time
            
        except Exception as e:
            print(f"Error in network monitoring: {e}")
            time.sleep(1)  # Wait before retrying

def fetch_traffic_data():
    """Fetch current traffic statistics with enhanced monitoring"""
    try:
        current_time = datetime.now()
        result = []
        
        # Get current network usage
        net_usage = get_network_usage()
        total_bandwidth = (net_usage['bytes_recv'] + net_usage['bytes_sent']) / 1024 / 1024  # Convert to MB
        
        for ip, stats in traffic_stats.items():
            # Skip if last seen more than 60 seconds ago
            if (current_time - stats['last_seen']).total_seconds() > 60:
                continue
            
            # Calculate bandwidth share for this IP
            time_diff = (current_time - stats['start_time']).total_seconds()
            bandwidth_share = (stats['bytes'] / 1024 / 1024) / max(time_diff, 1)  # MB/s
            
            # Get updated IP category
            category = ip_analyzer.categorize_ip(ip, stats.get('headers', {}))
            
            # Determine attack type based on behavior
            attack_type = determine_attack_type(stats, category)
            
            result.append({
                "timestamp": current_time.isoformat(),
                "source_ip": ip,
                "destination_ip": socket.gethostbyname(socket.gethostname()),
                "requests_per_second": int(stats['requests_per_second']),
                "bandwidth": round(bandwidth_share, 2),
                "status": "suspicious" if is_suspicious(stats) else "normal",
                "category": category,
                "user_agent": stats.get('user_agent', ''),
                "headers": stats.get('headers', {}),
                "resource_usage": get_resource_usage(),
                "behavioral_flags": stats.get('behavioral_flags', []),
                "attack_type": attack_type
            })
        
        # Sort by risk score and return
        return sorted(result, key=lambda x: x['category']['risk_score'], reverse=True)
    except Exception as e:
        print(f"Error fetching traffic data: {e}")
        return []

def determine_attack_type(stats: dict, category: dict) -> str:
    """Determine the type of attack based on traffic patterns"""
    if not is_suspicious(stats):
        return None
        
    if category['type'] == 'botnet':
        return 'DDoS_BOTNET'
    elif stats['requests_per_second'] > THRESHOLD_REQUESTS_PER_SEC * 2:
        return 'DDoS_FLOOD'
    elif category['is_proxy'] or category['is_vpn'] or category['is_tor']:
        return 'PROXY_ABUSE'
    else:
        return 'UNKNOWN_ATTACK'

def update_behavioral_flags(ip: str, stats: dict):
    """Update behavioral flags based on traffic patterns"""
    flags = []
    
    # Check request rate
    if stats['requests_per_second'] > THRESHOLD_REQUESTS_PER_SEC:
        flags.append('HIGH_REQUEST_RATE')
    
    # Check bandwidth usage
    bandwidth_mbps = (stats['bytes'] / 1024 / 1024) / max((datetime.now() - stats['start_time']).total_seconds(), 1)
    if bandwidth_mbps > THRESHOLD_BANDWIDTH_MBPS:
        flags.append('HIGH_BANDWIDTH')
    
    # Check for proxy indicators
    if any(h in stats.get('headers', {}) for h in ['Via', 'X-Forwarded-For']):
        flags.append('PROXY_DETECTED')
    
    stats['behavioral_flags'] = flags

def is_suspicious(stats):
    """Determine if traffic pattern is suspicious"""
    current_time = datetime.now()
    monitoring_time = (current_time - stats['start_time']).total_seconds()
    
    if monitoring_time < MONITORING_WINDOW:
        return False  # Wait for enough data
        
    return (
        stats['requests_per_second'] > THRESHOLD_REQUESTS_PER_SEC or
        (stats['bytes'] / 1024 / 1024 / monitoring_time) > THRESHOLD_BANDWIDTH_MBPS
    )

def get_resource_usage():
    """Get current system resource usage"""
    return {
        'cpu': psutil.cpu_percent(),
        'memory': psutil.virtual_memory().percent
    }

# Start monitoring in background thread
print("Initializing network monitoring...")
monitor_thread = threading.Thread(target=monitor_network, daemon=True)
monitor_thread.start()
print("Network monitoring started in background")