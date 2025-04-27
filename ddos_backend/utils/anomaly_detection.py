from datetime import datetime
from typing import Dict, List, Any
from .constants import THRESHOLD_REQUESTS_PER_SEC, THRESHOLD_BANDWIDTH_MBPS

def detect_anomalies(traffic_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Detect anomalies in traffic data
    Args:
        traffic_data: List of traffic data points
    Returns:
        dict: Anomaly detection results
    """
    suspicious_ips = []
    total_anomalies = 0

    for item in traffic_data:
        if (item['requests_per_second'] > THRESHOLD_REQUESTS_PER_SEC or
            item['bandwidth'] > THRESHOLD_BANDWIDTH_MBPS):
            suspicious_ips.append(item['source_ip'])
            total_anomalies += 1

    return {
        'total_anomalies': total_anomalies,
        'suspicious_ips': suspicious_ips,
        'threshold_rps': THRESHOLD_REQUESTS_PER_SEC,
        'threshold_bw': THRESHOLD_BANDWIDTH_MBPS
    } 