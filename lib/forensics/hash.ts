export async function sha256Hex(content: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(content)
    );
    return [...new Uint8Array(digest)]
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  const { createHash } = await import("crypto");
  return createHash("sha256").update(content).digest("hex");
}

export function md5PlaceholderFromContent(content: string): string {
  let hash = 0;
  for (let index = 0; index < content.length; index += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
