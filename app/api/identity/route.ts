import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "@/lib/adminGuard";
import { getRequestSecurityContext } from "@/lib/security/requestContext";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import { validateIdentityUrls } from "@/lib/security/validateIdentityUrls";

type IdentityPayload = {
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

const MAX_AVATAR_SIZE = 1024 * 1024;

const imageDataUrlPattern = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const staticAvatarPathPattern =
  /^\/(?:uploads\/avatar\.(?:jpe?g|png|webp)|profile\.jpg)(?:\?v=\d+)?$/i;

function isAllowedAvatar(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  if (value.length > MAX_AVATAR_SIZE) {
    return false;
  }

  if (value.startsWith("/")) {
    return !value.includes("..") && staticAvatarPathPattern.test(value);
  }

  return imageDataUrlPattern.test(value);
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown) {
  const clean = cleanString(value);
  return clean ? clean : null;
}

// PUBLIC READ
export async function GET() {
  try {
    const data = await prisma.identity.findFirst();
    return NextResponse.json(data);
  } catch (error) {
    console.error("IDENTITY READ ERROR", error);
    return NextResponse.json({ error: "Identity unavailable" }, { status: 500 });
  }
}

// OWNER ONLY UPDATE
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    if (!isAllowedAvatar(body.avatar)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG/JPEG images under 1MB allowed"
        },
        { status: 400 }
      );
    }

    const urlValidation = validateIdentityUrls(body);
    if (!urlValidation.ok) {
      const context = getRequestSecurityContext(req);
      void logSecurityEvent({
        eventType: "INVALID_URL_REJECTED",
        severity: "MEDIUM",
        userEmail: admin.user?.email ?? null,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        endpoint: context.endpoint,
        metadata: {
          field: urlValidation.field,
          reason: urlValidation.reason
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: `Invalid ${urlValidation.field}: ${urlValidation.reason}`
        },
        { status: 400 }
      );
    }

    const payload: IdentityPayload = {
      name: cleanString(body.name),
      headline: cleanString(body.headline),
      summary: cleanString(body.summary),
      location: optionalString(body.location),
      avatar: optionalString(body.avatar),
      email: optionalString(body.email),
      linkedin: urlValidation.linkedin,
      github: urlValidation.github,
      resume: urlValidation.resume
    };

    const existing = await prisma.identity.findFirst();

    const data = existing
      ? await prisma.identity.update({
          where: {
            id: existing.id
          },
          data: payload
        })
      : await prisma.identity.create({
          data: payload
        });

    const context = getRequestSecurityContext(req);
    void logSecurityEvent({
      eventType: "PROFILE_CHANGED",
      severity: "LOW",
      userEmail: admin.user?.email ?? null,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      endpoint: context.endpoint,
      metadata: {
        updated: existing ? "identity" : "identity_created",
        fields: Object.keys(payload)
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("IDENTITY UPDATE ERROR", error);
    return NextResponse.json(
      {
        success: false,
        error: "Identity update failed"
      },
      { status: 500 }
    );
  }
}
