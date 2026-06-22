import { NextResponse } from "next/server";

import { sendFeedbackEmail } from "@/lib/sendFeedbackEmail";

const VALID_CATEGORIES = ["bug", "general", "feature", "lab", "security", "other"] as const;
type FeedbackCategory = typeof VALID_CATEGORIES[number];

function sanitizeCategory(value: unknown): FeedbackCategory {
  const v = String(value ?? "").trim().toLowerCase();
  return (VALID_CATEGORIES as readonly string[]).includes(v)
    ? (v as FeedbackCategory)
    : "general";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = String(body.message ?? "").trim();
    const email = String(body.email ?? "").trim();
    const category = sanitizeCategory(body.category);
    const page = String(body.page ?? "")
      .trim()
      .replace(/[\r\n]/g, "") // prevent header injection
      .slice(0, 200);

    if (message.length < 5 || message.length > 2000) {
      return NextResponse.json({ error: "Message must be 5–2000 characters." }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const result = await sendFeedbackEmail({ message, email, category, page });

    return NextResponse.json({
      success: true,
      method: result.ok ? result.method : "mailto",
      mailto: "mailto" in result ? result.mailto : undefined
    });
  } catch (error) {
    console.error("FEEDBACK ERROR", error);
    return NextResponse.json({ error: "Failed to send feedback." }, { status: 500 });
  }
}
