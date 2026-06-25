import { prisma } from "@/lib/prisma";

let storageReady: boolean | null = null;
let lastCheckAt = 0;
const CHECK_TTL_MS = 30_000;

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code = "code" in error ? String(error.code) : "";
  if (code === "P2021") return true;

  const message = "message" in error ? String(error.message) : String(error);
  return /SecurityLog|does not exist|relation.*not found/i.test(message);
}

export async function isSecurityLogStorageReady(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && storageReady !== null && now - lastCheckAt < CHECK_TTL_MS) {
    return storageReady;
  }

  try {
    await prisma.securityLog.findFirst({
      select: { id: true },
      orderBy: { id: "desc" }
    });
    storageReady = true;
  } catch (error) {
    storageReady = false;
    if (isMissingTableError(error)) {
      console.error(
        "[securityLog] SecurityLog table is missing. Run: npx prisma migrate deploy"
      );
    } else {
      console.error("[securityLog] Unable to reach SecurityLog storage", error);
    }
  }

  lastCheckAt = now;
  return storageReady;
}

export function resetSecurityLogStorageCache(): void {
  storageReady = null;
  lastCheckAt = 0;
}

export function isCriticalAlertMetadata(metadata: unknown): boolean {
  return (
    typeof metadata === "object" &&
    metadata !== null &&
    "alert" in metadata &&
    (metadata as { alert?: unknown }).alert === true
  );
}
