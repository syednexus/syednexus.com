import Link from "next/link";

import { getAuthConfigurationIssues } from "@/lib/auth/validateAuthConfig";
import {
  sanitizeAuthErrorCode,
  type AuthErrorCode
} from "@/lib/auth/safeAuthError";

type AuthErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function errorCopy(code: AuthErrorCode): { title: string; body: string } {
  switch (code) {
    case "Configuration":
      return {
        title: "Sign-in is not configured",
        body: "OAuth environment variables are missing or invalid."
      };
    case "DatabaseUnavailable":
      return {
        title: "Database connection failed",
        body:
          "Google sign-in succeeded, but Nexus could not reach PostgreSQL. Verify DATABASE_URL and DIRECT_URL in your .env file, then restart the dev server."
      };
    case "AccessDenied":
      return {
        title: "Access denied",
        body: "This Google account is not permitted to sign in, or sign-in was blocked."
      };
    default:
      return {
        title: "Sign-in failed",
        body:
          "Try signing in again. If the problem continues, confirm your Google account matches the configured owner email and that OAuth redirect URIs are correct."
      };
  }
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const errorCode = sanitizeAuthErrorCode(params.error);
  const configIssues = getAuthConfigurationIssues();
  const copy = errorCopy(errorCode);

  return (
    <main className="min-h-screen bg-black px-4 py-16 font-mono text-green-400">
      <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-red-900/40 bg-red-950/10 p-8">
        <p className="text-xs uppercase tracking-widest text-red-400">Auth Error</p>
        <h1 className="text-2xl text-red-300">{copy.title}</h1>
        <p className="text-sm text-gray-400">{copy.body}</p>
        <p className="text-xs text-gray-600">
          Reference code: <span className="text-gray-400">{errorCode}</span>
        </p>

        {errorCode === "Configuration" && configIssues.length > 0 && (
          <div className="space-y-3 text-sm text-gray-300">
            <p>Missing or empty environment variables:</p>
            <ul className="list-disc space-y-2 pl-5">
              {configIssues.map(issue => (
                <li key={issue.variable}>
                  <span className="text-amber-300">{issue.variable}</span>
                  <span className="block text-xs text-gray-500">{issue.hint}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500">
              Google OAuth redirect URI must include{" "}
              <code className="text-green-400">
                {process.env.NEXTAUTH_URL?.trim() || "NEXTAUTH_URL"}
                /api/auth/callback/google
              </code>
            </p>
          </div>
        )}

        {errorCode === "DatabaseUnavailable" && (
          <div className="rounded border border-amber-900/40 bg-amber-950/10 p-4 text-sm text-amber-200/90">
            <p className="font-medium text-amber-300">Checklist</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-100/80">
              <li>DATABASE_URL uses valid Supabase/Postgres credentials</li>
              <li>DIRECT_URL is set for Prisma migrations</li>
              <li>Run <code>npx prisma migrate deploy</code> if the schema changed</li>
              <li>Restart <code>npm run dev</code> after updating .env</li>
            </ul>
          </div>
        )}

        <Link
          href="/"
          className="inline-block border border-green-700 px-4 py-2 text-sm text-green-300 hover:bg-green-950"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
