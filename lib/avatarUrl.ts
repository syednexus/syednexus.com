const STATIC_AVATAR_PATTERN =
  /^\/(?:uploads\/avatar\.(?:jpe?g|png|webp)|profile\.jpg)(?:\?v=\d+)?$/i;

export function resolveAvatarUrl(
  avatar: string | null | undefined,
  fallback = "/profile.jpg"
): string {
  const value = avatar?.trim();
  if (!value) {
    return fallback;
  }

  if (value.startsWith("data:image/")) {
    return value;
  }

  if (value.startsWith("/") && !value.includes("..")) {
    if (STATIC_AVATAR_PATTERN.test(value.split("?")[0] ?? value)) {
      return value.includes("?v=") ? value : `${value}?v=1`;
    }

    return value;
  }

  return fallback;
}

export function versionedAvatarPath(basePath: string, version = Date.now()): string {
  const clean = basePath.split("?")[0] ?? basePath;
  return `${clean}?v=${version}`;
}
