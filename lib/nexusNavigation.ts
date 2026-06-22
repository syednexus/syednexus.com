import { NEXUS_OS_MODULES } from "@/lib/nexusModules";

export type NexusNavItem = {
  name: string;
  desc: string;
  path: string;
  status: string;
  shortLabel?: string;
};

/** Primary Nexus OS training modules */
export const NEXUS_OS_NAV: NexusNavItem[] = [
  {
    name: "Cyber Games",
    desc: NEXUS_OS_MODULES.games.description,
    path: "/games",
    status: "PLAY",
    shortLabel: "Games"
  },
  {
    name: "SOC Simulator",
    desc: NEXUS_OS_MODULES.soc.description,
    path: "/soc",
    status: "BLUE TEAM",
    shortLabel: "SOC"
  },
  {
    name: "Attack Lab",
    desc: NEXUS_OS_MODULES.attack.description,
    path: "/attack",
    status: "RED TEAM",
    shortLabel: "Attack"
  },
  {
    name: "Forensics Lab",
    desc: NEXUS_OS_MODULES.forensics.description,
    path: "/forensics",
    status: "DFIR",
    shortLabel: "Forensics"
  },
  {
    name: "AI Security",
    desc: "AI threat research, prompt injection labs, and LLM security awareness.",
    path: "/ai-lab",
    status: "AI",
    shortLabel: "AI Lab"
  },
  {
    name: "Tool Playground",
    desc: NEXUS_OS_MODULES.tools.description,
    path: "/tools",
    status: "TOOLS",
    shortLabel: "Tools"
  },
  {
    name: "Career Simulator",
    desc: NEXUS_OS_MODULES.career.description,
    path: "/career",
    status: "CAREER",
    shortLabel: "Career"
  }
];

/** Extended gateway modules (homepage + portfolio discovery) */
export const GATEWAY_MODULES: NexusNavItem[] = [
  {
    name: "Nexus OS",
    desc: "Cyber Learning OS — all training modules in one console",
    path: "/nexus",
    status: "HUB"
  },
  {
    name: "Portfolio",
    desc: "Professional identity and journey",
    path: "/portfolio",
    status: "PUBLIC"
  },
  ...NEXUS_OS_NAV,
  {
    name: "Blogs",
    desc: "Research and articles",
    path: "/blogs",
    status: "PUBLIC"
  },
  {
    name: "MedCore",
    desc: "Healthcare security research",
    path: "/medcore",
    status: "RESEARCH"
  },
  {
    name: "Vault",
    desc: "Private knowledge system (owner access)",
    path: "/vault",
    status: "LOCKED"
  },
  {
    name: "Security",
    desc: "Nexus transparency center",
    path: "/security",
    status: "INFO"
  }
];

/** Header navigation — compact groups for desktop */
export type HeaderNavLink = { label: string; href: string };

export type HeaderNavGroup = {
  label: string;
  items: HeaderNavLink[];
};

export type HeaderNavEntry = HeaderNavLink | HeaderNavGroup;

export function isNavGroup(entry: HeaderNavEntry): entry is HeaderNavGroup {
  return "items" in entry;
}

export const HEADER_LAB_LINKS: HeaderNavLink[] = NEXUS_OS_NAV.map(module => ({
  label: module.shortLabel ?? module.name,
  href: module.path
}));

export const HEADER_NAV: HeaderNavEntry[] = [
  { label: "Home", href: "/" },
  { label: "Nexus OS", href: "/nexus" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Labs", items: HEADER_LAB_LINKS },
  { label: "Skills", href: "/skills-map" },
  { label: "Blog", href: "/blogs" },
  { label: "Vault", href: "/vault" }
];

/** Flat list for mobile menu */
export const HEADER_NAV_FLAT: HeaderNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Nexus OS", href: "/nexus" },
  { label: "Portfolio", href: "/portfolio" },
  ...HEADER_LAB_LINKS,
  { label: "Skills", href: "/skills-map" },
  { label: "Blog", href: "/blogs" },
  { label: "Vault", href: "/vault" }
];

/** Avatar terminal commands → routes (public modules) */
export const AVATAR_MODULE_ROUTES: Record<string, string> = {
  games: "/games",
  game: "/games",
  soc: "/soc",
  attack: "/attack",
  lab: "/attack",
  forensics: "/forensics",
  tools: "/tools",
  tool: "/tools",
  career: "/career",
  ai: "/ai-lab",
  "ai-lab": "/ai-lab",
  nexus: "/nexus",
  portfolio: "/portfolio",
  profile: "/",
  projects: "/portfolio",
  medcore: "/medcore",
  blogs: "/blogs",
  blog: "/blogs"
};

export const REQUIRED_ROUTES = [
  "/nexus",
  "/games",
  "/soc",
  "/attack",
  "/forensics",
  "/tools",
  "/career",
  "/ai-lab",
  "/vault",
  "/vault/admin"
] as const;
