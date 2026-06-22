import { generateSecret, generateURI, verifySync } from "otplib";

import { decrypt, encrypt } from "@/lib/crypto";

const ISSUER = "Syed Nexus Vault";
const APP_NAME = "Syed Nexus";

export function createTotpSecret(): string {
  return generateSecret();
}

export function buildOtpAuthUri(email: string, secret: string): string {
  return generateURI({
    issuer: ISSUER,
    label: `${APP_NAME}:${email}`,
    secret
  });
}

export function verifyTotpToken(secret: string, token: string): boolean {
  const code = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return false;

  try {
    const result = verifySync({ token: code, secret });
    return result.valid === true;
  } catch {
    return false;
  }
}

export function encryptTotpSecret(secret: string): string {
  return encrypt(secret);
}

export function decryptTotpSecret(payload: string | null | undefined): string | null {
  if (!payload) return null;
  try {
    return decrypt(payload);
  } catch {
    return null;
  }
}

export function verifyStoredTotp(
  encryptedSecret: string | null | undefined,
  token: string
): boolean {
  const secret = decryptTotpSecret(encryptedSecret);
  if (!secret) return false;
  return verifyTotpToken(secret, token);
}
