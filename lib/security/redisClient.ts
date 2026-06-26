type RedisCommandResult = unknown;

type UpstashResponse = {
  result: RedisCommandResult;
};

let redisAvailable: boolean | null = null;

function getUpstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

export function isRedisConfigured(): boolean {
  return getUpstashConfig() !== null;
}

export async function isRedisAvailable(): Promise<boolean> {
  if (redisAvailable !== null) return redisAvailable;

  const config = getUpstashConfig();
  if (!config) {
    redisAvailable = false;
    return false;
  }

  try {
    await upstashCommand(["PING"]);
    redisAvailable = true;
  } catch {
    redisAvailable = false;
  }

  return redisAvailable;
}

export function resetRedisAvailabilityCache(): void {
  redisAvailable = null;
}

async function upstashCommand(command: (string | number)[]): Promise<RedisCommandResult> {
  const config = getUpstashConfig();
  if (!config) {
    throw new Error("Upstash Redis is not configured");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    resetRedisAvailabilityCache();
    throw new Error(`Upstash Redis error: ${response.status}`);
  }

  const data = (await response.json()) as UpstashResponse;
  return data.result;
}

export async function redisIncrBy(key: string, increment: number): Promise<number> {
  const result = await upstashCommand(["INCRBY", key, increment]);
  return Number(result);
}

export async function redisIncr(key: string): Promise<number> {
  const result = await upstashCommand(["INCR", key]);
  return Number(result);
}

export async function redisExpire(key: string, ttlSeconds: number): Promise<void> {
  await upstashCommand(["EXPIRE", key, ttlSeconds]);
}

export async function redisTtl(key: string): Promise<number> {
  const result = await upstashCommand(["TTL", key]);
  const ttl = Number(result);
  if (!Number.isFinite(ttl) || ttl < 0) {
    return 0;
  }
  return ttl;
}

export async function redisGet(key: string): Promise<string | null> {
  const result = await upstashCommand(["GET", key]);
  if (result === null || result === undefined) return null;
  return String(result);
}

export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (ttlSeconds) {
    await upstashCommand(["SET", key, value, "EX", ttlSeconds]);
    return;
  }
  await upstashCommand(["SET", key, value]);
}

export function threatReputationKey(ip: string): string {
  return `security:ip:${ip}`;
}
