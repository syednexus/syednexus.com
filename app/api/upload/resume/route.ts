import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { requireAdmin } from "@/lib/adminGuard";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import { jsonUploadResponse, logUploadValidationFailed } from "@/lib/security/uploadResponse";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return jsonUploadResponse({ error: "Unauthorized" }, 401);
    }

    const data = await req.formData();
    const file = data.get("resume") as File | null;

    if (!file) {
      logUploadValidationFailed(req, "resume", "No file uploaded", admin.user?.email);
      return jsonUploadResponse({ error: "No file uploaded" }, 400);
    }

    if (file.type !== "application/pdf") {
      logUploadValidationFailed(req, "resume", "Invalid MIME type", admin.user?.email);
      return jsonUploadResponse({ error: "Only PDF allowed" }, 400);
    }

    if (file.size > 2 * 1024 * 1024) {
      logUploadValidationFailed(req, "resume", "File exceeds size limit", admin.user?.email);
      return jsonUploadResponse({ error: "Maximum file size is 2MB" }, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const signature = buffer.subarray(0, 4).toString();
    if (signature !== "%PDF") {
      logUploadValidationFailed(req, "resume", "Invalid PDF signature", admin.user?.email);
      return jsonUploadResponse({ error: "Invalid PDF file" }, 400);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, "resume.pdf");
    await writeFile(filePath, buffer);

    const context = getRequestSecurityContext(req);
    void logSecurityEvent({
      eventType: "FILE_UPLOAD",
      severity: "LOW",
      userEmail: admin.user?.email ?? null,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: {
        fileType: "resume",
        mimeType: file.type,
        sizeBytes: file.size
      }
    });

    return jsonUploadResponse({
      success: true,
      path: "/uploads/resume.pdf"
    });
  } catch (error) {
    console.error("RESUME UPLOAD ERROR", error);
    return jsonUploadResponse({ error: "Resume upload failed" }, 500);
  }
}
