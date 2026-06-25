export type IdentityRecord = {
  id?: number;
  name: string;
  headline: string;
  summary: string;
  location?: string | null;
  avatar?: string | null;
  email?: string | null;
  linkedin?: string | null;
  github?: string | null;
  resume?: string | null;
};

function isIdentityRecord(value: unknown): value is IdentityRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if ("error" in record) {
    return false;
  }

  return (
    typeof record.name === "string" &&
    typeof record.headline === "string" &&
    typeof record.summary === "string"
  );
}

export async function fetchIdentity(): Promise<
  { ok: true; data: IdentityRecord } | { ok: false; error: string }
> {
  try {
    const res = await fetch("/api/identity");
    const json: unknown = await res.json();

    if (!res.ok) {
      const message =
        json &&
        typeof json === "object" &&
        "error" in json &&
        typeof (json as { error?: unknown }).error === "string"
          ? (json as { error: string }).error
          : "Identity unavailable";
      return { ok: false, error: message };
    }

    if (!isIdentityRecord(json)) {
      return { ok: false, error: "Invalid identity response" };
    }

    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Identity unavailable" };
  }
}

export async function saveIdentity(
  payload: IdentityRecord
): Promise<{ ok: true; data: IdentityRecord } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json &&
        typeof json === "object" &&
        "error" in json &&
        typeof (json as { error?: unknown }).error === "string"
          ? (json as { error: string }).error
          : "Identity update failed";
      return { ok: false, error: message };
    }

    if (!isIdentityRecord(json)) {
      return { ok: false, error: "Invalid identity response" };
    }

    return { ok: true, data: json };
  } catch {
    return { ok: false, error: "Identity update failed" };
  }
}
