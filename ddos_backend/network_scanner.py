from scapy.all import ARP, Ether, srp
import netifaces
import psutil
import time
from threading import Thread
import json
from datetime import datetime
import logging
import threading

logger = logging.getLogger(__name__)

class NetworkScanner:
    def __init__(self):
        self._running = False
        self._thread = None
        self._data = {
            'stats': {
                'bytesReceived': 0,
                'bytesSent': 0,
                'networkLoad': 0,
                'activeConnections': 0
            },
            'nodes': [
                {
                    'id': '1',
                    'name': 'AWS Cloud',
                    'type': 'cloud',
                    'status': 'active',
                    'connections': 3,
                },
                {
                    'id': '2',
                    'name': 'Core Switch',
                    'type': 'switch',
                    'status': 'active',
                    'connections': 5,
                },
                {
                    'id': '3',
                    'name': 'Web Server',
                    'type': 'server',
                    'status': 'active',
                    'connections': 2,
                },
                {
                    'id': '4',
                    'name': 'DB Server',
                    'type': 'server',
                    'status': 'warning',
                    'connections': 1,
                },
                {
                    'id': '5',
                    'name': 'Dev PC',
                    'type': 'pc',
                    'status': 'active',
                    'connections': 2,
                },
                {
                    'id': '6',
                    'name': 'Admin PC',
                    'type': 'pc',
                    'status': 'active',
                    'connections': 2,
                }
            ],
            'connections': [
                {
                    'source': '1',
                    'target': '2',
                    'status': 'active',
                    'bandwidth': 1000
                },
                {
                    'source': '2',
                    'target': '3',
                    'status': 'active',
                    'bandwidth': 1000
                },
                {
                    'source': '2',
                    'target': '4',
                    'status': 'error',
                    'bandwidth': 0
                },
                {
                    'source': '2',
                    'target': '5',
                    'status': 'active',
                    'bandwidth': 100
                },
                {
                    'source': '2',
                    'target': '6',
                    'status': 'active',
                    'bandwidth': 100
                }
            ]
        }
        logger.info("NetworkScanner initialized with default data: %s", self._data)
        
    def get_default_gateway(self):
        """Get the default gateway IP and interface"""
        try:
            gateways = netifaces.gateways()
            logger.debug("Available gateways: %s", gateways)
            
            if 'default' in gateways and netifaces.AF_INET in gateways['default']:
                default_gateway = gateways['default'][netifaces.AF_INET]
                logger.info("Found default gateway: %s on interface %s", default_gateway[0], default_gateway[1])
                return default_gateway[0], default_gateway[1]
            else:
                # Fallback to first available interface with IPv4
                for interface in netifaces.interfaces():
                    addrs = netifaces.ifaddresses(interface)
                    if netifaces.AF_INET in addrs:
                        ip = addrs[netifaces.AF_INET][0]['addr']
                        logger.info("Using fallback interface: %s with IP: %s", interface, ip)
                        return ip, interface
                raise Exception("No suitable network interface found")
        except Exception as e:
            logger.error("Error getting default gateway: %s", str(e))
            raise

    def get_network_prefix(self):
        """Get network address range for scanning"""
        try:
            gateway_ip, interface = self.get_default_gateway()
            # Convert last octet to 0 for network address
            network_prefix = '.'.join(gateway_ip.split('.')[:-1]) + '.0/24'
            logger.info("Network prefix: %s on interface: %s", network_prefix, interface)
            return network_prefix, interface
        except Exception as e:
            logger.error("Error getting network prefix: %s", str(e))
            raise

    def scan_network(self):
        """Perform ARP scan to discover devices"""
        try:
            network_prefix, interface = self.get_network_prefix()
            logger.info("Starting network scan on %s using interface %s", network_prefix, interface)
            
            # For development/testing, return a basic network structure
            devices = [{
                'ip': '192.168.1.1',  # Router IP
                'mac': 'F2:28:F7:9A:F2:4C',
                'status': 'active',
                'type': 'router'
            }]
            
            # Add a few test devices
            test_devices = [
                {'ip': '192.168.1.100', 'mac': '00:1A:2B:3C:4D:5E', 'status': 'active', 'type': 'device'},
                {'ip': '192.168.1.101', 'mac': '00:2B:3C:4D:5E:6F', 'status': 'active', 'type': 'device'},
                {'ip': '192.168.1.102', 'mac': '00:3C:4D:5E:6F:7G', 'status': 'active', 'type': 'device'}
            ]
            devices.extend(test_devices)
            
            logger.info("Found %d devices", len(devices))
            return devices
        except Exception as e:
            logger.error("Error scanning network: %s", str(e))
            return [{
                'ip': '192.168.1.1',
                'mac': 'F2:28:F7:9A:F2:4C',
                'status': 'active',
                'type': 'router'
            }]

    def get_network_stats(self):
        """Get current network statistics"""
        try:
            # For development/testing, return simulated stats
            stats = {
                'totalDevices': 4,  # Router + 3 test devices
                'activeConnections': 3,  # One connection per test device
                'networkLoad': 25,  # 25% network utilization
                'bytesSent': 1024 * 1024,  # 1MB
                'bytesReceived': 2048 * 1024  # 2MB
            }
            logger.info("Generated test network stats: %s", stats)
            return stats
        except Exception as e:
            logger.error("Error getting network stats: %s", str(e))
            return {
                'totalDevices': 1,
                'activeConnections': 0,
                'networkLoad': 0,
                'bytesSent': 0,
                'bytesReceived': 0
            }

    def get_data(self):
        """Get current network data"""
        return self._data

    def update_network_data(self):
        """Update network data continuously"""
        while self._running:
            try:
                # Update network statistics
                self._data['stats']['bytesReceived'] += 1000
                self._data['stats']['bytesSent'] += 800
                self._data['stats']['networkLoad'] = 30
                self._data['stats']['activeConnections'] = 5

                # Simulate some network changes
                for node in self._data['nodes']:
                    # Randomly update connection counts
                    if time.time() % 30 < 15:  # Every 15 seconds
                        node['connections'] = max(1, min(10, node['connections'] + (1 if time.time() % 2 == 0 else -1)))

                # Update connection bandwidths
                for conn in self._data['connections']:
                    if conn['status'] != 'error':
                        # Simulate bandwidth fluctuation
                        conn['bandwidth'] = max(0, min(2000, conn['bandwidth'] + (100 if time.time() % 2 == 0 else -100)))

                logger.debug("Network data updated")
            except Exception as e:
                logger.error("Error updating network data: %s", str(e))
            
            time.sleep(5)  # Update every 5 seconds

    def start(self):
        """Start the network scanner"""
        if self._running:
            return
        
        self._running = True
        self._thread = Thread(target=self.update_network_data)
        self._thread.daemon = True
        self._thread.start()
        logger.info("Network scanner started")

    def stop(self):
        """Stop the network scanner"""
        self._running = False
        if self._thread:
            self._thread.join()
        logger.info("Network scanner stopped")

# Create a global scanner instance
scanner = NetworkScanner()
scanner.start() 