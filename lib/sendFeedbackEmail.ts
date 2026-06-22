const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL ?? "contact@syednexus.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FEEDBACK_FROM = process.env.FEEDBACK_FROM_EMAIL ?? "Nexus Feedback <onboarding@resend.dev>";

export type FeedbackPayload = {
  message: string;
  email?: string;
  category?: string;
  page?: string;
};

export type FeedbackResult =
  | { ok: true; method: "resend" }
  | { ok: true; method: "mailto"; mailto: string }
  | { ok: false; error: string; mailto: string };

export function buildFeedbackMailto(payload: FeedbackPayload): string {
  const subject = encodeURIComponent(
    `[Nexus ${payload.category ?? "Feedback"}]${payload.email ? ` from ${payload.email}` : ""}`
  );
  const body = encodeURIComponent(
    `${payload.message}\n\n---\nPage: ${payload.page ?? "unknown"}\nReply-to: ${payload.email ?? "not provided"}`
  );
  return `mailto:${FEEDBACK_TO}?subject=${subject}&body=${body}`;
}

export async function sendFeedbackEmail(payload: FeedbackPayload): Promise<FeedbackResult> {
  const mailto = buildFeedbackMailto(payload);

  if (!RESEND_API_KEY) {
    console.info("[feedback]", {
      to: FEEDBACK_TO,
      category: payload.category,
      email: payload.email,
      message: payload.message.slice(0, 200)
    });
    return { ok: true, method: "mailto", mailto };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FEEDBACK_FROM,
        to: [FEEDBACK_TO],
        reply_to: payload.email || undefined,
        subject: `[Nexus ${payload.category ?? "Feedback"}]${payload.email ? ` — ${payload.email}` : ""}`,
        text: `${payload.message}\n\n---\nPage: ${payload.page ?? "unknown"}`
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[feedback] Resend error:", detail);
      return { ok: true, method: "mailto", mailto };
    }

    return { ok: true, method: "resend" };
  } catch (error) {
    console.error("[feedback] send failed:", error);
    return { ok: true, method: "mailto", mailto };
  }
}
