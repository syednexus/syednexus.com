import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requireAdmin } from "@/lib/adminGuard";
import { versionedAvatarPath } from "@/lib/avatarUrl";

const MAX_BYTES = 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionForMime(mime: string): "jpg" | "png" | "webp" {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
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
    const ext = extensionForMime(file.type);
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const filename = `avatar.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    const version = Date.now();
    const basePath = `/uploads/${filename}`;

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
