export type VisualFeedbackType =
  | "success"
  | "error"
  | "critical"
  | "vault-unlock"
  | "terminal-granted";

const ACTIVE_CLASS = "nexus-visual-active";

export function triggerVisualFeedback(type: VisualFeedbackType, durationMs = 650): void {
  if (typeof document === "undefined") return;

  const body = document.body;
  body.classList.remove(
    "nexus-visual-success",
    "nexus-visual-error",
    "nexus-visual-critical",
    "nexus-visual-vault-unlock",
    "nexus-visual-terminal-granted"
  );

  void body.offsetWidth;

  const className = {
    success: "nexus-visual-success",
    error: "nexus-visual-error",
    critical: "nexus-visual-critical",
    "vault-unlock": "nexus-visual-vault-unlock",
    "terminal-granted": "nexus-visual-terminal-granted"
  }[type];

  body.classList.add(ACTIVE_CLASS, className);

  window.setTimeout(() => {
    body.classList.remove(ACTIVE_CLASS, className);
  }, durationMs);
}
