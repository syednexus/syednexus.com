import packageJson from "../../package.json";

import { prisma } from "@/lib/prisma";
import { isRedisAvailable, isRedisConfigured } from "@/lib/security/redisClient";

export type RedisHealthStatus = "connected" | "fallback-memory" | "unavailable";
export type RlsHealthStatus = "enabled" | "disabled";
export type EnvironmentName = "development" | "production";

export type PlatformHealthSignals = {
  cloudflare: boolean;
  securityHeaders: boolean;
  dockerProbe: boolean;
};

export type PlatformHealthPayload = {
  status: "ok" | "degraded";
  timestamp: string;
  database: boolean;
  redis: RedisHealthStatus;
  rls: RlsHealthStatus;
  environment: EnvironmentName;
  version: string;
  signals: PlatformHealthSignals;
};

export async function getRedisHealthStatus(): Promise<RedisHealthStatus> {
  if (!isRedisConfigured()) {
    return "fallback-memory";
  }

  if (await isRedisAvailable()) {
    return "connected";
  }

  return "unavailable";
}

export function getRlsHealthStatus(): RlsHealthStatus {
  if (process.env.DATABASE_RLS_ENABLED === "false") {
    return "disabled";
  }

  return "enabled";
}

export function getEnvironmentName(): EnvironmentName {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export function getAppVersion(): string {
  return packageJson.version;
}

export function getPlatformHealthSignals(req: Request): PlatformHealthSignals {
  return {
    cloudflare: Boolean(req.headers.get("cf-ray")),
    securityHeaders: process.env.NODE_ENV === "production",
    dockerProbe: req.headers.get("x-docker-healthcheck") === "1"
  };
}

export async function buildPlatformHealthPayload(req: Request): Promise<PlatformHealthPayload> {
  const database = await checkDatabaseHealth();
  const redis = await getRedisHealthStatus();

  return {
    status: database ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    database,
    redis,
    rls: getRlsHealthStatus(),
    environment: getEnvironmentName(),
    version: getAppVersion(),
    signals: getPlatformHealthSignals(req)
  };
}
