import type { NextConfig } from "next";

import { getProductionSecurityHeaders, siteUrl } from "@/lib/security/securityHeaders";

const nextConfig: NextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: getProductionSecurityHeaders()
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
export { siteUrl };
