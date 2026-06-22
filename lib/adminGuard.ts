export { requireOwner } from "@/lib/security/requireVaultAccess";

import { requireOwner as requireOwnerSession } from "@/lib/security/requireVaultAccess";

/** Owner session with Vault MFA satisfied (if MFA is enabled). */
export async function requireAdmin() {
  return await requireOwnerSession();
}

export async function requireManager() {
  const session = await requireOwnerSession();
  if (!session) return null;
  return session;
}
