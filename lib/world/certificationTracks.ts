export type CertificationTrackId =
  | "soc"
  | "pentest"
  | "forensics"
  | "network"
  | "ai-security";

export type CertificationTrack = {
  id: CertificationTrackId;
  title: string;
  issuer: string;
  description: string;
  requiredXp: number;
  requiredMissions: number;
  missionTypes: string[];
  skills: string[];
};

export const CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    id: "soc",
    title: "Nexus SOC Analyst",
    issuer: "Nexus Security Institute",
    description: "Incident triage, SIEM operations, and case closure.",
    requiredXp: 600,
    requiredMissions: 8,
    missionTypes: ["SOC", "SIEM", "CAREER_SCENARIO"],
    skills: ["Alert triage", "Log analysis", "Incident reporting"]
  },
  {
    id: "pentest",
    title: "Nexus Penetration Tester",
    issuer: "Nexus Security Institute",
    description: "Web attacks, exploitation, and structured reporting.",
    requiredXp: 1200,
    requiredMissions: 15,
    missionTypes: ["WEB_ATTACK", "RECON", "EXPLOITATION", "PASSWORD_ATTACK"],
    skills: ["Reconnaissance", "Web exploitation", "Privilege escalation"]
  },
  {
    id: "forensics",
    title: "Nexus Digital Forensics",
    issuer: "Nexus Security Institute",
    description: "Evidence handling, timeline analysis, and artifact recovery.",
    requiredXp: 900,
    requiredMissions: 10,
    missionTypes: ["FORENSICS", "MALWARE_ANALYSIS"],
    skills: ["Disk forensics", "Memory analysis", "Chain of custody"]
  },
  {
    id: "network",
    title: "Nexus Network Defender",
    issuer: "Nexus Security Institute",
    description: "Network visibility, segmentation, and traffic analysis.",
    requiredXp: 800,
    requiredMissions: 10,
    missionTypes: ["RECON", "OSINT", "NETWORK"],
    skills: ["Packet analysis", "Firewall review", "Lateral movement detection"]
  },
  {
    id: "ai-security",
    title: "Nexus AI Security",
    issuer: "Nexus Security Institute",
    description: "LLM abuse, prompt injection, and AI governance.",
    requiredXp: 1000,
    requiredMissions: 12,
    missionTypes: ["AI_SECURITY", "WEB_ATTACK"],
    skills: ["Prompt injection", "Model abuse cases", "AI risk assessment"]
  }
];

export function getTrack(id: string): CertificationTrack | undefined {
  return CERTIFICATION_TRACKS.find(track => track.id === id);
}

export function isTrackComplete(
  track: CertificationTrack,
  xp: number,
  completedMissions: number,
  completedTypes: string[]
): boolean {
  const typeMatches = track.missionTypes.some(type =>
    completedTypes.some(done => done.includes(type))
  );
  return (
    xp >= track.requiredXp &&
    completedMissions >= track.requiredMissions &&
    typeMatches
  );
}

export function trackProgressPercent(
  track: CertificationTrack,
  xp: number,
  completedMissions: number
): number {
  const xpPart = Math.min(1, xp / track.requiredXp);
  const missionPart = Math.min(1, completedMissions / track.requiredMissions);
  return Math.round(((xpPart + missionPart) / 2) * 100);
}

export type CertificateData = {
  track: CertificationTrack;
  recipientName: string;
  issuedAt: string;
  xp: number;
  completedMissions: number;
};
