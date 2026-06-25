import type { OwnerSessionUser } from "@/lib/auth/ownerAccess";
import { isOwnerSessionComplete } from "@/lib/auth/ownerAccess";

/** Owner session with MFA satisfied — unlimited credits and chain bypass. */
export function isOwnerSuperMode(user: OwnerSessionUser | null | undefined): boolean {
  return isOwnerSessionComplete(user);
}

/** Root shell visual styling in NexusAvatar terminal (session-gated, not persisted). */
export function isOwnerRootShell(
  user: OwnerSessionUser | null | undefined,
  rootShellActive: boolean
): boolean {
  return isOwnerSessionComplete(user) && rootShellActive;
}
