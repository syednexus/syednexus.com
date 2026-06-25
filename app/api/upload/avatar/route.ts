import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requireAdmin } from "@/lib/adminGuard";
import { versionedAvatarPath } from "@/lib/avatarUrl";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import {
  extensionForImageFormat,
  validateImageBuffer
} from "@/lib/security/validateImageBytes";

const MAX_BYTES = 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, or WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Maximum file size is 1MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const validated = validateImageBuffer(buffer, file.type);

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      path: versionedAvatarPath(basePath, version),
      version
    });
  } catch (error) {
    console.error("AVATAR UPLOAD ERROR", error);
    return NextResponse.json({ error: "Avatar upload failed" }, { status: 500 });
  }
}
