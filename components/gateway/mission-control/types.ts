export type CameraMode = "AUTO_ROTATE" | "NODE_FOCUS" | "FREE_ORBIT";

export type HotspotAction = {
  type: "navigate";
  href: string;
  sound?: "soc" | "vault" | "default";
};

export type GlobeHotspot = {
  id: string;
  label: string;
  subtitle: string;
  lat: number;
  lng: number;
  action: HotspotAction;
};

export type SidebarItem = {
  id: string;
  label: string;
  href: string;
  accent?: string;
};

export type FeedItem = {
  id: string;
  timestamp: string;
  severity: "info" | "success" | "warning" | "critical";
  message: string;
};

export type TimelineEvent = {
  id: string;
  label: string;
  period?: string;
};

export type MissionControlStats = {
  missions: number;
  projects: number;
  blogs: number;
  certifications: number;
  skills: number;
  xp: number;
  completedMissions: number;
  databaseHealthy: boolean | null;
};
