/**
 * Server-only: signed proofs that the jwt callback requires before applying
 * any MFA state change. Prevents client-side session.update() from forging
 * mfaVerified without a real TOTP challenge.
 *
 * Do NOT import this file in middleware (edge runtime — no Node crypto).
 */
import crypto from "crypto";

/** Proof is valid for 2 minutes after issuance. */
const PROOF_WINDOW_MS = 120_000;

function getProofSecret(): string {
  const s = process.env.NEXUS_SECRET;
  if (!s) throw new Error("NEXUS_SECRET missing — cannot generate MFA proof");
  return s;
}

/**
 * Generate a time-windowed HMAC proof for an MFA action.
 * The proof encodes the action type and a 1-minute time window so
 * replays outside the window are rejected.
 */
export type MfaProofAction = "verify" | "enable" | "activity";

export function generateMfaProof(
  email: string,
  action: MfaProofAction,
  timestamp: number
): string {
  const windowSlot = Math.floor(timestamp / 60_000);
  return crypto
    .createHmac("sha256", getProofSecret())
    .update(`${email.trim().toLowerCase()}|${action}|${windowSlot}`)
    .digest("hex");
}

/**
 * Verify a proof returned by an MFA API route.
 * Returns false if the proof is forged, expired, or the signature is wrong.
 */
export function verifyMfaProof(
  email: string,
  action: MfaProofAction,
  proof: string,
  timestamp: number
): boolean {
  if (!proof || !email) return false;
  if (Date.now() - timestamp > PROOF_WINDOW_MS) return false;

  const expected = generateMfaProof(email, action, timestamp);

  try {
    const proofBuf = Buffer.from(proof, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    return (
      proofBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(proofBuf, expectedBuf)
    );
  } catch {
    return false;
  }
}
