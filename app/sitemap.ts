import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syednexus.com";

const routes = [
  "",
  "/nexus",
  "/portfolio",
  "/blogs",
  "/games",
  "/soc",
  "/attack",
  "/forensics",
  "/tools",
  "/career",
  "/ai-lab",
  "/skills-map",
  "/security",
  "/privacy"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7
  }));
}
