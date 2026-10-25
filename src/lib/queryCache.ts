/**
 * Zero-Dependency High Performance Stale-While-Revalidate (SWR) Cache
 * Mengeliminasi redundant network requests, mencegah waterfall queries,
 * dan memastikan 0 Cumulative Layout Shift (CLS) pada navigasi antar tab/rute.
 */

import { useState, useEffect, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

const DEFAULT_STALE_TIME = 60 * 1000; // 60 detik (fresh)
const DEFAULT_GC_TIME = 10 * 60 * 1000; // 10 menit (garbage collection)

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  staleTime = DEFAULT_STALE_TIME
): Promise<T> {
  const cached = memoryCache.get(key);
  const now = Date.now();

  // Jika data masih dalam rentang staleTime, kembalikan data memori langsung
  if (cached && now - cached.timestamp < staleTime) {
    return cached.data;
  }

  // Deduplikasi: Jika query yang sama sedang berjalan, gunakan Promise yang sama
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = fetcher()
    .then((freshData) => {
      memoryCache.set(key, { data: freshData, timestamp: Date.now() });
      try {
        sessionStorage.setItem(`ppjm_swr_${key}`, JSON.stringify(freshData));
      } catch {
        // Abaikan jika quota storage terlampaui
      }
      return freshData;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export function getCachedValue<T>(key: string, fallback: T): T {
  // 1. Cek memory cache
  const inMemory = memoryCache.get(key);
  if (inMemory) return inMemory.data;

  // 2. Cek sessionStorage untuk persistensi saat reload
  try {
    const raw = sessionStorage.getItem(`ppjm_swr_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(key, { data: parsed, timestamp: Date.now() });
      return parsed;
    }
  } catch {
    // Fallback jika parsing gagal
  }

  return fallback;
}

/**
 * Hook useCachedQuery untuk React Component
 * Menjamin render instan tanpa flicker skeleton loading jika data sudah tersedia di cache
 */
export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallbackData: T,
  staleTime = DEFAULT_STALE_TIME
): { data: T; loading: boolean; isRevalidating: boolean; error: Error | null; refetch: () => Promise<void> } {
  const [data, setData] = useState<T>(() => getCachedValue(key, fallbackData));
  const [loading, setLoading] = useState<boolean>(() => !memoryCache.has(key));
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const isMountedRef = useRef(true);

  const executeFetch = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      else setIsRevalidating(true);

      const result = await fetchWithCache(key, fetcher, staleTime);
      if (isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsRevalidating(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    executeFetch();

    return () => {
      isMountedRef.current = false;
    };
  }, [key]);

  return {
    data,
    loading,
    isRevalidating,
    error,
    refetch: () => executeFetch(true),
  };
}
