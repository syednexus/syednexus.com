export { requireOwner } from "@/lib/security/requireVaultAccess";

import { requireOwner as requireOwnerSession } from "@/lib/security/requireVaultAccess";

/** Owner session with Vault MFA satisfied (if MFA is enabled). */
export async function requireAdmin(req?: Request) {
  return await requireOwnerSession(req);
}

export async function requireManager(req?: Request) {
  const session = await requireOwnerSession(req);
  if (!session) return null;
  return session;
}
