export type AuthConfigIssue = {
  variable: string;
  hint: string;
};

const REQUIRED_VARS: AuthConfigIssue[] = [
  {
    variable: "NEXTAUTH_SECRET",
    hint: "Generate a long random string and set it in your environment."
  },
  {
    variable: "NEXTAUTH_URL",
    hint: "Must match your app origin (e.g. http://localhost:3000 locally, https://syednexus.com in production)."
  },
  {
    variable: "GOOGLE_CLIENT_ID",
    hint: "Create an OAuth client in Google Cloud Console."
  },
  {
    variable: "GOOGLE_CLIENT_SECRET",
    hint: "Download the OAuth client secret from Google Cloud Console."
  },
  {
    variable: "OWNER_EMAIL",
    hint: "Set to the Google account allowed to access the Vault."
  }
];

export function getAuthConfigurationIssues(): AuthConfigIssue[] {
  return REQUIRED_VARS.filter(({ variable }) => !process.env[variable]?.trim());
}

export function isAuthConfigured(): boolean {
  return getAuthConfigurationIssues().length === 0;
}

export function logAuthConfigurationIssues(): void {
  const issues = getAuthConfigurationIssues();
  if (issues.length === 0) {
    return;
  }

  console.error(
    "[auth] OAuth is misconfigured. Missing environment variables:",
    issues.map(issue => issue.variable).join(", ")
  );
  for (const issue of issues) {
    console.error(`[auth] ${issue.variable}: ${issue.hint}`);
  }
  console.error(
    "[auth] Google OAuth redirect URI must include:",
    `${process.env.NEXTAUTH_URL?.trim() || "NEXTAUTH_URL"}/api/auth/callback/google`
  );
}
