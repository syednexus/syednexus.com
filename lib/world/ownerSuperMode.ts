export const OWNER_SUPER_MODE_KEY = "nexus-root";

export function readOwnerSuperModeFlag(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(OWNER_SUPER_MODE_KEY) === "true";
}

export function setOwnerSuperModeFlag(active: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (active) {
    localStorage.setItem(OWNER_SUPER_MODE_KEY, "true");
  } else {
    localStorage.removeItem(OWNER_SUPER_MODE_KEY);
  }

  window.dispatchEvent(new Event("nexus-owner-super-mode"));
}

/** Owner session gets unlimited credits, chain bypass, and mentor freebies. */
export function isOwnerSuperMode(role: string | undefined): boolean {
  return role === "OWNER";
}

/** CLI root shell styling — optional `sudo su` / `nexus shadow ascend`. */
export function isOwnerRootShell(role: string | undefined, rootFlag: boolean): boolean {
  return role === "OWNER" && rootFlag;
}
