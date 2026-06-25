import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { getAuthConfigurationIssues, isAuthConfigured, logAuthConfigurationIssues } from "@/lib/auth/validateAuthConfig";
import { logSecurityEvent } from "@/lib/security/securityLogger";
import { isMfaTrustValid } from "@/lib/security/mfaSession";
import { verifyMfaProof } from "@/lib/security/mfaProof";
import { authErrorPagePath } from "@/lib/auth/safeAuthError";

logAuthConfigurationIssues();

function ownerEmail(): string | undefined {
  return process.env.OWNER_EMAIL?.trim().toLowerCase();
}

function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email || !ownerEmail()) return false;
  return email.trim().toLowerCase() === ownerEmail();
}

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";

export const authOptions: NextAuthOptions = {
  providers: isAuthConfigured()
    ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret
        })
      ]
    : [],

  pages: {
    error: "/auth/error"
  },

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        void logSecurityEvent({
          eventType: "LOGIN_FAILED",
          severity: "MEDIUM",
          metadata: { reason: "missing_email", provider: "google" }
        });
        return false;
      }

      const owner = isOwnerEmail(user.email);

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            name: user.name || "Unknown",
            role: owner ? "OWNER" : "USER"
          }
        });
      } catch (error) {
        console.error("[auth] Database unavailable during Google sign-in", error);
        void logSecurityEvent({
          eventType: "LOGIN_FAILED",
          severity: "HIGH",
          userEmail: user.email,
          metadata: { reason: "database_unavailable", provider: "google" }
        });
        return authErrorPagePath("DatabaseUnavailable");
      }

      void logSecurityEvent({
        eventType: "LOGIN_SUCCESS",
        severity: owner ? "MEDIUM" : "LOW",
        userEmail: user.email,
        metadata: { provider: "google", owner }
      });

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      const email = (user?.email ?? token.email) as string | undefined;

      if (email) {
        let dbUser: { role: string; mfaEnabled: boolean } | null = null;
        let dbLookupFailed = false;

        try {
          dbUser = await prisma.user.findUnique({
            where: { email },
            select: { role: true, mfaEnabled: true }
          });
        } catch (error) {
          dbLookupFailed = true;
          console.error("[auth] Database lookup failed during JWT refresh", error);
        }

        if (isOwnerEmail(email) || dbUser?.role === "OWNER") {
          token.role = "OWNER";

          if (dbLookupFailed || dbUser === null) {
            // Fail closed: never assume MFA is disabled when DB state is unknown
            if (user) {
              token.mfaEnabled = true;
              token.mfaVerified = false;
              delete token.mfaVerifiedAt;
              delete token.lastActivityAt;
            }
          } else {
            token.mfaEnabled = dbUser.mfaEnabled;

            if (!dbUser.mfaEnabled) {
              token.mfaVerified = true;
              delete token.mfaVerifiedAt;
              delete token.lastActivityAt;
            } else if (user) {
              token.mfaVerified = false;
              delete token.mfaVerifiedAt;
              delete token.lastActivityAt;
            } else if (token.mfaVerified && !isMfaTrustValid(token)) {
              token.mfaVerified = false;
            }
          }
        } else {
          delete token.role;
          token.mfaEnabled = false;
          token.mfaVerified = false;
          delete token.mfaVerifiedAt;
          delete token.lastActivityAt;
        }
      }

      // ── SECURE SESSION UPDATES ──────────────────────────────────────────
      // MFA state changes REQUIRE a server-issued HMAC proof.
      // Client cannot forge these without knowing NEXUS_SECRET.
      // Accepting bare mfaVerified/mfaEnabled booleans from the client
      // is intentionally removed — that was the critical vulnerability.
      if (trigger === "update" && session && token.email) {
        type SecurePatch = {
          // Proof set by /api/auth/mfa/verify after successful TOTP
          mfaVerifiedProof?: string;
          // Proof set by /api/auth/mfa/enable after first TOTP confirmation
          mfaEnabledProof?: string;
          // Timestamp at which the proof was issued (for window validation)
          verifiedAt?: number;
          // Activity ping — requires server HMAC from /api/auth/mfa/activity
          lastActivityAt?: number;
          activityProof?: string;
        };

        const patch = session as SecurePatch;
        const emailLower = (token.email as string).trim().toLowerCase();
        const now = Date.now();

        // Allow MFA verification after TOTP challenge (/auth/mfa page)
        if (
          patch.mfaVerifiedProof &&
          typeof patch.verifiedAt === "number" &&
          verifyMfaProof(emailLower, "verify", patch.mfaVerifiedProof, patch.verifiedAt)
        ) {
          token.mfaVerified = true;
          token.mfaVerifiedAt = patch.verifiedAt;
          token.lastActivityAt = patch.verifiedAt;

          void logSecurityEvent({
            eventType: "MFA_SUCCESS",
            severity: "LOW",
            userEmail: emailLower,
            metadata: { source: "session_update", action: "verify" }
          });

          void logSecurityEvent({
            eventType: "OWNER_ACCESS_GRANTED",
            severity: "LOW",
            userEmail: emailLower,
            metadata: { source: "mfa_verify" }
          });
        }

        // Allow setting mfaVerified immediately after enabling MFA
        if (
          patch.mfaEnabledProof &&
          typeof patch.verifiedAt === "number" &&
          verifyMfaProof(emailLower, "enable", patch.mfaEnabledProof, patch.verifiedAt)
        ) {
          token.mfaEnabled = true;
          token.mfaVerified = true;
          token.mfaVerifiedAt = patch.verifiedAt;
          token.lastActivityAt = patch.verifiedAt;
        }

        // Disabling MFA: no proof needed here because /api/auth/mfa/disable
        // already updates the DB. The NEXT jwt callback invocation reads
        // mfaEnabled=false from DB and sets mfaVerified=true automatically.
        // Calling update({}) from MFASetup is enough to trigger that refresh.

        // Activity ping: server-issued proof required (same pattern as MFA verify)
        if (
          patch.activityProof &&
          typeof patch.lastActivityAt === "number" &&
          typeof patch.verifiedAt === "number" &&
          patch.lastActivityAt === patch.verifiedAt &&
          patch.lastActivityAt > 0 &&
          patch.lastActivityAt <= now + 5_000 &&
          verifyMfaProof(emailLower, "activity", patch.activityProof, patch.verifiedAt) &&
          (!token.mfaEnabled || token.mfaVerified)
        ) {
          token.lastActivityAt = patch.lastActivityAt;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.mfaEnabled = Boolean(token.mfaEnabled);
        session.user.mfaVerified = Boolean(token.mfaVerified);
        session.user.mfaVerifiedAt =
          typeof token.mfaVerifiedAt === "number" ? token.mfaVerifiedAt : undefined;
        session.user.lastActivityAt =
          typeof token.lastActivityAt === "number" ? token.lastActivityAt : undefined;
      }

      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET?.trim()
};

export { getAuthConfigurationIssues, isAuthConfigured };
