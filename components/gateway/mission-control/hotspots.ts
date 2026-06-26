import type { GlobeHotspot } from "./types";

export const GLOBE_HOTSPOTS: GlobeHotspot[] = [
  {
    id: "australia",
    label: "Operator Profile",
    subtitle: "Melbourne · SOC · DFIR",
    lat: -37.81,
    lng: 144.96,
    action: { type: "navigate", href: "/about" }
  },
  {
    id: "india",
    label: "Career Journey",
    subtitle: "Healthcare · Pharmacy · Migration",
    lat: 17.38,
    lng: 78.47,
    action: { type: "navigate", href: "/about#journey" }
  },
  {
    id: "europe",
    label: "Projects",
    subtitle: "Engineering · Architecture",
    lat: 52.52,
    lng: 13.4,
    action: { type: "navigate", href: "/projects" }
  },
  {
    id: "north-america",
    label: "Investigations",
    subtitle: "SOC · DFIR · Case Studies",
    lat: 39.83,
    lng: -98.58,
    action: { type: "navigate", href: "/investigations", sound: "soc" }
  },
  {
    id: "middle-east",
    label: "MedCore",
    subtitle: "Healthcare Security",
    lat: 25.2,
    lng: 55.27,
    action: { type: "navigate", href: "/medcore" }
  },
  {
    id: "cloud",
    label: "Infrastructure",
    subtitle: "Docker · Redis · Vault",
    lat: 1.35,
    lng: 103.82,
    action: { type: "navigate", href: "/security", sound: "vault" }
  }
];
