import yaml
import os

def load_config():
    """Load configuration from YAML file"""
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config.yaml')
    try:
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        return None

# Load config once at module import
CONFIG = load_config()

def get_config(section, key=None):
    """Get configuration value(s)
    
    Args:
        section (str): Configuration section name
        key (str, optional): Specific key within section. If None, returns entire section.
    
    Returns:
        Configuration value or section
    """
    if not CONFIG:
        return None
        
    if key is None:
        return CONFIG.get(section)
    
    section_data = CONFIG.get(section)
    if not section_data:
        return None
        
    return section_data.get(key) 