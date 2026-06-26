const BLOCKED_PROTOCOL_PREFIXES = [
  "javascript:",
  "data:",
  "file:",
  "vbscript:",
  "blob:"
] as const;

export type SafeUrlValidation =
  | { ok: true; url: string }
  | { ok: false; reason: string };

function hasBlockedProtocol(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return BLOCKED_PROTOCOL_PREFIXES.some(prefix => lower.startsWith(prefix));
}

function allowLocalhostHttp(parsed: URL): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return (
    parsed.protocol === "http:" &&
    (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
  );
}

export function validateSafeUrl(value: string): SafeUrlValidation {
  const url = value.trim();
  if (!url) {
    return { ok: true, url: "" };
  }

  if (hasBlockedProtocol(url)) {
    return { ok: false, reason: "URL uses a disallowed protocol" };
  }

  if (url.startsWith("/") && !url.startsWith("//")) {
    if (url.includes("..") || url.includes("\\")) {
      return { ok: false, reason: "Relative path must not contain traversal sequences" };
    }
    return { ok: true, url };
  }

  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();

    if (BLOCKED_PROTOCOL_PREFIXES.some(prefix => protocol === prefix)) {
      return { ok: false, reason: "URL uses a disallowed protocol" };
    }

    if (protocol === "https:") {
      return { ok: true, url };
    }

    if (allowLocalhostHttp(parsed)) {
      return { ok: true, url };
    }

    return {
      ok: false,
      reason: "URL must use HTTPS (http://localhost allowed in development only)"
    };
  } catch {
    return { ok: false, reason: "Malformed URL" };
  }
}

export function validateOptionalSafeUrl(value: unknown): SafeUrlValidation {
  if (value === null || value === undefined || value === "") {
    return { ok: true, url: "" };
  }

  if (typeof value !== "string") {
    return { ok: false, reason: "URL must be a string" };
  }

  return validateSafeUrl(value);
}
