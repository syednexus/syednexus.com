import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { isMfaTrustValid } from "@/lib/security/mfaSession";
import { verifyMfaProof } from "@/lib/security/mfaProof";

function ownerEmail(): string | undefined {
  return process.env.OWNER_EMAIL?.trim().toLowerCase();
}

function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email || !ownerEmail()) return false;
  return email.trim().toLowerCase() === ownerEmail();
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name || "Unknown",
          role: isOwnerEmail(user.email) ? "OWNER" : "USER"
        }
      });

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      const email = (user?.email ?? token.email) as string | undefined;

      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { role: true, mfaEnabled: true }
        });

        if (isOwnerEmail(email) || dbUser?.role === "OWNER") {
          token.role = "OWNER";
          token.mfaEnabled = dbUser?.mfaEnabled ?? false;

          if (!(dbUser?.mfaEnabled ?? false)) {
            // MFA not enabled in DB → no challenge needed
            token.mfaVerified = true;
            delete token.mfaVerifiedAt;
            delete token.lastActivityAt;
          } else if (user) {
            // Initial login and MFA is enabled → require fresh TOTP challenge
            token.mfaVerified = false;
            delete token.mfaVerifiedAt;
            delete token.lastActivityAt;
          } else if (token.mfaVerified && !isMfaTrustValid(token)) {
            // Trust window (2h inactive / 12h absolute) expired
            token.mfaVerified = false;
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
          // Activity ping — accepted only when already MFA-verified
          lastActivityAt?: number;
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

        // Activity ping: only accepted when the token is already in a
        // verified state to prevent inactivity-window bypass.
        if (
          typeof patch.lastActivityAt === "number" &&
          patch.lastActivityAt > 0 &&
          patch.lastActivityAt <= now + 5_000 && // no future timestamps
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

  secret: process.env.NEXTAUTH_SECRET
};
