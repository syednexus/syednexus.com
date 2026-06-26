import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requireAdmin } from "@/lib/adminGuard";
import { versionedAvatarPath } from "@/lib/avatarUrl";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import { jsonUploadResponse, logUploadValidationFailed } from "@/lib/security/uploadResponse";
import {
  extensionForImageFormat,
  mimeForImageFormat,
  validateImageBuffer,
  type ImageFormat
} from "@/lib/security/validateImageBytes";

const MAX_BYTES = 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function normalizeDeclaredMime(type: string): string {
  const normalized = type.trim().toLowerCase();
  if (!normalized) return "";
  if (normalized === "image/jpg" || normalized === "image/pjpeg") {
    return "image/jpeg";
  }
  return normalized;
}

function isAllowedImageMime(type: string, detectedFormat: ImageFormat | null): boolean {
  const normalized = normalizeDeclaredMime(type);
  if (normalized && ALLOWED_TYPES.has(normalized)) {
    return true;
  }
  return !normalized && detectedFormat !== null;
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return jsonUploadResponse({ error: "Unauthorized" }, 401);
    }

    const data = await req.formData();
    const file = data.get("avatar") as File | null;

    if (!file) {
      logUploadValidationFailed(req, "avatar", "No file uploaded", admin.user?.email);
      return jsonUploadResponse({ error: "No file uploaded" }, 400);
    }

    if (file.size > MAX_BYTES) {
      logUploadValidationFailed(req, "avatar", "File exceeds size limit", admin.user?.email);
      return jsonUploadResponse({ error: "Maximum file size is 1MB" }, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const detectedFormat = validateImageBuffer(buffer, "");
    const format = detectedFormat.ok ? detectedFormat.format : null;

    if (!isAllowedImageMime(file.type, format)) {
      logUploadValidationFailed(req, "avatar", "Invalid MIME type", admin.user?.email);
      return jsonUploadResponse(
        { error: "Only JPG, PNG, or WebP images are allowed" },
        400
      );
    }

    const declaredMime = normalizeDeclaredMime(file.type) || (format ? mimeForImageFormat(format) : "");
    const validated = validateImageBuffer(buffer, declaredMime);

    if (!validated.ok) {
      logUploadValidationFailed(req, "avatar", validated.error, admin.user?.email);
      return jsonUploadResponse({ error: validated.error }, 400);
    }

    const ext = extensionForImageFormat(validated.format);
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const filename = `avatar.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    const version = Date.now();
    const basePath = `/uploads/${filename}`;

    const context = getRequestSecurityContext(req);
    void logSecurityEvent({
      eventType: "FILE_UPLOAD",
      severity: "LOW",
      userEmail: admin.user?.email ?? null,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: {
        fileType: "avatar",
        mimeType: file.type,
        sizeBytes: file.size,
        format: validated.format
      }
    });

    return jsonUploadResponse({
      success: true,
      path: versionedAvatarPath(basePath, version),
      version
    });
  } catch (error) {
    console.error("AVATAR UPLOAD ERROR", error);
    return jsonUploadResponse({ error: "Avatar upload failed" }, 500);
  }
}
