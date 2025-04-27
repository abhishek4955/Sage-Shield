from typing import TypedDict, List, Optional
from datetime import datetime

class IPCategory(TypedDict):
    type: str  # 'source', 'destination', 'botnet', 'proxy', 'internal'
    risk_score: float
    is_vpn: bool
    is_proxy: bool
    is_tor: bool
    geo_location: str
    isp: str
    last_seen: str
    threat_intel_flags: List[str]

class NetworkTraffic(TypedDict):
    timestamp: str
    source_ip: str
    destination_ip: str
    requests_per_second: int
    bandwidth: float
    status: str
    category: IPCategory
    user_agent: str
    headers: dict
    resource_usage: dict  # CPU, RAM, etc.
    behavioral_flags: List[str]  # Anomalous behaviors detected
    attack_type: Optional[str]  # Type of attack if detected

class BlockedIP(TypedDict):
    ip: str
    reason: str
    timestamp: str
    automatic: bool
    category: IPCategory
    block_duration: int  # Duration in seconds
    attack_details: dict 