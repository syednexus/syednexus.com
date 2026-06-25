import crypto from "crypto";

const sessionCookieName = "nexus_lab";
const sessionMaxAge = 60 * 60 * 24;

function getSessionSecret(): string {
  const secret = process.env.NEXUS_SECRET;
  if (!secret) {
    throw new Error("NEXUS_SECRET missing from environment");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

/** Lab simulation unlock only — never grants vault, MFA bypass, or owner APIs. */
export function createLabSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      scope: "lab",
      exp: Date.now() + sessionMaxAge * 1000
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyLabSessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload);
  if (signature.length !== expected.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      scope?: string;
      exp?: number;
    };

    return session.scope === "lab" && typeof session.exp === "number" && session.exp > Date.now();
  } catch {
    return false;
  }
}

export const labSessionCookie = {
  name: sessionCookieName,
  maxAge: sessionMaxAge
};
