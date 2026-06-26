import { validateSafeUrl } from "@/lib/security/safeUrl";

export function safeExternalHref(url: string | null | undefined): string {
  if (!url) {
    return "#";
  }

  const result = validateSafeUrl(url);
  if (!result.ok || !result.url) {
    return "#";
  }

  return result.url;
}
