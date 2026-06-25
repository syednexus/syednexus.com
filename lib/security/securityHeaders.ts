const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syednexus.com";

export function getSecurityConnectSrc(): string {
  return [
    "'self'",
    "https://api.resend.com",
    "https://generativelanguage.googleapis.com",
    "https://accounts.google.com",
    "https://oauth2.googleapis.com"
  ].join(" ");
}

export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src ${getSecurityConnectSrc()}`,
    "media-src 'self' blob:",
    "frame-src 'self' https://accounts.google.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ");
}

export function getProductionSecurityHeaders(): Array<{ key: string; value: string }> {
  return [
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
    },
    ...(isProd
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          }
        ]
      : []),
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy()
    }
  ];
}

export { isProd, siteUrl };
