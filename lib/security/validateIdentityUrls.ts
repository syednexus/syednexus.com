import { validateOptionalSafeUrl } from "@/lib/security/safeUrl";

export type IdentityUrlField = "github" | "linkedin" | "resume" | "website";

export type ValidatedIdentityUrls =
  | {
      ok: true;
      github: string | null;
      linkedin: string | null;
      resume: string | null;
    }
  | {
      ok: false;
      field: IdentityUrlField;
      reason: string;
    };

export function validateIdentityUrls(body: Record<string, unknown>): ValidatedIdentityUrls {
  const validated = {
    github: null as string | null,
    linkedin: null as string | null,
    resume: null as string | null
  };

  const fields: Array<{ field: IdentityUrlField; store: boolean }> = [
    { field: "github", store: true },
    { field: "linkedin", store: true },
    { field: "resume", store: true },
    { field: "website", store: false }
  ];

  for (const { field, store } of fields) {
    if (field === "website" && body.website === undefined) {
      continue;
    }

    const result = validateOptionalSafeUrl(body[field]);
    if (!result.ok) {
      return { ok: false, field, reason: result.reason };
    }

    if (store && field !== "website") {
      validated[field] = result.url || null;
    }
  }

  return { ok: true, ...validated };
}
