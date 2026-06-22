export type SkillNode = {
  id: string;
  title: string;
  description: string;
  xpRequired: number;
  missionsRequired: number;
  children?: string[];
};

export const SKILL_TREE: SkillNode[] = [
  {
    id: "recruit",
    title: "Cyber Recruit",
    description: "Foundations — Linux, networking, security mindset",
    xpRequired: 0,
    missionsRequired: 0,
    children: ["linux"]
  },
  {
    id: "linux",
    title: "Linux Operator",
    description: "Shell, filesystem, logs, basic forensics",
    xpRequired: 200,
    missionsRequired: 3,
    children: ["soc"]
  },
  {
    id: "soc",
    title: "SOC Analyst",
    description: "SIEM, alerts, incident triage, threat hunting",
    xpRequired: 600,
    missionsRequired: 8,
    children: ["pentester"]
  },
  {
    id: "pentester",
    title: "Pentester",
    description: "Recon, web attacks, exploitation, reporting",
    xpRequired: 1200,
    missionsRequired: 15,
    children: ["engineer"]
  },
  {
    id: "engineer",
    title: "Security Engineer",
    description: "Architecture, hardening, automation, leadership",
    xpRequired: 2500,
    missionsRequired: 30
  }
];

export function isNodeUnlocked(
  node: SkillNode,
  xp: number,
  completedMissions: number
): boolean {
  return xp >= node.xpRequired && completedMissions >= node.missionsRequired;
}
