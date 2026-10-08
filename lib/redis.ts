const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://aware-mink-296095.upstash.io';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAABISfAAIgcDFhMzAxMWY0ZWY3YWY0NjA1YjJkMTk4MGMwM2Y0YmJhMg';

/**
 * Direct Ultra-Fast Upstash Redis REST Client (sub-10ms response)
 * Uses HTTP POST body payload to prevent URL length / HTTP/2 frameError limits on large JSON catalogs.
 */
export async function redisGet<T = any>(key: string): Promise<T | null> {
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', key]),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json || json.result === null || json.result === undefined) return null;

    if (typeof json.result === 'string') {
      try {
        return JSON.parse(json.result) as T;
      } catch (e) {
        return json.result as T;
      }
    }
    return json.result as T;
  } catch (err) {
    // Silent failover - fallback to memory cache seamlessly
    return null;
  }
}

export async function redisSet(key: string, value: any, ttlSeconds: number = 45): Promise<boolean> {
  try {
    const valString = typeof value === 'string' ? value : JSON.stringify(value);
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', key, valString, 'EX', ttlSeconds]),
      cache: 'no-store',
    });

    if (!res.ok) return false;
    const json = await res.json();
    return json.result === 'OK';
  } catch (err) {
    // Silent failover
    return false;
  }
}

export async function redisDel(key: string): Promise<boolean> {
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['DEL', key]),
      cache: 'no-store',
    });

    if (!res.ok) return false;
    const json = await res.json();
    return typeof json.result === 'number' && json.result > 0;
  } catch (err) {
    // Silent failover
    return false;
  }
}
