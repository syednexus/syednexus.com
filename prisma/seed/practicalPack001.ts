import { buildLabContent } from "../../lib/labConfig";
import { buildPracticalContent } from "../../lib/practicalConfig";
import { prisma } from "../../lib/prisma";
import { runSeedIfMain } from "./lib/runIfMain";

type SeedMission = {
  title: string;
  slug: string;
  type: string;
  category: string;
  difficulty: string;
  description: string;
  scenario: string;
  content: string;
  answer: string;
  explanation: string;
  hints?: string[];
  xp: number;
};

function xpFor(difficulty: string): number {
  const d = difficulty.toLowerCase();
  if (d.includes("advanced") || d === "hard") return 500;
  if (d.includes("intermediate") || d === "medium") return 250;
  return 100;
}

function linuxGames(): SeedMission[] {
  const items = [
    ["Terminal Escape Room", "cat lab/.hidden_flag", "hidden_in_plain_sight"],
    ["Hidden File Hunter", "ls -la", ".secret"],
    ["chmod Puzzle", "chmod 400 key.txt", "400"],
    ["Grep Detective", "grep -r FLAG", "flag"],
    ["Process Killer", "kill 4412", "4412"],
    ["Filesystem Navigator", "cd /var/log", "auth.log"],
    ["Pipe Master", "cat file | grep error", "error"],
    ["Find the Flag", "find . -name flag*", "flag.txt"],
    ["Permission Fix", "chmod +x script.sh", "executable"],
    ["Shadow Reader", "cat /etc/passwd", "root"],
    ["Archive Extract", "tar -xf backup.tar", "backup"],
    ["String Search", "strings binary", "password"],
    ["History Hunt", "history | tail", "sudo"],
    ["Env Explorer", "printenv PATH", "usr/bin"],
    ["Link Follower", "readlink -f link", "target"],
    ["Disk Usage", "du -sh logs", "logs"],
    ["Sort Challenge", "sort -u list.txt", "sorted"],
    ["Awk Basics", "awk '{print $1}'", "column"],
    ["Sed Replace", "sed 's/old/new/'", "replaced"],
    ["Operator Check", "whoami", "operator"]
  ];

  return items.map(([title, trigger, answer], index) => ({
    title,
    slug: `prac001-game-linux-${String(index + 1).padStart(2, "0")}`,
    type: index % 3 === 0 ? "COMMAND_CHALLENGE" : "LINUX_GAME",
    category: title,
    difficulty: index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced",
    description: `Complete the ${title} challenge using simulated Linux commands.`,
    scenario: `Training VM challenge #${index + 1} — type the correct command sequence.`,
    content: JSON.stringify({ trigger, triggerMatch: "includes" }),
    answer,
    explanation: `The ${trigger.split(" ")[0]} command reveals the objective in this educational simulation.`,
    hints: [`Try: ${trigger}`, "Commands are simulated — no real shell execution."],
    xp: xpFor(index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced")
  }));
}

function networkGames(): SeedMission[] {
  const items = [
    ["Port Hunter", "NETWORK_GAME", "Port Hunter", "443", "Find the HTTPS service port."],
    ["DNS Detective", "NETWORK_GAME", "DNS Recon", "axfr", "Identify zone transfer misconfiguration."],
    ["Firewall Bypass", "NETWORK_GAME", "Firewall", "8443", "Find the alternate admin port."],
    ["Service ID", "NETWORK_GAME", "Service Enumeration", "mysql", "Spot the database service."],
    ["Banner Grab", "NETWORK_GAME", "Banner Grabbing", "openssh", "Read the SSH banner version."],
    ["Subnet Scan", "NETWORK_GAME", "Nmap Simulator", "10.10.2.0", "Identify live staging subnet."],
    ["Protocol Match", "PACKET_ANALYSIS", "Protocol Match", "tcp", "Match protocol to capture."],
    ["Packet Investigation", "PACKET_ANALYSIS", "Packet Investigation", "exfil", "Find data exfiltration frame."],
    ["HTTP Hunt", "PACKET_ANALYSIS", "Packet Analysis", "post", "Spot suspicious POST request."],
    ["DNS Tunnel", "PACKET_ANALYSIS", "Packet Analysis", "dns tunnel", "Detect DNS tunneling."],
    ["ICMP Sweep", "NETWORK_GAME", "Port Hunter", "icmp", "Interpret ping sweep results."],
    ["TLS Inspect", "PACKET_ANALYSIS", "Protocol Match", "tls", "Identify encrypted handshake."],
    ["ARP Scan", "NETWORK_GAME", "Network Scan", "arp", "Map local segment hosts."],
    ["UDP Probe", "NETWORK_GAME", "Port Hunter", "53", "Find DNS service."],
    ["SMB Enum", "NETWORK_GAME", "Service Enumeration", "smb", "Enumerate file sharing."],
    ["FTP Leak", "NETWORK_GAME", "Banner Grabbing", "ftp", "Anonymous FTP indicator."],
    ["VPN Endpoint", "NETWORK_GAME", "DNS Recon", "vpn", "Discover VPN hostname."],
    ["Proxy Detect", "PACKET_ANALYSIS", "Packet Investigation", "proxy", "Identify proxy traffic."],
    ["Beacon Hunt", "PACKET_ANALYSIS", "Packet Investigation", "beacon", "C2 beacon interval."],
    ["Port Knock", "NETWORK_GAME", "Firewall", "knock", "Sequence-based port opening."]
  ];

  return items.map(([title, type, category, answer, desc], index) => ({
    title,
    slug: `prac001-game-net-${String(index + 1).padStart(2, "0")}`,
    type,
    category,
    difficulty: index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced",
    description: desc as string,
    scenario: `Network simulation lab #${index + 1}.`,
    content: JSON.stringify({
      scanTarget: "10.10.1.50",
      ports: [
        { port: 22, service: "ssh", state: "open" },
        { port: 80, service: "http", state: "open" },
        { port: 443, service: "https", state: "open" }
      ]
    }),
    answer: answer as string,
    explanation: `Educational network puzzle — answer derived from simulated scan/packet output.`,
    hints: ["Review open ports and packet flags.", "No real network traffic is generated."],
    xp: xpFor(index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced")
  }));
}

function attackLabs(): SeedMission[] {
  const items = [
    ["Quick Nmap Scan", "RECON", "Nmap Simulator", "3306", "10.10.1.50"],
    ["OSINT Email Format", "OSINT", "OSINT Investigation", "first.last", "nexuscorp.com"],
    ["SQLi Login", "WEB_ATTACK", "SQL Injection", "sql injection", "login"],
    ["Reflected XSS", "WEB_ATTACK", "XSS", "xss", "search"],
    ["Hydra SSH", "PASSWORD_ATTACK", "Hydra Login Investigation", "admin123", "ssh"],
    ["John MD5 Crack", "PASSWORD_ATTACK", "John The Ripper Challenge", "password", "md5"],
    ["Metasploit MS17", "EXPLOITATION", "Metasploit Simulator", "eternalblue", "smb"],
    ["CVE Log4Shell", "EXPLOITATION", "CVE Investigation", "log4shell", "jndi"],
    ["IDOR Invoice", "WEB_ATTACK", "IDOR", "idor", "api"],
    ["Directory Enum", "WEB_ATTACK", "Directory Enumeration", "backup", "gobuster"],
    ["WHOIS Intel", "OSINT", "OSINT Investigation", "typosquatting", "whois"],
    ["Banner FTP", "RECON", "Banner Grabbing", "proftpd", "ftp"],
    ["JWT Forge", "WEB_ATTACK", "JWT Analysis", "jwt", "token"],
    ["Hashcat NTLM", "PASSWORD_ATTACK", "Hashcat Challenge", "1000", "ntlm"],
    ["Payload Pick", "EXPLOITATION", "Payload Selection", "reverse_https", "egress"],
    ["DNS AXFR", "RECON", "Service Enumeration", "axfr", "dns"],
    ["File Upload", "WEB_ATTACK", "File Upload Vulnerability", "file upload", "upload"],
    ["Cookie Flags", "WEB_ATTACK", "Cookie Security", "secure flag", "cookie"],
    ["Exploit Match", "EXPLOITATION", "Exploit Matching", "cve-2018-15473", "openssh"],
    ["Password Spray", "PASSWORD_ATTACK", "Hydra Login Investigation", "password spraying", "azure"]
  ];

  return items.map(([title, type, category, answer, scope], index) => ({
    title,
    slug: `prac001-atk-${String(index + 1).padStart(2, "0")}`,
    type,
    category,
    difficulty: index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced",
    description: `Attack lab: ${title} — safe simulated pentest exercise.`,
    scenario: `Scope: ${scope} — complete the practical objective.`,
    content: buildLabContent(`Practical attack lab #${index + 1}`, {
      target: "10.10.1.50",
      objective: `Complete ${title}`
    }),
    answer: answer as string,
    explanation: `Educational attack simulation for ${category}.`,
    hints: ["Use the interactive lab environment.", "All actions are simulated."],
    xp: xpFor(index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced")
  }));
}

function forensicsLabs(): SeedMission[] {
  const modes = ["evidence", "timeline", "hash"] as const;
  const items = [
    ["Deleted File Recovery", "budget.xlsx", "evidence"],
    ["USB Timeline", "09:14", "timeline"],
    ["Hash Verification", "d41d8cd98f00b204e9800998ecf8427e", "hash"],
    ["Memory Dump Strings", "mimikatz", "evidence"],
    ["Registry Artifact", "run key", "evidence"],
    ["Browser History", "malicious.com", "timeline"],
    ["Shadow Copy", "vss", "evidence"],
    ["MAC Times", "mtime", "timeline"],
    ["SHA256 Match", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "hash"],
    ["Prefetch Analysis", "powershell", "evidence"],
    ["Event Log 4624", "logon", "timeline"],
    ["Recycle Bin ID", "iD", "evidence"],
    ["NTFS MFT", "mft", "evidence"],
    ["Volatility Plugin", "pslist", "hash"],
    ["Email Header", "spf fail", "timeline"],
    ["Cloud Sync", "onedrive", "evidence"],
    ["Mobile Backup", "whatsapp", "evidence"],
    ["Chain of Custody", "sealed", "timeline"],
    ["Steganography", "hidden", "hash"],
    ["Report Finding", "exfiltration", "timeline"]
  ];

  return items.map(([title, answer, mode], index) => {
    const type =
      mode === "hash" ? "MEMORY_ANALYSIS" : mode === "evidence" ? "FILE_RECOVERY" : "FORENSICS";

    return {
      title,
      slug: `prac001-for-${String(index + 1).padStart(2, "0")}`,
      type,
      category: mode === "hash" ? "Hash Analysis" : mode === "timeline" ? "Timeline Analysis" : "Evidence Review",
      difficulty: index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced",
      description: `Forensic investigation: ${title}.`,
      scenario: `Analyst workstation case #${index + 1}.`,
      content: buildPracticalContent(`Forensics practical #${index + 1}`, {
        forensics: {
          mode: modes[index % 3],
          objective: `Identify: ${answer}`
        },
        objective: title
      }),
      answer: answer as string,
      explanation: `Forensic conclusion for ${title} in simulated evidence set.`,
      hints: ["Review artifacts in the evidence viewer.", "Timelines show suspicious ordering."],
      xp: xpFor(index < 7 ? "Beginner" : index < 14 ? "Intermediate" : "Advanced")
    };
  });
}

function toolLabs(): SeedMission[] {
  const tools = [
    ["Nmap Service Scan", "nmap", "443"],
    ["Burp Intercept", "burp", "injection"],
    ["Wireshark Filter", "wireshark", "http"],
    ["Hydra SSH Crack", "hydra", "admin123"],
    ["John Wordlist", "john", "password"],
    ["Hashcat Mode", "hashcat", "1000"],
    ["Metasploit Search", "msf", "eternalblue"],
    ["Nmap UDP Scan", "nmap", "53"],
    ["Burp Repeater", "burp", "csrf"],
    ["Wireshark DNS", "wireshark", "dns"]
  ];

  return tools.map(([title, tool, answer], index) => ({
    title,
    slug: `prac001-tool-${String(index + 1).padStart(2, "0")}`,
    type: "TOOL_SIMULATION",
    category: title,
    difficulty: index < 4 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced",
    description: `Learn ${tool} in the safe tool playground.`,
    scenario: `Tool simulation #${index + 1}.`,
    content: buildPracticalContent(title, {
      tool: { tool: tool as string, defaultCommand: `${tool} --help` },
      objective: title
    }),
    answer: answer as string,
    explanation: `Educational ${tool} simulation — no real execution.`,
    hints: [`Select ${tool} in the playground.`, "Run the simulated command."],
    xp: xpFor(index < 4 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced")
  }));
}

function careerLabs(): SeedMission[] {
  const items = [
    ["SOC Analyst Day 1", "soc", "escalation"],
    ["SOC Analyst Day 2", "soc", "phishing"],
    ["SOC Triage Shift", "soc", "malware"],
    ["SOC Night Watch", "soc", "brute force"],
    ["SOC IR Lead", "soc", "incident"],
    ["Pentester Engagement", "pentest", "report"],
    ["Pentester Web Test", "pentest", "sqli"],
    ["Pentester Report", "pentest", "remediation"],
    ["Junior Analyst Interview", "interview", "siem"],
    ["Security Engineer Interview", "interview", "architecture"]
  ];

  return items.map(([title, mode, answer], index) => ({
    title,
    slug: `prac001-career-${String(index + 1).padStart(2, "0")}`,
    type: "CAREER_SCENARIO",
    category: mode === "pentest" ? "Penetration Tester Day" : mode === "interview" ? "Interview Scenario" : "SOC Analyst Day",
    difficulty: index < 4 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced",
    description: `Career simulation: ${title}.`,
    scenario: `Walk through a realistic ${mode} workflow.`,
    content: buildPracticalContent(title, {
      career: { mode: mode as "soc" | "pentest" | "interview", objective: title },
      objective: title
    }),
    answer,
    explanation: `Career scenario debrief for ${title}.`,
    hints: ["Advance through each timed event.", "Choose appropriate analyst actions."],
    xp: xpFor(index < 4 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced")
  }));
}

export async function seedPracticalPack001() {
  await prisma.mission.deleteMany({
    where: { slug: { startsWith: "prac001-" } }
  });

  const missions: SeedMission[] = [
    ...linuxGames(),
    ...networkGames(),
    ...attackLabs(),
    ...forensicsLabs(),
    ...toolLabs(),
    ...careerLabs()
  ];

  await prisma.mission.createMany({
    skipDuplicates: true,
    data: missions
  });

  console.log(`Nexus Practical Pack 001 seeded (${missions.length} missions)`);
}

async function main() {
  await seedPracticalPack001();
}

runSeedIfMain("practicalPack001", main);
