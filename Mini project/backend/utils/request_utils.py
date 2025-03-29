import requests
import time
import random
from utils.logger import logger

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}

def make_safe_request(url, headers=None, params=None, retries=3, backoff_factor=0.5):
    if headers is None:
        headers = HEADERS
    
    for i in range(retries):
        try:
            if params:
                response = requests.get(url, headers=headers, params=params, timeout=15)
            else:
                response = requests.get(url, headers=headers, timeout=15)
                
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            if i == retries - 1:
                logger.error(f"Failed request after all retries: {url}")
                raise
            wait_time = backoff_factor * (2 ** i) + random.uniform(0, 1)
            logger.warning(f"Request failed ({e}). Retrying in {wait_time:.2f} seconds...")
            time.sleep(wait_time)
    
    return None