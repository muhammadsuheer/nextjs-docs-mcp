// Cache management with Upstash Redis (optional)

import { Redis } from '@upstash/redis';
import type { CacheEntry } from '@/types';
import { CACHE_TTL } from './constants';

let redis: Redis | null = null;

/**
 * Initialize Redis connection
 * Automatically uses Vercel's Upstash Redis integration
 * Environment variables (set by Vercel):
 * - KV_REST_API_URL
 * - KV_REST_API_TOKEN
 * - KV_REST_API_READ_ONLY_TOKEN
 * - KV_URL
 * - REDIS_URL
 */
export function initRedis(): Redis | null {
  if (redis) return redis;
  
  try {
    // Vercel Upstash Integration (Primary)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });
      return redis;
    }
    
    // Fallback: Try Redis.fromEnv() for manual configuration
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      return redis;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get cached data
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  try {
    const cached = await redis.get<CacheEntry<T>>(key);
    if (!cached) return null;
    
    // Check if expired
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      await redis.del(key);
      return null;
    }
    
    return cached.data;
  } catch {
    return null;
  }
}

/**
 * Set cached data
 */
export async function setCached<T>(
  key: string,
  data: T,
  ttl: number = CACHE_TTL
): Promise<void> {
  if (!redis) return;
  
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    await redis.setex(key, ttl, JSON.stringify(entry));
  } catch {
    return;
  }
}

/**
 * Clear cache
 */
export async function clearCache(pattern?: string): Promise<void> {
  if (!redis) return;
  
  try {
    if (pattern) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      await redis.flushdb();
    }
  } catch {
    return;
  }
}

/**
 * Generate cache key for search queries
 */
export function generateSearchCacheKey(query: string, options: Record<string, unknown> = {}): string {
  const normalized = query.toLowerCase().trim();
  const optsStr = Object.entries(options)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('_');
  
  return `search:${normalized}:${optsStr}`;
}

