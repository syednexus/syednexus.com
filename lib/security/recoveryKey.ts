import crypto from "crypto";

export function generateRecoveryKey(): string {
  return `NEXUS-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;
}
