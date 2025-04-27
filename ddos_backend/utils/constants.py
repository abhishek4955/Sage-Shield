# Network monitoring thresholds
THRESHOLD_REQUESTS_PER_SEC = 100  # Requests per second threshold
THRESHOLD_BANDWIDTH_MBPS = 50     # Bandwidth threshold in MB/s
MONITORING_WINDOW = 60            # Time window for monitoring in seconds
BOTNET_THRESHOLD = 5             # Number of coordinated IPs to consider as botnet

# Network ranges
INTERNAL_NETWORKS = [
    "10.0.0.0/8",      # RFC1918 private network
    "172.16.0.0/12",   # RFC1918 private network
    "192.168.0.0/16",  # RFC1918 private network
    "127.0.0.0/8"      # Localhost
]

# Common ports used by VPNs and proxies
VPN_PROXY_PORTS = [
    1194,  # OpenVPN
    1723,  # PPTP
    500,   # IKEv2
    4500,  # IKEv2 NAT-T
    8080,  # HTTP proxy
    3128,  # Squid proxy
    9001   # Tor
]

# Risk scores
RISK_SCORES = {
    'vpn': 0.3,
    'proxy': 0.3,
    'tor': 0.4,
    'high_traffic': 0.4,
    'high_bandwidth': 0.4,
    'threat_intel': 0.2
}

# Sample VPN ranges
VPN_RANGES = [
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
] 