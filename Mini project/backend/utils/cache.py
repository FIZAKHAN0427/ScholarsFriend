from cachetools import TTLCache

# Initialize cache with a TTL of 1 hour and a max size of 500 items
cache = TTLCache(maxsize=500, ttl=3600)