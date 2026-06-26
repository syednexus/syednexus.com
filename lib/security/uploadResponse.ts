import { NextResponse } from "next/server";

import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";

const UPLOAD_JSON_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Content-Disposition": "inline"
} as const;

export function jsonUploadResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: UPLOAD_JSON_HEADERS
  });
}

export function logUploadValidationFailed(
  req: Request,
  fileType: string,
  reason: string,
  userEmail?: string | null
): void {
  const context = getRequestSecurityContext(req);
  void logSecurityEvent({
    eventType: "UPLOAD_VALIDATION_FAILED",
    severity: "MEDIUM",
    userEmail: userEmail ?? null,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    endpoint: context.endpoint,
    metadata: {
      fileType,
      reason
    }
  });
}
