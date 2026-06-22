import { NextResponse } from "next/server";

import { sendFeedbackEmail } from "@/lib/sendFeedbackEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = String(body.message ?? "").trim();
    const email = String(body.email ?? "").trim();
    const category = String(body.category ?? "general").trim();
    const page = String(body.page ?? "").trim();

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
