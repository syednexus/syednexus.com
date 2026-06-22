import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syednexus.com";

// Allowed external connect origins for CSP
const connectSrc = [
  "'self'",
  "https://api.resend.com",
  "https://generativelanguage.googleapis.com",
  "https://accounts.google.com"
].join(" ");

const nextConfig: NextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
          // HSTS — only in production; forces HTTPS for 1 year
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload"
                }
              ]
            : []),
          // Content Security Policy
          // unsafe-inline/unsafe-eval are needed for Next.js hydration and
          // Tailwind CSS-in-JS. Production apps should migrate to nonces.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: https: blob:`,
              "font-src 'self' data:",
              `connect-src ${connectSrc}`,
              "media-src 'self' blob:",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join("; ")
          }
        ]
      }
    ];
  },

  async redirects() {
    return [
      { source: "/lab", destination: "/attack", permanent: false },
      { source: "/vault/admin/content", destination: "/vault/admin", permanent: false },
      { source: "/malware", destination: "/soc", permanent: false },
      { source: "/phishing", destination: "/soc", permanent: false },
      { source: "/siem", destination: "/soc", permanent: false },
      { source: "/terminal", destination: "/soc", permanent: false },
      { source: "/terminal/missions", destination: "/games", permanent: false },
      { source: "/vault/admin/profile", destination: "/vault/admin/content/profile", permanent: false },
      { source: "/vault/admin/resume", destination: "/vault/admin/content/resume", permanent: false },
      { source: "/vault/admin/education", destination: "/vault/admin/content/education", permanent: false },
      { source: "/vault/admin/experience", destination: "/vault/admin/content/experience", permanent: false },
      { source: "/vault/admin/projects", destination: "/vault/admin/content/projects", permanent: false },
      { source: "/vault/admin/skills", destination: "/vault/admin/content/skills", permanent: false },
      { source: "/vault/admin/blogs", destination: "/vault/admin/content/blogs", permanent: false },
      {
        source: "/vault/admin/certifications",
        destination: "/vault/admin/content/certs",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
