"use client";

import { useState } from "react";

const FEEDBACK_EMAIL = "contact@syednexus.com";

type NexusFeedbackProps = {
  className?: string;
  onOpen?: () => void;
};

export default function NexusFeedback({ className = "", onOpen }: NexusFeedbackProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statusText, setStatusText] = useState("");

  function openModal() {
    setOpen(true);
    setStatus("idle");
    setStatusText("");
    onOpen?.();
  }

  function openMailto() {
    const subject = encodeURIComponent(`[Nexus ${category}] Feedback`);
    const body = encodeURIComponent(
      `${message || "Your feedback here..."}\n\n---\nReply-to: ${email || "not provided"}\nPage: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function submit() {
    if (message.trim().length < 5) {
      setStatus("error");
      setStatusText("Please enter at least 5 characters.");
      return;
    }

    setStatus("sending");
    setStatusText("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          category,
          page: typeof window !== "undefined" ? window.location.href : ""
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusText(data.error ?? "Failed to send.");
        return;
      }

      if (data.method === "mailto" && data.mailto) {
        window.location.href = data.mailto;
        setStatus("sent");
        setStatusText("Opening your email app to send to contact@syednexus.com…");
        setMessage("");
        return;
      }

      setStatus("sent");
      setStatusText("Thanks — feedback sent to contact@syednexus.com.");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusText("Network error. Use “Email directly” below.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`rounded border border-green-800 px-2.5 py-1 text-xs text-green-400 transition hover:border-green-600 hover:bg-green-950 ${className}`}
      >
        Feedback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-start justify-center bg-black/70 p-4 pt-24 sm:justify-end sm:pr-6 sm:pt-28"
          role="dialog"
          aria-labelledby="feedback-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-green-700 bg-black p-5 font-mono shadow-xl shadow-green-900/30"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="feedback-title" className="text-sm font-bold text-green-400">
                Nexus Feedback
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-300"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              Sent to <span className="text-green-600">{FEEDBACK_EMAIL}</span>
            </p>

            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
              className="mt-4 w-full border border-green-900 bg-black px-3 py-2 text-xs text-green-300 outline-none"
            >
              <option value="general">General feedback</option>
              <option value="bug">Bug report</option>
              <option value="feature">Feature request</option>
              <option value="lab">Lab / mission issue</option>
            </select>

            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Your email (optional, for reply)"
              className="mt-3 w-full border border-green-900 bg-black px-3 py-2 text-xs text-green-300 outline-none"
            />

            <textarea
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Share your thoughts, bugs, or ideas…"
              className="mt-3 h-28 w-full resize-none border border-green-900 bg-black p-3 text-sm text-green-300 outline-none"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={submit}
                disabled={status === "sending"}
                className="border border-green-500 px-4 py-2 text-xs text-green-400 hover:bg-green-950 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send feedback"}
              </button>
              <button
                type="button"
                onClick={openMailto}
                className="border border-gray-700 px-4 py-2 text-xs text-gray-400 hover:bg-gray-950"
              >
                Email directly
              </button>
            </div>

            {statusText && (
              <p
                className={`mt-3 text-xs ${status === "error" ? "text-red-400" : status === "sent" ? "text-green-400" : "text-gray-500"}`}
              >
                {statusText}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
