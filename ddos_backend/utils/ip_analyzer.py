import requests
from datetime import datetime
import geoip2.database
from geoip2.errors import AddressNotFoundError
import psutil
import socket
from typing import Dict, List, Optional
import ipaddress
from .constants import (
    THRESHOLD_REQUESTS_PER_SEC,
    THRESHOLD_BANDWIDTH_MBPS,
    BOTNET_THRESHOLD,
    VPN_PROXY_PORTS,
    INTERNAL_NETWORKS
)

class IPAnalyzer:
    def __init__(self):
        self.ip_categories: Dict[str, dict] = {}
        self.threat_intel_cache: Dict[str, List[str]] = {}
        self.known_vpn_ranges = self._load_vpn_ranges()
        
    def _load_vpn_ranges(self) -> List[str]:
        """Load known VPN IP ranges"""
        try:
            # Try to load from a local cache first
            vpn_ranges = []
            # Add some common VPN ranges for testing
            vpn_ranges.extend([
                "103.21.244.0/22",  # Cloudflare
                "104.16.0.0/12",    # Cloudflare
                "108.162.192.0/18", # Cloudflare
                "162.158.0.0/15",   # Cloudflare
                "172.64.0.0/13",    # Cloudflare
                "131.0.72.0/22",    # ProtonVPN
                "185.159.156.0/22", # ProtonVPN
                "185.159.157.0/24", # ProtonVPN
                "185.159.158.0/24", # ProtonVPN
                "185.159.159.0/24"  # ProtonVPN
            ])
            return vpn_ranges
        except Exception as e:
            print(f"Error loading VPN ranges: {e}")
            return []

    def _get_geo_location(self, ip: str) -> str:
        """Get geographical location of IP"""
        try:
            # For now, return a placeholder. In production, you would use MaxMind GeoIP
            if ip.startswith('192.168.'):
                return 'Local Network'
            elif ip.startswith('10.') or ip.startswith('172.'):
                return 'Internal Network'
            return 'External Network'
        except Exception as e:
            print(f"Error getting geolocation for {ip}: {e}")
            return "Unknown"

    def _get_isp_info(self, ip: str) -> str:
        """Get ISP information for IP"""
        try:
            # For now, return a placeholder. In production, you would use WHOIS
            if ip.startswith(('192.168.', '10.', '172.')):
                return 'Local Network'
            return 'External ISP'
        except Exception as e:
            print(f"Error getting ISP info for {ip}: {e}")
            return "Unknown"

    def categorize_ip(self, ip: str, headers: Dict = None) -> dict:
        """Categorize an IP address based on various factors"""
        category = {
            "type": self._determine_ip_type(ip),
            "risk_score": 0.0,
            "is_vpn": self._is_vpn(ip),
            "is_proxy": self._is_proxy(ip, headers),
            "is_tor": self._is_tor_exit_node(ip),
            "geo_location": self._get_geo_location(ip),
            "isp": self._get_isp_info(ip),
            "last_seen": datetime.now().isoformat(),
            "threat_intel_flags": self._check_threat_intel(ip)
        }
        
        # Calculate risk score based on various factors
        category["risk_score"] = self._calculate_risk_score(ip, category)
        return category

    def _determine_ip_type(self, ip: str) -> str:
        """Determine the type of IP (source, destination, internal, etc.)"""
        try:
            ip_obj = ipaddress.ip_address(ip)
            
            # Check if internal
            for network in INTERNAL_NETWORKS:
                if ip_obj in ipaddress.ip_network(network):
                    return "internal"
            
            # Check if it's our own public IP
            if ip == socket.gethostbyname(socket.gethostname()):
                return "destination"
            
            # Check if it's a known botnet IP
            if self._is_part_of_botnet(ip):
                return "botnet"
            
            # Default to source
            return "source"
        except:
            return "unknown"

    def _is_vpn(self, ip: str) -> bool:
        """Check if IP is a known VPN endpoint"""
        return any(ipaddress.ip_address(ip) in ipaddress.ip_network(vpn_range) 
                  for vpn_range in self.known_vpn_ranges)

    def _is_proxy(self, ip: str, headers: Optional[Dict] = None) -> bool:
        """Detect if IP is likely a proxy"""
        if headers:
            proxy_headers = ['via', 'x-forwarded-for', 'forwarded']
            return any(header in headers.lower() for header in proxy_headers)
        return False

    def _is_tor_exit_node(self, ip: str) -> bool:
        """Check if IP is a TOR exit node"""
        # In production, this would check against TOR exit node list
        return False

    def _check_threat_intel(self, ip: str) -> List[str]:
        """Check IP against threat intelligence feeds"""
        if ip in self.threat_intel_cache:
            return self.threat_intel_cache[ip]
        
        flags = []
        # In production, this would check against actual threat intel feeds
        self.threat_intel_cache[ip] = flags
        return flags

    def _is_part_of_botnet(self, ip: str) -> bool:
        """Determine if IP is part of a botnet based on behavior"""
        from .cloud_monitor import traffic_stats  # Import here to avoid circular import
        if ip in traffic_stats:
            stats = traffic_stats[ip]
            # Check for distributed attack patterns
            similar_ips = self._find_coordinated_ips(ip)
            if len(similar_ips) >= BOTNET_THRESHOLD:
                return True
        return False

    def _find_coordinated_ips(self, target_ip: str) -> List[str]:
        """Find IPs showing coordinated behavior with target IP"""
        from .cloud_monitor import traffic_stats  # Import here to avoid circular import
        coordinated_ips = []
        target_stats = traffic_stats.get(target_ip)
        if not target_stats:
            return coordinated_ips

        for ip, stats in traffic_stats.items():
            if ip != target_ip and self._shows_coordination(stats, target_stats):
                coordinated_ips.append(ip)
        return coordinated_ips

    def _shows_coordination(self, stats1: dict, stats2: dict) -> bool:
        """Check if two IPs show coordinated behavior"""
        time_diff = abs((datetime.fromisoformat(stats1['last_seen']) - 
                        datetime.fromisoformat(stats2['last_seen'])).total_seconds())
        return (time_diff < 5 and  # Within 5 seconds
                abs(stats1['requests_per_second'] - stats2['requests_per_second']) < 10)

    def _calculate_risk_score(self, ip: str, category: dict) -> float:
        """Calculate risk score based on various factors"""
        from .cloud_monitor import traffic_stats  # Import here to avoid circular import
        score = 0.0
        
        # Base risk factors
        if category['is_vpn']:
            score += 0.3
        if category['is_proxy']:
            score += 0.3
        if category['is_tor']:
            score += 0.4
        
        # Traffic pattern risks
        if ip in traffic_stats:
            stats = traffic_stats[ip]
            if stats['requests_per_second'] > THRESHOLD_REQUESTS_PER_SEC:
                score += 0.4
            if (stats['bytes'] / 1024 / 1024) > THRESHOLD_BANDWIDTH_MBPS:
                score += 0.4
        
        # Threat intelligence risks
        score += len(category['threat_intel_flags']) * 0.2
        
        return min(1.0, score)  # Cap at 1.0

# Initialize global analyzer
ip_analyzer = IPAnalyzer() 