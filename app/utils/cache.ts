type CacheEntry<T> = {
  data: T;
  expiry: number;
};

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTtl: number = 60 * 1000; // 1 minute in milliseconds

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if the entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.data as T;
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param data The data to cache
   * @param ttl Time to live in milliseconds (optional, defaults to 1 minute)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Delete a value from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get a value from the cache, or compute and cache it if not present
   * @param key The cache key
   * @param fn Function to compute the value if not in cache
   * @param ttl Time to live in milliseconds (optional)
   * @returns The cached or computed value
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const data = await fn();
    this.set(key, data, ttl);
    return data;
  }
}

// Export a singleton instance
export const apiCache = new ApiCache();