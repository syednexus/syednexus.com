export type ImageFormat = "jpeg" | "png" | "webp";

export function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (buffer.length < 12) {
    return null;
  }

  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpeg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

export function extensionForImageFormat(format: ImageFormat): "jpg" | "png" | "webp" {
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  return "jpg";
}

export function mimeForImageFormat(format: ImageFormat): string {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return "image/jpeg";
}

export function validateImageBuffer(
  buffer: Buffer,
  declaredMime: string
): { ok: true; format: ImageFormat } | { ok: false; error: string } {
  const format = detectImageFormat(buffer);
  if (!format) {
    return { ok: false, error: "Invalid image file" };
  }

  const expectedMime = mimeForImageFormat(format);
  if (declaredMime && declaredMime !== expectedMime) {
    return { ok: false, error: "Image content does not match declared type" };
  }

  return { ok: true, format };
}
