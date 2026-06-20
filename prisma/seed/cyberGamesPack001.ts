import { Mission } from "@/types/mission";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type GameSeed = {
  title: string;
  description: string;
  type: Mission["type"];
  difficulty: Mission["difficulty"];
  xpReward: number;
  duration: string;
  tags: string[];
};

const LINUX_ARENA: GameSeed[] = [
  {
    title: "Terminal Escape Room",
    description: "Escape a locked-down shell by chaining navigation and discovery commands.",
    type: "LINUX_GAME",
    difficulty: "beginner",
    xpReward: 70,
    duration: "15 min",
    tags: ["linux", "terminal", "escape"],
  },
  {
    title: "Linux Command Trainer",
    description: "Practice essential Linux commands through guided terminal drills.",
    type: "COMMAND_CHALLENGE",
    difficulty: "beginner",
    xpReward: 65,
    duration: "12 min",
    tags: ["linux", "commands", "training"],
  },
  {
    title: "File Explorer Challenge",
    description: "Traverse directories and locate mission artifacts across the filesystem.",
    type: "LINUX_GAME",
    difficulty: "beginner",
    xpReward: 60,
    duration: "10 min",
    tags: ["linux", "filesystem", "navigation"],
  },
  {
    title: "chmod Permission Puzzle",
    description: "Fix broken file permissions to unlock the next stage of the challenge.",
    type: "LINUX_GAME",
    difficulty: "intermediate",
    xpReward: 85,
    duration: "18 min",
    tags: ["linux", "permissions", "chmod"],
  },
  {
    title: "Hidden File Hunter",
    description: "Find concealed files and dotfile secrets using listing and search tools.",
    type: "LINUX_GAME",
    difficulty: "beginner",
    xpReward: 75,
    duration: "14 min",
    tags: ["linux", "hidden-files", "discovery"],
  },
  {
    title: "Grep Detective",
    description: "Extract clues from log files using pattern search and filtering.",
    type: "COMMAND_CHALLENGE",
    difficulty: "intermediate",
    xpReward: 90,
    duration: "16 min",
    tags: ["linux", "grep", "logs"],
  },
  {
    title: "Bash Challenge",
    description: "Build bash one-liners to automate repetitive operator tasks.",
    type: "COMMAND_CHALLENGE",
    difficulty: "intermediate",
    xpReward: 95,
    duration: "20 min",
    tags: ["bash", "scripting", "automation"],
  },
  {
    title: "Cron Puzzle",
    description: "Decode scheduled task entries and identify suspicious job activity.",
    type: "LINUX_GAME",
    difficulty: "intermediate",
    xpReward: 88,
    duration: "17 min",
    tags: ["linux", "cron", "scheduling"],
  },
  {
    title: "Process Killer",
    description: "Identify rogue processes and terminate them safely under pressure.",
    type: "LINUX_GAME",
    difficulty: "beginner",
    xpReward: 72,
    duration: "13 min",
    tags: ["linux", "processes", "ps"],
  },
  {
    title: "Pipe Master",
    description: "Chain commands with pipes and redirects to transform raw output.",
    type: "COMMAND_CHALLENGE",
    difficulty: "beginner",
    xpReward: 68,
    duration: "12 min",
    tags: ["linux", "pipes", "shell"],
  },
  {
    title: "Path Navigator",
    description: "Resolve absolute and relative paths to reach protected mission files.",
    type: "LINUX_GAME",
    difficulty: "beginner",
    xpReward: 62,
    duration: "11 min",
    tags: ["linux", "paths", "navigation"],
  },
];

const NETWORKING_ARENA: GameSeed[] = [
  {
    title: "Port Hunter",
    description: "Scan a target host and identify exposed services by port signature.",
    type: "NETWORK_GAME",
    difficulty: "beginner",
    xpReward: 70,
    duration: "14 min",
    tags: ["network", "ports", "scanning"],
  },
  {
    title: "Protocol Match",
    description: "Match transport protocols to the correct layer and use case.",
    type: "NETWORK_GAME",
    difficulty: "beginner",
    xpReward: 65,
    duration: "12 min",
    tags: ["network", "protocols", "fundamentals"],
  },
  {
    title: "OSI Challenge",
    description: "Place network events on the correct OSI model layers under time pressure.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 90,
    duration: "18 min",
    tags: ["network", "osi", "layers"],
  },
  {
    title: "TCP Handshake Simulator",
    description: "Walk through SYN, SYN-ACK, and ACK sequences to establish a session.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 95,
    duration: "20 min",
    tags: ["network", "tcp", "handshake"],
  },
  {
    title: "Packet Builder",
    description: "Assemble valid packet headers for ICMP, TCP, and UDP scenarios.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 92,
    duration: "19 min",
    tags: ["network", "packets", "headers"],
  },
  {
    title: "Subnet Challenge",
    description: "Calculate CIDR ranges and identify hosts inside a target subnet.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 88,
    duration: "17 min",
    tags: ["network", "subnet", "cidr"],
  },
  {
    title: "Firewall Builder",
    description: "Craft allow and deny rules to protect a segment without breaking services.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 100,
    duration: "22 min",
    tags: ["network", "firewall", "rules"],
  },
  {
    title: "DNS Detective",
    description: "Trace DNS resolution paths and spot spoofed or malicious records.",
    type: "NETWORK_GAME",
    difficulty: "beginner",
    xpReward: 75,
    duration: "15 min",
    tags: ["network", "dns", "resolution"],
  },
  {
    title: "ARP Resolver",
    description: "Analyze ARP tables and detect cache poisoning indicators.",
    type: "NETWORK_GAME",
    difficulty: "beginner",
    xpReward: 78,
    duration: "14 min",
    tags: ["network", "arp", "layer2"],
  },
  {
    title: "Routing Table Quest",
    description: "Follow routing decisions across hops to reach the correct destination.",
    type: "NETWORK_GAME",
    difficulty: "intermediate",
    xpReward: 86,
    duration: "18 min",
    tags: ["network", "routing", "traceroute"],
  },
];

const PACKET_ANALYSIS_ARENA: GameSeed[] = [
  {
    title: "Wireshark Investigation",
    description: "Inspect a capture file and isolate the conversation that triggered an alert.",
    type: "PACKET_ANALYSIS",
    difficulty: "intermediate",
    xpReward: 105,
    duration: "24 min",
    tags: ["pcap", "wireshark", "analysis"],
  },
  {
    title: "Malicious Packet Hunt",
    description: "Filter noisy traffic and identify packets with exploit signatures.",
    type: "PACKET_ANALYSIS",
    difficulty: "intermediate",
    xpReward: 110,
    duration: "25 min",
    tags: ["pcap", "malware", "detection"],
  },
  {
    title: "Credential Leak Hunt",
    description: "Find cleartext credentials exfiltrated inside captured network traffic.",
    type: "PACKET_ANALYSIS",
    difficulty: "intermediate",
    xpReward: 115,
    duration: "26 min",
    tags: ["pcap", "credentials", "leak"],
  },
  {
    title: "PCAP Challenge",
    description: "Rebuild the attack timeline from a multi-stage packet capture.",
    type: "PACKET_ANALYSIS",
    difficulty: "intermediate",
    xpReward: 100,
    duration: "23 min",
    tags: ["pcap", "timeline", "investigation"],
  },
];

function toMission(seed: GameSeed, packId: string): Mission {
  const slug = slugify(seed.title);

  return {
    id: `${packId}-${slug}`,
    slug,
    title: seed.title,
    description: seed.description,
    type: seed.type,
    difficulty: seed.difficulty,
    xpReward: seed.xpReward,
    duration: seed.duration,
    tags: seed.tags,
  };
}

const PACK_ID = "cyber-games-pack-001";

export const cyberGamesPack001: Mission[] = [
  ...LINUX_ARENA.map((seed) => toMission(seed, PACK_ID)),
  ...NETWORKING_ARENA.map((seed) => toMission(seed, PACK_ID)),
  ...PACKET_ANALYSIS_ARENA.map((seed) => toMission(seed, PACK_ID)),
];

export const cyberGamesCategories = {
  linuxArena: {
    title: "Linux Arena",
    description: "Terminal drills, shell puzzles, and Linux command mastery.",
    types: ["LINUX_GAME", "COMMAND_CHALLENGE"] as Mission["type"][],
    slugs: LINUX_ARENA.map((seed) => slugify(seed.title)),
  },
  networkingArena: {
    title: "Networking Arena",
    description: "Ports, protocols, routing, and network defense fundamentals.",
    types: ["NETWORK_GAME"] as Mission["type"][],
    slugs: NETWORKING_ARENA.map((seed) => slugify(seed.title)),
  },
  packetAnalysis: {
    title: "Packet Analysis",
    description: "PCAP investigations, traffic filtering, and credential leak hunts.",
    types: ["PACKET_ANALYSIS"] as Mission["type"][],
    slugs: PACKET_ANALYSIS_ARENA.map((seed) => slugify(seed.title)),
  },
};
