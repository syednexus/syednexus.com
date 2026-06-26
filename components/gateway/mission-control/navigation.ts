import type { SidebarItem } from "./types";

/** Presentation-only nav — all paths are existing routes. */
export const MISSION_CONTROL_SIDEBAR: SidebarItem[] = [
  { id: "gateway", label: "NEXUS GATEWAY", href: "/", accent: "cyan" },
  { id: "sentinel", label: "NEXUS SENTINEL", href: "/portfolio", accent: "blue" },
  { id: "lab", label: "NEXUS LAB", href: "/nexus", accent: "purple" },
  { id: "medcore", label: "MEDCORE", href: "/medcore", accent: "green" },
  { id: "portfolio", label: "PORTFOLIO", href: "/portfolio", accent: "cyan" },
  { id: "projects", label: "PROJECTS", href: "/projects", accent: "amber" },
  { id: "investigations", label: "INVESTIGATIONS", href: "/investigations", accent: "red" },
  { id: "about", label: "OPERATOR", href: "/about", accent: "teal" },
  { id: "forensics", label: "FORENSICS", href: "/forensics", accent: "orange" },
  { id: "blogs", label: "BLOGS", href: "/blog", accent: "slate" },
  { id: "tools", label: "TOOLS", href: "/tools", accent: "gray" },
  { id: "certs", label: "CERTIFICATIONS", href: "/skills-map", accent: "yellow" },
  { id: "career", label: "CAREER", href: "/career", accent: "teal" },
  { id: "contact", label: "CONTACT", href: "/contact", accent: "slate" },
  { id: "vault", label: "VAULT", href: "/vault", accent: "purple" }
];

export const QUICK_LAUNCH = [
  { label: "SOC", href: "/soc" },
  { label: "Lab", href: "/nexus" },
  { label: "Vault", href: "/vault" },
  { label: "Projects", href: "/projects" }
] as const;

export const INFRASTRUCTURE_STACK = [
  "Next.js",
  "React",
  "Tailwind",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Redis",
  "Cloudflare",
  "Google OAuth",
  "Gemini",
  "NextAuth"
] as const;
